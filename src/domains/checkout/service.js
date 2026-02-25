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
    this.idempotencyByUser = new Map();
  }

  placeOrder({ userId, paymentMethod, idempotencyKey, offerCode = null, redeemCoins = 0 }) {
    if (!userId || !paymentMethod || !idempotencyKey) {
      throw new HttpError(400, 'userId, paymentMethod and idempotencyKey are required');
    }

    const normalizedRequest = {
      paymentMethod,
      offerCode: offerCode || null,
      redeemCoins: Math.max(0, Math.floor(redeemCoins)),
    };

    const idempotencyStore = this.#getUserIdempotencyStore(userId);
    const existing = idempotencyStore.get(idempotencyKey);
    if (existing) {
      if (!this.#isSameIdempotencyRequest(existing.request, normalizedRequest)) {
        throw new HttpError(409, 'idempotency key reuse with different payload is not allowed');
      }
      return existing.result;
    }

    const cart = this.cartService.getCart(userId);
    if (!cart.items.length) {
      throw new HttpError(400, 'cart is empty');
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const offerResult = offerCode
      ? this.offerService.applyOffer({ amount: cart.totalAmount, code: offerCode })
      : { discount: 0, finalAmount: cart.totalAmount, code: null };

    try {
      this.inventoryService.reserve(orderId, cart.items);
      if (normalizedRequest.redeemCoins > 0) {
        this.loyaltyService.redeem({ userId, coins: normalizedRequest.redeemCoins });
      }

      const payableAmount = Math.max(0, offerResult.finalAmount - normalizedRequest.redeemCoins);
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
      idempotencyStore.set(idempotencyKey, { request: normalizedRequest, result });
      return result;
    } catch (error) {
      this.inventoryService.release(orderId);
      this.paymentService.refund(orderId);
      throw error;
    }
  }

  #getUserIdempotencyStore(userId) {
    if (!this.idempotencyByUser.has(userId)) {
      this.idempotencyByUser.set(userId, new Map());
    }
    return this.idempotencyByUser.get(userId);
  }

  #isSameIdempotencyRequest(savedRequest, incomingRequest) {
    return (
      savedRequest.paymentMethod === incomingRequest.paymentMethod
      && savedRequest.offerCode === incomingRequest.offerCode
      && savedRequest.redeemCoins === incomingRequest.redeemCoins
    );
  }
}

module.exports = { CheckoutService };
