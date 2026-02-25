class ShippingService {
  quote({ lat, lng, itemsCount = 1, subtotal = 0 }) {
    const storeLat = 12.9716;
    const storeLng = 77.5946;

    const useCoords = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
    const distanceKm = useCoords ? haversineKm(storeLat, storeLng, Number(lat), Number(lng)) : 10;

    const baseCharge = 40;
    const distanceCharge = Math.round(distanceKm * 6);
    const handlingCharge = Math.max(10, Number(itemsCount) * 5);
    const platformFee = Number(subtotal) >= 1000 ? 0 : 15;

    return {
      distanceKm: Number(distanceKm.toFixed(2)),
      etaMinutes: Math.max(20, Math.round(distanceKm * 5)),
      charges: { baseCharge, distanceCharge, handlingCharge, platformFee },
      totalShipping: baseCharge + distanceCharge + handlingCharge + platformFee,
    };
  }
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

module.exports = { ShippingService };
