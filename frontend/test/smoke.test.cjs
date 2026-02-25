const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('frontend route pages and core integrations exist', () => {
  const app = read('src/app/App.jsx');
  for (const route of ['/login', '/products', '/cart', '/profile', '/shipping', '/payment', '/orders', '/seller', '/admin']) {
    assert.match(app, new RegExp(route.replace('/', '\\/')));
  }

  const cloudinary = read('src/components/CloudinaryUpload.jsx');
  assert.match(cloudinary, /VITE_CLOUDINARY_CLOUD_NAME/);
  assert.match(cloudinary, /api\.cloudinary\.com/);

  const shipping = read('src/pages/ShippingPage.jsx');
  assert.match(shipping, /navigator\.geolocation/);
  assert.match(shipping, /getShippingQuote/);

  const payment = read('src/pages/PaymentPage.jsx');
  assert.match(payment, /placeOrder/);

  const orders = read('src/pages/OrdersPage.jsx');
  assert.match(orders, /trackOrder/);
});
