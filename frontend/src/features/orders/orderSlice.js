import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const placeOrder = createAsyncThunk('orders/place', async (payload) => {
  const { data } = await api.post('/api/checkout', payload);
  return data;
});

export const fetchHistory = createAsyncThunk('orders/fetchHistory', async (userId) => {
  const { data } = await api.get(`/api/orders/user/${userId}`);
  return data;
});

export const trackOrder = createAsyncThunk('orders/track', async (orderId) => {
  const { data } = await api.get(`/api/shipments/${orderId}`);
  return data;
});

const slice = createSlice({
  name: 'orders',
  initialState: { current: null, history: [], tracking: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.tracking = action.payload;
      });
  },
});

export default slice.reducer;
