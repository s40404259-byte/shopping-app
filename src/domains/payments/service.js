const { HttpError } = require('../../lib/http-error');

class PaymentService {
  constructor() {
    this.payments = new Map();
    this.supportedMethods = new Set(['CARD', 'WALLET', 'COD', 'UPI']);
  }

  authorize({ orderId, amount, method }) {
    const normalizedMethod = String(method || '').trim().toUpperCase();
    if (!this.supportedMethods.has(normalizedMethod)) {
      throw new HttpError(400, 'unsupported payment method; use CARD, WALLET, COD, or UPI');
    }

    const payment = {
      paymentId: `pay_${this.payments.size + 1}`,
      orderId,
      amount,
      method: normalizedMethod,
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
