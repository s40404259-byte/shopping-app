function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    error: err.message || 'Internal Server Error',
    details: err.details || null,
    requestId: req.requestId,
  };

  if (statusCode >= 500) {
    console.error('Unhandled error', { requestId: req.requestId, error: err });
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorHandler };
