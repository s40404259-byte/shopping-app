const { HttpError } = require('../../lib/http-error');

class CartService {
  constructor(catalogService) {
    this.catalogService = catalogService;
    this.carts = new Map();
  }

  addItem({ userId, sku, quantity }) {
    if (!userId || !sku || !Number.isInteger(quantity) || quantity <= 0) {
      throw new HttpError(400, 'userId, sku, positive integer quantity are required');
    }

    const product = this.catalogService.getBySku(sku);
    const currentCart = this.carts.get(userId) || [];
    const existing = currentCart.find((item) => item.sku === sku);
    const existingQty = existing ? existing.quantity : 0;
    const requestedQty = existingQty + quantity;

    if (requestedQty > product.stock) {
      throw new HttpError(409, `only ${product.stock} unit(s) available for ${sku}`);
    }

    if (existing) existing.quantity = requestedQty;
    else currentCart.push({ sku, quantity, price: product.price, name: product.name, sellerId: product.sellerId });

    this.carts.set(userId, currentCart);
    return this.getCart(userId);
  }

  getCart(userId) {
    const items = this.carts.get(userId) || [];
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return { userId, items, totalAmount };
  }

  clearCart(userId) {
    this.carts.delete(userId);
  }
}

module.exports = { CartService };
