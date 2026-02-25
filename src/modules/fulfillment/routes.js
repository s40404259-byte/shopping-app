const { HttpError } = require('../../lib/http-error');

function registerFulfillmentRoutes(router, ctx) {
  router.register('GET', '/api/orders', () => ({ status: 200, data: ctx.orderService.list() }));
  router.register('GET', '/api/orders/user/:userId', ({ params }) => ({ status: 200, data: ctx.orderService.listByUser(params.userId) }));
  router.register('GET', '/api/orders/:orderId', ({ params }) => {
    const order = ctx.orderService.get(params.orderId);
    if (!order) throw new HttpError(404, 'order not found');
    return { status: 200, data: order };
  });

  router.register('GET', '/api/shipments/:orderId', ({ params }) => {
    const shipment = ctx.logisticsService.track(params.orderId);
    if (!shipment) throw new HttpError(404, 'shipment not found');
    return { status: 200, data: shipment };
  });

  router.register('POST', '/api/returns', ({ body }) => ({ status: 201, data: ctx.returnService.requestReturn(body) }));
  router.register('GET', '/api/returns/:returnId', ({ params }) => ({ status: 200, data: ctx.returnService.get(params.returnId) }));
  router.register('GET', '/api/notifications/:userId', ({ params }) => ({ status: 200, data: ctx.notificationService.list(params.userId) }));
}

module.exports = { registerFulfillmentRoutes };
