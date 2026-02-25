const { registerAuthRoutes } = require('../modules/auth/routes');
const { registerProfileRoutes } = require('../modules/profile/routes');
const { registerCatalogRoutes } = require('../modules/catalog/routes');
const { registerDiscoveryRoutes } = require('../modules/discovery/routes');
const { registerCartRoutes } = require('../modules/cart/routes');
const { registerLoyaltyRoutes } = require('../modules/loyalty/routes');
const { registerSellerRoutes } = require('../modules/seller/routes');
const { registerCheckoutRoutes } = require('../modules/checkout/routes');
const { registerFulfillmentRoutes } = require('../modules/fulfillment/routes');
const { registerAdminRoutes } = require('../modules/admin/routes');
const { registerShippingRoutes } = require('../modules/shipping/routes');

function registerRoutes(router, ctx) {
  registerAuthRoutes(router, ctx);
  registerProfileRoutes(router, ctx);
  registerCatalogRoutes(router, ctx);
  registerDiscoveryRoutes(router, ctx);
  registerCartRoutes(router, ctx);
  registerLoyaltyRoutes(router, ctx);
  registerSellerRoutes(router, ctx);
  registerCheckoutRoutes(router, ctx);
  registerFulfillmentRoutes(router, ctx);
  registerAdminRoutes(router, ctx);
  registerShippingRoutes(router, ctx);
}

module.exports = { registerRoutes };
