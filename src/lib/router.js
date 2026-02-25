class Router {
  constructor() {
    this.routes = [];
  }

  register(method, pattern, handler) {
    const { regex, keys } = compilePattern(pattern);
    this.routes.push({ method: method.toUpperCase(), pattern, regex, keys, handler });
  }

  match(method, path) {
    const m = method.toUpperCase();
    for (const route of this.routes) {
      if (route.method !== m) continue;
      const result = route.regex.exec(path);
      if (!result) continue;
      const params = {};
      route.keys.forEach((key, idx) => {
        params[key] = decodeURIComponent(result[idx + 1]);
      });
      return { handler: route.handler, params };
    }
    return null;
  }
}

function compilePattern(pattern) {
  const keys = [];
  const escaped = pattern
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        keys.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');

  return {
    keys,
    regex: new RegExp(`^${escaped}$`),
  };
}

module.exports = { Router };
