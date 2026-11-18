// any route that is not defined comes here
const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
};

// all errors passed with next(error) end up here
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Something went wrong on the server';

  // schema validation failed (required, min, match etc.)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // wrong data type, for example price: "abc"
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  // duplicate sku
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `A product with this ${field} already exists`;
  }

  // body is not valid JSON
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
