const { HttpError } = require('../../lib/http-error');

class CheckoutService {
  constructor({ cartService, inventoryService, paymentService, orderService, outbox, loyaltyService, logisticsService, notificationService, offerService }) {
    this.cartService = cartService;
    this.inventoryService = inventoryService;
    this.paymentService = paymentService;
    this.orderService = orderService;
    this.outbox = outbox;
    this.loyaltyService = loyaltyService;
    this.logisticsService = logisticsService;
    this.notificationService = notificationService;
    this.offerService = offerService;
    this.idempotency = new Map();
  }

  placeOrder({ userId, paymentMethod, idempotencyKey, offerCode = null, redeemCoins = 0 }) {
    if (!userId || !paymentMethod || !idempotencyKey) {
      throw new HttpError(400, 'userId, paymentMethod and idempotencyKey are required');
    }

    const existing = this.idempotency.get(idempotencyKey);
    if (existing) return existing;

    const cart = this.cartService.getCart(userId);
    if (!cart.items.length) {
      throw new HttpError(400, 'cart is empty');
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const offerResult = offerCode ? this.offerService.applyOffer({ amount: cart.totalAmount, code: offerCode }) : { discount: 0, finalAmount: cart.totalAmount, code: null };
    const redeemAmount = Math.max(0, Math.floor(redeemCoins));

    try {
      this.inventoryService.reserve(orderId, cart.items);
      if (redeemAmount > 0) {
        this.loyaltyService.redeem({ userId, coins: redeemAmount });
      }

      const payableAmount = Math.max(0, offerResult.finalAmount - redeemAmount);
      const payment = this.paymentService.authorize({
        orderId,
        amount: payableAmount,
        method: paymentMethod,
      });
      const order = this.orderService.create({
        orderId,
        userId,
        items: cart.items,
        amount: payableAmount,
        paymentId: payment.paymentId,
      });
      const shipment = this.logisticsService.assign(order);
      const loyalty = this.loyaltyService.earn({ userId, orderId, amount: payableAmount });

      this.outbox.enqueue('payment.authorized.v1', {
        orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
      });
      this.outbox.enqueue('order.confirmed.v1', {
        orderId,
        userId,
        amount: order.amount,
      });
      this.outbox.enqueue('shipment.assigned.v1', {
        orderId,
        shipmentId: shipment.shipmentId,
        etaMinutes: shipment.etaMinutes,
      });
      this.outbox.flush();

      const notification = this.notificationService.send({
        userId,
        channel: 'PUSH',
        template: 'ORDER_CONFIRMED',
        payload: { orderId, amount: order.amount },
      });

      this.cartService.clearCart(userId);

      const result = { order, payment, shipment, offer: offerResult, loyalty, notification };
      this.idempotency.set(idempotencyKey, result);
      return result;
    } catch (error) {
      this.inventoryService.release(orderId);
      this.paymentService.refund(orderId);
      throw error;
    }
  }
}

module.exports = { CheckoutService };
