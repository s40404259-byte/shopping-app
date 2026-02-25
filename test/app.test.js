const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createApp } = require('../src/app');

let server;
let baseUrl;

test.before(async () => {
  const handler = createApp();
  await new Promise((resolve) => {
    server = http.createServer(handler).listen(0, resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

test('health endpoint returns ok', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.status, 'ok');
});

test('auth supports email signup/login, phone otp login, and google login', async () => {
  let response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'email-user@example.com', password: 'secret' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'email-user@example.com', password: 'secret' }),
  });
  assert.equal(response.status, 200);
  const emailLogin = await response.json();
  assert.equal(emailLogin.loginMethod, 'password');

  response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: '9999999999', password: 'phone-secret' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/auth/send-otp`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: '9999999999' }),
  });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: '9999999999', otp: '123456' }),
  });
  assert.equal(response.status, 200);
  const phoneLogin = await response.json();
  assert.equal(phoneLogin.loginMethod, 'otp');

  response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ provider: 'google', googleEmail: 'gmail-user@gmail.com' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ provider: 'google', googleEmail: 'gmail-user@gmail.com' }),
  });
  assert.equal(response.status, 200);
  const googleLogin = await response.json();
  assert.equal(googleLogin.loginMethod, 'google');
});

test('admin + seller + customer flow with real-time stock enforcement', async () => {
  let response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'buyer@example.com', password: 'secret' }),
  });
  const user = await response.json();
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/sellers`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sellerId: 'seller_1', legalName: 'Acme Retail' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/admin/products`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      sku: 'SKU-100',
      name: 'Laptop',
      description: 'Gaming Laptop',
      category: 'electronics',
      brand: 'Acme',
      price: 50000,
      stock: 2,
      sellerId: 'seller_1',
    }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, sku: 'SKU-100', quantity: 3 }),
  });
  assert.equal(response.status, 409);

  response = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, sku: 'SKU-100', quantity: 2 }),
  });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, paymentMethod: 'UPI', idempotencyKey: 'idem-123', offerCode: 'BBD10' }),
  });
  assert.equal(response.status, 201);
  const result = await response.json();
  const orderId = result.order.orderId;

  response = await fetch(`${baseUrl}/api/admin/out-of-stock`);
  assert.equal(response.status, 200);
  const outOfStock = await response.json();
  assert.equal(outOfStock.length, 1);

  response = await fetch(`${baseUrl}/api/sellers/seller_1/dashboard`);
  assert.equal(response.status, 200);
  const dashboard = await response.json();
  assert.equal(dashboard.totalOrders, 1);
  assert.equal(dashboard.soldItems, 2);
  assert.ok(dashboard.revenue > 0);

  response = await fetch(`${baseUrl}/api/admin/overview`);
  assert.equal(response.status, 200);
  const overview = await response.json();
  assert.equal(overview.totalSellers, 1);
  assert.equal(overview.totalOrders, 1);

  response = await fetch(`${baseUrl}/api/shipments/${orderId}`);
  assert.equal(response.status, 200);
});


test('shipping quote and profile address flow work', async () => {
  let response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'shipuser@example.com', password: 'secret' }),
  });
  const user = await response.json();
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/profile/${user.id}/addresses`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      addressLine: 'MG Road', city: 'Bengaluru', state: 'KA', pincode: '560001', latitude: 12.97, longitude: 77.59,
    }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/shipping/quote`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ lat: 12.97, lng: 77.59, itemsCount: 2, subtotal: 900 }),
  });
  assert.equal(response.status, 200);
  const quote = await response.json();
  assert.ok(quote.totalShipping > 0);
  assert.ok(quote.etaMinutes >= 20);
  assert.ok(quote.distanceKm >= 0);
});

test('checkout idempotency keys are scoped per user', async () => {
  let response = await fetch(`${baseUrl}/api/sellers`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sellerId: 'seller_2', legalName: 'Scoped Seller' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/admin/products`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      sku: 'SKU-IDEMP',
      name: 'Scoped Item',
      description: 'Item for idempotency scoping checks',
      category: 'electronics',
      brand: 'Acme',
      price: 1000,
      stock: 5,
      sellerId: 'seller_2',
    }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'idem-one@example.com', password: 'secret' }),
  });
  const userOne = await response.json();
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'idem-two@example.com', password: 'secret' }),
  });
  const userTwo = await response.json();
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: userOne.id, sku: 'SKU-IDEMP', quantity: 1 }),
  });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: userTwo.id, sku: 'SKU-IDEMP', quantity: 1 }),
  });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: userOne.id, paymentMethod: 'UPI', idempotencyKey: 'shared-idem-key' }),
  });
  assert.equal(response.status, 201);
  const firstCheckout = await response.json();

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: userTwo.id, paymentMethod: 'UPI', idempotencyKey: 'shared-idem-key' }),
  });
  assert.equal(response.status, 201);
  const secondCheckout = await response.json();

  assert.notEqual(firstCheckout.order.orderId, secondCheckout.order.orderId);
  assert.equal(firstCheckout.order.userId, userOne.id);
  assert.equal(secondCheckout.order.userId, userTwo.id);
});


