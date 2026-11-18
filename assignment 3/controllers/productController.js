const Product = require('../models/Product');

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// GET /api/products
// query options: category, supplier, search, minPrice, maxPrice, inStock, sort, page, limit
// example: /api/products?category=Electronics&minPrice=500&sort=-price&page=1&limit=5
const getProducts = async (req, res, next) => {
  try {
    const { category, supplier, search, minPrice, maxPrice, inStock, sort } =
      req.query;

    const filter = {};

    if (category) filter.category = category;
    if (supplier) filter.supplier = supplier;

    // search by name, ignoring case
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: safeSearch, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true') filter.quantity = { $gt: 0 };

    // sort=price,-quantity  becomes  "price -quantity"
    const sortBy = sort ? sort.split(',').join(' ') : '-createdAt';

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/products/:id/stock
// body: { "change": 10 } for restock, { "change": -3 } for a sale
const updateStock = async (req, res, next) => {
  try {
    const { change } = req.body;

    // for a sale the product only gets updated if enough quantity is there,
    // so the stock can never go below 0
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, quantity: { $gte: change < 0 ? -change : 0 } },
      { $inc: { quantity: change } },
      { returnDocument: 'after' }
    );

    if (!product) {
      const exists = await Product.exists({ _id: req.params.id });
      if (!exists) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(400).json({ message: 'Not enough stock for this sale' });
    }

    res.json({ message: 'Stock updated', product });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted', id: product._id });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/low-stock
// products whose quantity is at or below their reorder level
const getLowStock = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] },
    }).sort('quantity');

    res.json({ count: lowStockItems.length, lowStockItems });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/summary
// groups products by category and gives totals for each one
const getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { totalStockValue: -1 } },
    ]);

    res.json({ categories: summary.length, summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateStock,
  deleteProduct,
  getLowStock,
  getCategorySummary,
};
