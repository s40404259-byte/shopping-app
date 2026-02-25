function registerCartRoutes(router, ctx) {
  router.register('POST', '/api/cart/items', ({ body }) => ({ status: 200, data: ctx.cartService.addItem(body) }));
  router.register('GET', '/api/cart/:userId', ({ params }) => ({ status: 200, data: ctx.cartService.getCart(params.userId) }));
}

module.exports = { registerCartRoutes };
