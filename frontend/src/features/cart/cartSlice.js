import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const addToCart = createAsyncThunk('cart/add', async (payload) => {
  const { data } = await api.post('/api/cart/items', payload);
  return data;
});

export const fetchCart = createAsyncThunk('cart/fetch', async (userId) => {
  const { data } = await api.get(`/api/cart/${userId}`);
  return data;
});

const slice = createSlice({
  name: 'cart',
  initialState: { cart: { items: [], totalAmount: 0 }, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export default slice.reducer;
