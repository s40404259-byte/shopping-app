const { HttpError } = require('../../lib/http-error');

class ProfileService {
  constructor() {
    this.profiles = new Map();
  }

  upsertProfile({ userId, name, phone, preferredLanguage = 'en', addresses = [] }) {
    if (!userId) throw new HttpError(400, 'userId is required');
    const existing = this.profiles.get(userId) || { userId, createdAt: new Date().toISOString(), addresses: [] };
    const profile = {
      ...existing,
      name: name ?? existing.name ?? null,
      phone: phone ?? existing.phone ?? null,
      preferredLanguage,
      addresses: Array.isArray(addresses) ? addresses : existing.addresses,
      updatedAt: new Date().toISOString(),
    };
    this.profiles.set(userId, profile);
    return profile;
  }

  addAddress({ userId, addressLine, city, state, pincode, country = 'India', latitude = null, longitude = null, tag = 'Home' }) {
    if (!userId || !addressLine || !city || !state || !pincode) {
      throw new HttpError(400, 'userId, addressLine, city, state, pincode are required');
    }
    const profile = this.profiles.get(userId) || this.upsertProfile({ userId });
    const address = {
      id: `addr_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
      addressLine,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
      tag,
      createdAt: new Date().toISOString(),
    };
    profile.addresses = [...(profile.addresses || []), address];
    profile.updatedAt = new Date().toISOString();
    this.profiles.set(userId, profile);
    return address;
  }

  getAddresses(userId) {
    const profile = this.getProfile(userId);
    return profile.addresses || [];
  }

  getProfile(userId) {
    const profile = this.profiles.get(userId);
    if (!profile) throw new HttpError(404, 'profile not found');
    return profile;
  }
}

module.exports = { ProfileService };
