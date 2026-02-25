import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const getShippingQuote = createAsyncThunk('shipping/quote', async (payload) => {
  const { data } = await api.post('/api/shipping/quote', payload);
  return data;
});

const slice = createSlice({
  name: 'shipping',
  initialState: { quote: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getShippingQuote.fulfilled, (state, action) => {
      state.quote = action.payload;
    });
  },
});

export default slice.reducer;
