# Flipkart-like Backend (Node.js)

A functional backend starter with broad commerce APIs for a Flipkart-style platform.

## Platform roles (3 levels)

- **Customer**: browse, add to cart, buy products
- **Seller**: onboard, list products, track inventory/revenue via dashboard
- **Admin / Third-party operator**: manage products, inventory, out-of-stock checks, and overall platform overview

## Modules implemented

- Auth (register/login with email, phone OTP, google)
- Profile (customer profile + addresses)
- Catalog (create/list/get/update products)
- Search (keyword + price filter)
- Cart with real-time stock guard
- Wishlist
- Offers
- Loyalty / SuperCoins (balance, earn, redeem, ledger)
- Seller onboarding + dashboard (inventory left, sold items, revenue)
- Checkout orchestration (inventory, payment, order, logistics, notifications)
- Orders
- Logistics tracking
- Returns
- Notifications
- Admin panel APIs (product/inventory management, out-of-stock, platform overview)

## Maintainable module structure

- `src/core/create-context.js`: dependency wiring / service container
- `src/core/register-routes.js`: central route composition
- `src/modules/*/routes.js`: feature-wise HTTP modules (auth, catalog, checkout, fulfillment, admin, etc.)
- `src/domains/*/service.js`: business logic per bounded context
- `src/lib/router.js`: lightweight reusable route matcher with path params

## Run

```bash
npm start
```

## Tests

```bash
npm test
```

## Key endpoints

- `POST /api/auth/register`
- `POST /api/auth/login` (email/password, phone+otp, or google)
- `POST /api/auth/send-otp`
- `PUT /api/profile`
- `POST /api/cart/items`
- `POST /api/checkout`
- `GET /api/sellers/:sellerId/dashboard`

### Admin panel endpoints

- `GET /api/admin/overview`
- `GET /api/admin/out-of-stock`
- `POST /api/admin/products`
- `PUT /api/admin/products/:sku`
- `PUT /api/admin/products/:sku/stock`
