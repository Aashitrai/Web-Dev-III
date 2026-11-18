const mongoose = require('mongoose');

// check the id format first so a wrong id doesn't even reach the database
const validateId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }
  next();
};

// for stock update, "change" has to be a whole number and not 0
// positive = restock, negative = sale
const validateStockChange = (req, res, next) => {
  const { change } = req.body || {};

  if (typeof change !== 'number' || !Number.isInteger(change) || change === 0) {
    return res
      .status(400)
      .json({ message: 'change must be a non-zero whole number' });
  }
  next();
};

module.exports = { validateId, validateStockChange };
