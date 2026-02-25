const { EventBus } = require('../lib/event-bus');
const { Outbox } = require('../lib/outbox');

const { AuthService } = require('../domains/auth/service');
const { ProfileService } = require('../domains/profile/service');
const { CatalogService } = require('../domains/catalog/service');
const { SearchService } = require('../domains/search/service');
const { CartService } = require('../domains/cart/service');
const { WishlistService } = require('../domains/wishlist/service');
const { OfferService } = require('../domains/offers/service');
const { LoyaltyService } = require('../domains/loyalty/service');
const { SellerService } = require('../domains/seller/service');
const { InventoryService } = require('../domains/inventory/service');
const { PaymentService } = require('../domains/payments/service');
const { OrderService } = require('../domains/orders/service');
const { LogisticsService } = require('../domains/logistics/service');
const { ReturnService } = require('../domains/returns/service');
const { NotificationService } = require('../domains/notifications/service');
const { CheckoutService } = require('../domains/checkout/service');
const { AdminService } = require('../domains/admin/service');

function createContext() {
  const eventBus = new EventBus();
  const outbox = new Outbox(eventBus);

  const authService = new AuthService();
  const profileService = new ProfileService();
  const catalogService = new CatalogService();
  const searchService = new SearchService(catalogService);
  const cartService = new CartService(catalogService);
  const wishlistService = new WishlistService(catalogService);
  const offerService = new OfferService();
  const loyaltyService = new LoyaltyService();
  const orderService = new OrderService();
  const sellerService = new SellerService(catalogService, orderService);
  const inventoryService = new InventoryService(catalogService);
  const paymentService = new PaymentService();
  const logisticsService = new LogisticsService();
  const returnService = new ReturnService(orderService);
  const notificationService = new NotificationService();
  const adminService = new AdminService({ catalogService, sellerService, orderService });

  const checkoutService = new CheckoutService({
    cartService,
    inventoryService,
    paymentService,
    orderService,
    outbox,
    loyaltyService,
    logisticsService,
    notificationService,
    offerService,
  });

  eventBus.subscribe('order.confirmed.v1', (event) => {
    console.log('event:', event.topic, event.payload.orderId);
  });

  return {
    authService,
    profileService,
    catalogService,
    searchService,
    cartService,
    wishlistService,
    offerService,
    loyaltyService,
    sellerService,
    orderService,
    logisticsService,
    returnService,
    notificationService,
    checkoutService,
    adminService,
  };
}

module.exports = { createContext };
