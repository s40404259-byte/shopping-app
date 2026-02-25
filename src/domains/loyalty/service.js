const { HttpError } = require('../../lib/http-error');

class LoyaltyService {
  constructor() {
    this.wallet = new Map();
    this.ledger = [];
  }

  getBalance(userId) {
    return { userId, superCoins: this.wallet.get(userId) || 0 };
  }

  earn({ userId, orderId, amount }) {
    if (!userId || !orderId || typeof amount !== 'number') throw new HttpError(400, 'invalid earn payload');
    const earned = Math.floor(amount / 100);
    const balance = (this.wallet.get(userId) || 0) + earned;
    this.wallet.set(userId, balance);
    this.ledger.push({ userId, orderId, type: 'EARN', coins: earned, balance, ts: new Date().toISOString() });
    return { userId, earned, superCoins: balance };
  }

  redeem({ userId, coins }) {
    if (!userId || !Number.isInteger(coins) || coins <= 0) throw new HttpError(400, 'invalid redeem payload');
    const current = this.wallet.get(userId) || 0;
    if (current < coins) throw new HttpError(409, 'insufficient supercoins');
    const balance = current - coins;
    this.wallet.set(userId, balance);
    this.ledger.push({ userId, type: 'REDEEM', coins, balance, ts: new Date().toISOString() });
    return { userId, redeemed: coins, superCoins: balance };
  }

  getLedger(userId) {
    return this.ledger.filter((entry) => entry.userId === userId);
  }
}

module.exports = { LoyaltyService };
