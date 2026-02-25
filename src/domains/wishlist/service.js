const { HttpError } = require('../../lib/http-error');

class WishlistService {
  constructor(catalogService) {
    this.catalogService = catalogService;
    this.wishlists = new Map();
  }

  addItem({ userId, sku }) {
    if (!userId || !sku) throw new HttpError(400, 'userId and sku are required');
    this.catalogService.getBySku(sku);
    const items = this.wishlists.get(userId) || [];
    if (!items.includes(sku)) items.push(sku);
    this.wishlists.set(userId, items);
    return { userId, items };
  }

  getWishlist(userId) {
    return { userId, items: this.wishlists.get(userId) || [] };
  }
}

module.exports = { WishlistService };
