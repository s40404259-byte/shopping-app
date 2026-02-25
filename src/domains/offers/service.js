class OfferService {
  constructor() {
    this.offers = [
      { code: 'BBD10', type: 'PERCENT', value: 10, minAmount: 1000 },
      { code: 'FREESHIP', type: 'FLAT', value: 50, minAmount: 500 },
    ];
  }

  listOffers() {
    return this.offers;
  }

  applyOffer({ amount, code }) {
    const offer = this.offers.find((item) => item.code === code);
    if (!offer || amount < offer.minAmount) return { code, discount: 0, finalAmount: amount };

    const discount = offer.type === 'PERCENT' ? Math.floor((amount * offer.value) / 100) : offer.value;
    return { code, discount, finalAmount: Math.max(0, amount - discount) };
  }
}

module.exports = { OfferService };
