class LogisticsService {
  constructor() {
    this.shipments = new Map();
  }

  assign(order) {
    const shipment = {
      shipmentId: `shp_${this.shipments.size + 1}`,
      orderId: order.orderId,
      mode: order.amount < 1000 ? 'MINUTES' : 'EKART',
      etaMinutes: order.amount < 1000 ? 15 : 1440,
      status: 'ASSIGNED',
      trackingEvents: [{ status: 'ASSIGNED', ts: new Date().toISOString() }],
    };
    this.shipments.set(order.orderId, shipment);
    return shipment;
  }

  track(orderId) {
    return this.shipments.get(orderId) || null;
  }
}

module.exports = { LogisticsService };
