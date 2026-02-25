function registerAuthRoutes(router, ctx) {
  router.register('POST', '/api/auth/register', ({ body }) => ({ status: 201, data: ctx.authService.register(body) }));
  router.register('POST', '/api/auth/send-otp', ({ body }) => ({ status: 200, data: ctx.authService.sendOtp(body) }));
  router.register('POST', '/api/auth/login', ({ body }) => ({ status: 200, data: ctx.authService.login(body) }));
}

module.exports = { registerAuthRoutes };
