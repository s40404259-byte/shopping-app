class AdminService {
  constructor({ catalogService, sellerService, orderService }) {
    this.catalogService = catalogService;
    this.sellerService = sellerService;
    this.orderService = orderService;
  }

  createProduct(payload) {
    return this.catalogService.createProduct(payload);
  }

  updateProduct(sku, payload) {
    return this.catalogService.updateProduct(sku, payload);
  }

  updateInventory(sku, stock) {
    return this.catalogService.updateStock(sku, stock);
  }

  listOutOfStock() {
    return this.catalogService.listOutOfStock();
  }

  getOverview() {
    const products = this.catalogService.listProducts();
    const orders = this.orderService.list();
    const sellers = this.sellerService.list();

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      totalSellers: sellers.length,
      outOfStockCount: products.filter((product) => product.stock === 0).length,
    };
  }
}

module.exports = { AdminService };
