const { HttpError } = require('../../lib/http-error');

class InventoryService {
  constructor(catalogService) {
    this.catalogService = catalogService;
    this.reservations = new Map();
  }

  reserve(orderId, items) {
    for (const item of items) {
      const product = this.catalogService.getBySku(item.sku);
      if (product.stock < item.quantity) {
        throw new HttpError(409, `insufficient stock for ${item.sku}`);
      }
    }

    for (const item of items) {
      const product = this.catalogService.getBySku(item.sku);
      product.stock -= item.quantity;
    }

    this.reservations.set(orderId, items);
    return { orderId, status: 'RESERVED' };
  }

  release(orderId) {
    const items = this.reservations.get(orderId);
    if (!items) return;

    for (const item of items) {
      const product = this.catalogService.getBySku(item.sku);
      product.stock += item.quantity;
    }

    this.reservations.delete(orderId);
  }
}

module.exports = { InventoryService };
