# Flipkart-like Full Stack App

This repo now contains both:
- **Backend** (Node.js modular APIs)
- **Frontend** (React + Axios + Redux Toolkit)

## Features covered
- Login/signup with **email/password**, **phone OTP**, and **Google-style** login
- Product listing, cart, checkout, order history, shipment tracking
- Profile + shipping address creation with geolocation
- Shipping charge calculation (`/api/shipping/quote`)
- Seller dashboard + product creation
- Admin product and inventory management
- Cloudinary upload integration for product images

## Run backend
```bash
npm start
```

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment for frontend
Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

## Tests and checks
- Backend tests:
```bash
npm run test:backend
```
- Frontend checks (file-level smoke tests):
```bash
npm run test:frontend
```
- Combined checks:
```bash
npm run check
```
