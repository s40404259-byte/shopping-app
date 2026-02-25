function registerSellerRoutes(router, ctx) {
  router.register('POST', '/api/sellers', ({ body }) => ({ status: 201, data: ctx.sellerService.onboard(body) }));
  router.register('GET', '/api/sellers', () => ({ status: 200, data: ctx.sellerService.list() }));
  router.register('GET', '/api/sellers/:sellerId', ({ params }) => ({ status: 200, data: ctx.sellerService.get(params.sellerId) }));
  router.register('GET', '/api/sellers/:sellerId/dashboard', ({ params }) => ({ status: 200, data: ctx.sellerService.dashboard(params.sellerId) }));
}

module.exports = { registerSellerRoutes };
