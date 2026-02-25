function notFound(req, res) {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    requestId: req.requestId,
  });
}

module.exports = { notFound };
