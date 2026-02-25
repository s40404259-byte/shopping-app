function registerCatalogRoutes(router, ctx) {
  router.register('POST', '/api/catalog/products', ({ body }) => ({ status: 201, data: ctx.catalogService.createProduct(body) }));
  router.register('GET', '/api/catalog/products', () => ({ status: 200, data: ctx.catalogService.listProducts() }));
  router.register('GET', '/api/catalog/products/:sku', ({ params }) => ({ status: 200, data: ctx.catalogService.getBySku(params.sku) }));
}

module.exports = { registerCatalogRoutes };
