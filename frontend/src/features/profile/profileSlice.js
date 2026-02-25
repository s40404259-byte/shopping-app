import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const addAddress = createAsyncThunk('profile/addAddress', async ({ userId, payload }) => {
  const { data } = await api.post(`/api/profile/${userId}/addresses`, payload);
  return data;
});

export const fetchAddresses = createAsyncThunk('profile/fetchAddresses', async (userId) => {
  const { data } = await api.get(`/api/profile/${userId}/addresses`);
  return data;
});

const slice = createSlice({
  name: 'profile',
  initialState: { addresses: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      });
  },
});

export default slice.reducer;
