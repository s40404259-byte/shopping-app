const { HttpError } = require('../../lib/http-error');

class CatalogService {
  constructor() {
    this.products = new Map();
  }

  createProduct({ sku, name, price, stock = 0, sellerId, description = '', category = 'general', brand = '' }) {
    if (!sku || !name || typeof price !== 'number') {
      throw new HttpError(400, 'sku, name and numeric price are required');
    }
    if (!sellerId) {
      throw new HttpError(400, 'sellerId is required');
    }
    if (this.products.has(sku)) {
      throw new HttpError(409, 'product already exists');
    }

    const product = {
      sku,
      name,
      description,
      category,
      brand,
      sellerId,
      price,
      stock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.set(sku, product);
    return product;
  }

  updateProduct(sku, updates = {}) {
    const product = this.getBySku(sku);
    const next = {
      ...product,
      name: updates.name ?? product.name,
      description: updates.description ?? product.description,
      category: updates.category ?? product.category,
      brand: updates.brand ?? product.brand,
      price: typeof updates.price === 'number' ? updates.price : product.price,
      updatedAt: new Date().toISOString(),
    };
    this.products.set(sku, next);
    return next;
  }

  updateStock(sku, stock) {
    if (!Number.isInteger(stock) || stock < 0) throw new HttpError(400, 'stock must be a non-negative integer');
    const product = this.getBySku(sku);
    product.stock = stock;
    product.updatedAt = new Date().toISOString();
    return product;
  }

  listOutOfStock() {
    return this.listProducts().filter((product) => product.stock === 0);
  }

  listProducts() {
    return Array.from(this.products.values());
  }

  getBySku(sku) {
    const product = this.products.get(sku);
    if (!product) throw new HttpError(404, 'product not found');
    return product;
  }
}

module.exports = { CatalogService };
