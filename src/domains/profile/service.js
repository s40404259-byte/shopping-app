const { HttpError } = require('../../lib/http-error');

class ProfileService {
  constructor() {
    this.profiles = new Map();
  }

  upsertProfile({ userId, name, phone, preferredLanguage = 'en', addresses = [] }) {
    if (!userId) throw new HttpError(400, 'userId is required');
    const existing = this.profiles.get(userId) || { userId, createdAt: new Date().toISOString() };
    const profile = {
      ...existing,
      name: name ?? existing.name ?? null,
      phone: phone ?? existing.phone ?? null,
      preferredLanguage,
      addresses,
      updatedAt: new Date().toISOString(),
    };
    this.profiles.set(userId, profile);
    return profile;
  }

  getProfile(userId) {
    const profile = this.profiles.get(userId);
    if (!profile) throw new HttpError(404, 'profile not found');
    return profile;
  }
}

module.exports = { ProfileService };
