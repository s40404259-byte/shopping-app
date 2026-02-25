const { HttpError } = require('../../lib/http-error');

class SellerService {
  constructor(catalogService, orderService) {
    this.catalogService = catalogService;
    this.orderService = orderService;
    this.sellers = new Map();
  }

  onboard({ sellerId, legalName, gstin }) {
    if (!sellerId || !legalName) throw new HttpError(400, 'sellerId and legalName are required');
    const seller = {
      sellerId,
      legalName,
      gstin: gstin || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      commissionPolicy: 'ZERO_BELOW_1000',
    };
    this.sellers.set(sellerId, seller);
    return seller;
  }

  get(sellerId) {
    const seller = this.sellers.get(sellerId);
    if (!seller) throw new HttpError(404, 'seller not found');
    return seller;
  }

  list() {
    return Array.from(this.sellers.values());
  }

  dashboard(sellerId) {
    this.get(sellerId);
    const products = this.catalogService.listProducts().filter((item) => item.sellerId === sellerId);
    const inventoryLeft = products.reduce((sum, product) => sum + product.stock, 0);
    const outOfStockCount = products.filter((product) => product.stock === 0).length;
    const sales = this.orderService.sellerSummary(sellerId);

    return {
      sellerId,
      totalProducts: products.length,
      inventoryLeft,
      outOfStockCount,
      ...sales,
    };
  }
}

module.exports = { SellerService };
