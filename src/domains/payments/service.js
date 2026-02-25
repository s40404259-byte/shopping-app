class PaymentService {
  constructor() {
    this.payments = new Map();
  }

  authorize({ orderId, amount, method }) {
    const payment = {
      paymentId: `pay_${this.payments.size + 1}`,
      orderId,
      amount,
      method,
      status: 'AUTHORIZED',
      createdAt: new Date().toISOString(),
    };

    this.payments.set(orderId, payment);
    return payment;
  }

  refund(orderId) {
    const payment = this.payments.get(orderId);
    if (!payment) return null;
    payment.status = 'REFUNDED';
    return payment;
  }
}

module.exports = { PaymentService };
