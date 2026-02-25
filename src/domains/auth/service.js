const { HttpError } = require('../../lib/http-error');

class AuthService {
  constructor() {
    this.usersById = new Map();
    this.usersByEmail = new Map();
    this.usersByPhone = new Map();
    this.usersByGoogleEmail = new Map();
    this.otpStore = new Map();
  }

  register({ email, phone, password, name = null, provider = 'password', googleEmail }) {
    if (provider === 'google') {
      if (!googleEmail) throw new HttpError(400, 'googleEmail is required for google signup');
      if (this.usersByGoogleEmail.has(googleEmail)) throw new HttpError(409, 'user already exists');

      const user = this.#createUser({ email: googleEmail, name, authProvider: 'google' });
      this.usersByGoogleEmail.set(googleEmail, user.id);
      this.usersByEmail.set(googleEmail, user.id);
      return user;
    }

    if (!password) throw new HttpError(400, 'password is required');
    if (!email && !phone) throw new HttpError(400, 'email or phone is required');

    if (email && this.usersByEmail.has(email)) throw new HttpError(409, 'user already exists');
    if (phone && this.usersByPhone.has(phone)) throw new HttpError(409, 'user already exists');

    const user = this.#createUser({ email: email || null, phone: phone || null, name, authProvider: 'password' });
    user.password = password;

    if (email) this.usersByEmail.set(email, user.id);
    if (phone) this.usersByPhone.set(phone, user.id);

    return this.#publicUser(user);
  }

  sendOtp({ phone, email }) {
    const channel = phone ? 'phone' : 'email';
    const target = phone || email;

    if (!target) throw new HttpError(400, 'phone or email is required');

    const user = this.#findByEmailOrPhone({ email, phone });
    if (!user) throw new HttpError(404, 'account not found');

    const otp = '123456';
    this.otpStore.set(`${channel}:${target}`, otp);
    return {
      channel,
      target,
      otpSent: true,
      otpHint: 'Use 123456 in this demo backend',
    };
  }

  login({ email, phone, password, provider = 'password', googleEmail, otp }) {
    if (provider === 'google') {
      if (!googleEmail) throw new HttpError(400, 'googleEmail is required for google login');
      const userId = this.usersByGoogleEmail.get(googleEmail) || this.usersByEmail.get(googleEmail);
      if (!userId) throw new HttpError(404, 'google user not found; please signup first');
      const user = this.usersById.get(userId);
      return this.#session(user, 'google');
    }

    const user = this.#findByEmailOrPhone({ email, phone });

    if (otp) {
      const channel = phone ? 'phone' : 'email';
      const target = phone || email;
      const expectedOtp = this.otpStore.get(`${channel}:${target}`);
      if (!expectedOtp || expectedOtp !== otp) throw new HttpError(401, 'invalid otp');
      this.otpStore.delete(`${channel}:${target}`);
      return this.#session(user, 'otp');
    }

    if (!password || user.password !== password) throw new HttpError(401, 'invalid credentials');
    return this.#session(user, 'password');
  }

  #findByEmailOrPhone({ email, phone }) {
    if (!email && !phone) throw new HttpError(400, 'email or phone is required');

    let userId = null;
    if (email) userId = this.usersByEmail.get(email);
    if (!userId && phone) userId = this.usersByPhone.get(phone);
    if (!userId) throw new HttpError(401, 'invalid credentials');

    return this.usersById.get(userId);
  }

  #createUser({ email = null, phone = null, name = null, authProvider }) {
    const user = {
      id: `user_${this.usersById.size + 1}`,
      email,
      phone,
      name,
      authProvider,
      createdAt: new Date().toISOString(),
    };
    this.usersById.set(user.id, user);
    return user;
  }

  #publicUser(user) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    };
  }

  #session(user, loginMethod) {
    return {
      accessToken: `token_${user.id}`,
      loginMethod,
      user: this.#publicUser(user),
    };
  }
}

module.exports = { AuthService };
