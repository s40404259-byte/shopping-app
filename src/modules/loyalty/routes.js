function registerLoyaltyRoutes(router, ctx) {
  router.register('GET', '/api/loyalty/balance/:userId', ({ params }) => ({ status: 200, data: ctx.loyaltyService.getBalance(params.userId) }));
  router.register('GET', '/api/loyalty/ledger/:userId', ({ params }) => ({ status: 200, data: ctx.loyaltyService.getLedger(params.userId) }));
  router.register('POST', '/api/loyalty/redeem', ({ body }) => ({ status: 200, data: ctx.loyaltyService.redeem(body) }));
}

module.exports = { registerLoyaltyRoutes };