test('checkout idempotency returns cached result for same user and payload', async () => {
  let response = await fetch(`${baseUrl}/api/sellers`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sellerId: 'seller_3', legalName: 'Replay Seller' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/admin/products`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      sku: 'SKU-REPLAY',
      name: 'Replay Item',
      description: 'Item for idempotency replay checks',
      category: 'electronics',
      brand: 'Acme',
      price: 2000,
      stock: 3,
      sellerId: 'seller_3',
    }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'idem-replay@example.com', password: 'secret' }),
  });
  const user = await response.json();
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, sku: 'SKU-REPLAY', quantity: 1 }),
  });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, paymentMethod: 'UPI', idempotencyKey: 'user-replay-key' }),
  });
  assert.equal(response.status, 201);
  const firstCheckout = await response.json();

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, paymentMethod: 'UPI', idempotencyKey: 'user-replay-key' }),
  });
  assert.equal(response.status, 201);
  const replayCheckout = await response.json();

  assert.equal(replayCheckout.order.orderId, firstCheckout.order.orderId);
  assert.equal(replayCheckout.payment.paymentId, firstCheckout.payment.paymentId);
});

test('checkout idempotency key reuse with changed payload is rejected', async () => {
  let response = await fetch(`${baseUrl}/api/sellers`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sellerId: 'seller_4', legalName: 'Mismatch Seller' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/admin/products`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      sku: 'SKU-MISMATCH',
      name: 'Mismatch Item',
      description: 'Item for idempotency mismatch checks',
      category: 'electronics',
      brand: 'Acme',
      price: 1500,
      stock: 3,
      sellerId: 'seller_4',
    }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'idem-mismatch@example.com', password: 'secret' }),
  });
  const user = await response.json();
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, sku: 'SKU-MISMATCH', quantity: 1 }),
  });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, paymentMethod: 'UPI', idempotencyKey: 'user-mismatch-key' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, paymentMethod: 'CARD', idempotencyKey: 'user-mismatch-key' }),
  });
  assert.equal(response.status, 409);
});


test('auth supports forgot account flow with email otp', async () => {
  let response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'forgot@example.com', password: 'secret' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/auth/send-otp`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'forgot@example.com' }),
  });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'forgot@example.com', otp: '123456' }),
  });
  assert.equal(response.status, 200);
  const session = await response.json();
  assert.equal(session.loginMethod, 'otp');
  assert.equal(session.user.email, 'forgot@example.com');
});

test('order history by user and payment method validation work', async () => {
  let response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'history@example.com', password: 'secret' }),
  });
  const user = await response.json();
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/sellers`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sellerId: 'seller_hist', legalName: 'History Seller' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/admin/products`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      sku: 'SKU-HISTORY',
      name: 'History Product',
      description: 'order history checks',
      category: 'electronics',
      brand: 'Acme',
      price: 1200,
      stock: 2,
      sellerId: 'seller_hist',
      reviews: [{ user: 'alice', rating: 5, comment: 'great' }],
    }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, sku: 'SKU-HISTORY', quantity: 1 }),
  });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, paymentMethod: 'COD', idempotencyKey: 'hist-1' }),
  });
  assert.equal(response.status, 201);

  response = await fetch(`${baseUrl}/api/orders/user/${user.id}`);
  assert.equal(response.status, 200);
  const orders = await response.json();
  assert.equal(orders.length, 1);
  assert.equal(orders[0].userId, user.id);

  response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: user.id, paymentMethod: 'BANK_TRANSFER', idempotencyKey: 'hist-2' }),
  });
  assert.equal(response.status, 400);
});
