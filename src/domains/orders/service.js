class OrderService {
  constructor() {
    this.orders = new Map();
  }

  create({ orderId, userId, items, amount, paymentId }) {
    const order = {
      orderId,
      userId,
      items,
      amount,
      paymentId,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    this.orders.set(orderId, order);
    return order;
  }

  get(orderId) {
    return this.orders.get(orderId) || null;
  }

  list() {
    return Array.from(this.orders.values());
  }

  listByUser(userId) {
    return this.list().filter((order) => order.userId === userId);
  }

  sellerSummary(sellerId) {
    const sellerOrders = this.list().filter((order) =>
      order.items.some((item) => item.sellerId === sellerId)
    );

    let revenue = 0;
    let soldItems = 0;

    for (const order of sellerOrders) {
      for (const item of order.items) {
        if (item.sellerId !== sellerId) continue;
        revenue += item.price * item.quantity;
        soldItems += item.quantity;
      }
    }

    return {
      sellerId,
      totalOrders: sellerOrders.length,
      soldItems,
      revenue,
    };
  }
}

module.exports = { OrderService };
