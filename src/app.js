const { HttpError } = require('./lib/http-error');
const { Router } = require('./lib/router');
const { createContext } = require('./core/create-context');
const { registerRoutes } = require('./core/register-routes');

function createApp() {
  const context = createContext();
  const router = new Router();

  router.register('GET', '/health', () => ({ status: 200, data: { status: 'ok' } }));
  registerRoutes(router, context);

  return async function handler(req, res) {
    const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    res.setHeader('x-request-id', requestId);
    res.setHeader('content-type', 'application/json');

    try {
      const body = await parseBody(req);
      const url = new URL(req.url, 'http://localhost');
      const path = url.pathname;
      const match = router.match(req.method, path);

      if (!match) {
        return send(res, 404, { error: 'Not Found', path, requestId });
      }

      const query = Object.fromEntries(url.searchParams.entries());
      const result = match.handler({ body, params: match.params, query, requestId });
      return send(res, result.status || 200, result.data);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return send(res, statusCode, {
        error: error.message || 'Internal Server Error',
        details: error.details || null,
        requestId,
      });
    }
  };
}

async function parseBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return {};
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError(400, 'invalid json payload');
  }
}

function send(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

module.exports = { createApp };
