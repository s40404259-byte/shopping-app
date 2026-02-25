import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import products from '../features/products/productSlice';
import cart from '../features/cart/cartSlice';
import profile from '../features/profile/profileSlice';
import shipping from '../features/shipping/shippingSlice';
import orders from '../features/orders/orderSlice';

export const store = configureStore({
  reducer: { auth, products, cart, profile, shipping, orders },
});
