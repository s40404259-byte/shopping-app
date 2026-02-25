import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const { data } = await api.get('/api/catalog/products');
  return data;
});

export const createProductAdmin = createAsyncThunk('products/createAdmin', async (payload) => {
  const { data } = await api.post('/api/admin/products', payload);
  return data;
});

const slice = createSlice({
  name: 'products',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createProductAdmin.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default slice.reducer;
