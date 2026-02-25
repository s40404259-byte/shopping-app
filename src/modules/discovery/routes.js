function registerDiscoveryRoutes(router, ctx) {
  router.register('GET', '/api/search', ({ query }) => ({
    status: 200,
    data: ctx.searchService.query({
      q: query.q || '',
      minPrice: Number(query.minPrice || 0),
      maxPrice: Number(query.maxPrice || Number.MAX_SAFE_INTEGER),
    }),
  }));

  router.register('POST', '/api/wishlist/items', ({ body }) => ({ status: 200, data: ctx.wishlistService.addItem(body) }));
  router.register('GET', '/api/wishlist/:userId', ({ params }) => ({ status: 200, data: ctx.wishlistService.getWishlist(params.userId) }));
  router.register('GET', '/api/offers', () => ({ status: 200, data: ctx.offerService.listOffers() }));
}

module.exports = { registerDiscoveryRoutes };
