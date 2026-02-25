function registerAdminRoutes(router, ctx) {
  router.register('GET', '/api/admin/overview', () => ({ status: 200, data: ctx.adminService.getOverview() }));
  router.register('GET', '/api/admin/out-of-stock', () => ({ status: 200, data: ctx.adminService.listOutOfStock() }));

  router.register('POST', '/api/admin/products', ({ body }) => ({ status: 201, data: ctx.adminService.createProduct(body) }));
  router.register('PUT', '/api/admin/products/:sku', ({ params, body }) => ({ status: 200, data: ctx.adminService.updateProduct(params.sku, body) }));
  router.register('PUT', '/api/admin/products/:sku/stock', ({ params, body }) => ({
    status: 200,
    data: ctx.adminService.updateInventory(params.sku, body.stock),
  }));
}

module.exports = { registerAdminRoutes };
