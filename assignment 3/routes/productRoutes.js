const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateStock,
  deleteProduct,
  getLowStock,
  getCategorySummary,
} = require('../controllers/productController');
const { validateId, validateStockChange } = require('../middleware/validate');

const router = express.Router();

// report routes are kept above /:id, otherwise "low-stock" and "summary"
// would be treated as an id
router.get('/low-stock', getLowStock);
router.get('/summary', getCategorySummary);

router.route('/').get(getProducts).post(createProduct);

router
  .route('/:id')
  .get(validateId, getProductById)
  .put(validateId, updateProduct)
  .delete(validateId, deleteProduct);

router.patch('/:id/stock', validateId, validateStockChange, updateStock);

module.exports = router;
