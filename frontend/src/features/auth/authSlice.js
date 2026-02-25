import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const signup = createAsyncThunk('auth/signup', async (payload) => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
});

export const login = createAsyncThunk('auth/login', async (payload) => {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
});

const slice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export default slice.reducer;
