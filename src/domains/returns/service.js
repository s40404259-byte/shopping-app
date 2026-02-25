const { HttpError } = require('../../lib/http-error');

class ReturnService {
  constructor(orderService) {
    this.orderService = orderService;
    this.returns = new Map();
  }

  requestReturn({ orderId, reason }) {
    const order = this.orderService.get(orderId);
    if (!order) throw new HttpError(404, 'order not found');
    const request = {
      returnId: `ret_${this.returns.size + 1}`,
      orderId,
      reason: reason || 'NO_REASON',
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };
    this.returns.set(request.returnId, request);
    return request;
  }

  get(returnId) {
    const item = this.returns.get(returnId);
    if (!item) throw new HttpError(404, 'return request not found');
    return item;
  }
}

module.exports = { ReturnService };
