function requestId(req, res, next) {
  req.requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  res.setHeader('x-request-id', req.requestId);
  next();
}

module.exports = { requestId };
