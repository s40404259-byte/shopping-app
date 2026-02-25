function registerShippingRoutes(router, ctx) {
  router.register('POST', '/api/shipping/quote', ({ body }) => ({
    status: 200,
    data: ctx.shippingService.quote(body),
  }));
}

module.exports = { registerShippingRoutes };
