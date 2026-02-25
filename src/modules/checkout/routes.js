function registerCheckoutRoutes(router, ctx) {
  router.register('POST', '/api/checkout', ({ body }) => ({ status: 201, data: ctx.checkoutService.placeOrder(body) }));
}

module.exports = { registerCheckoutRoutes };
