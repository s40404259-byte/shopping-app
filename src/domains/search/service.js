class SearchService {
  constructor(catalogService) {
    this.catalogService = catalogService;
  }

  query({ q = '', minPrice = 0, maxPrice = Number.MAX_SAFE_INTEGER }) {
    const needle = q.trim().toLowerCase();
    return this.catalogService
      .listProducts()
      .filter((p) => p.price >= Number(minPrice) && p.price <= Number(maxPrice))
      .filter((p) => !needle || p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle));
  }
}

module.exports = { SearchService };
