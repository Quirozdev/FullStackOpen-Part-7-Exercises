import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import login from '../services/login';

export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (userCredentials, { rejectWithValue }) => {
    try {
      const userInfo = await login(userCredentials);
      localStorage.setItem('loggedUser', JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const userInfo = localStorage.getItem('loggedUser')
  ? JSON.parse(localStorage.getItem('loggedUser'))
  : null;

export const userSlice = createSlice({
  name: 'user',
  initialState: userInfo,
  reducers: {
    logOut(state, action) {
      localStorage.removeItem('loggedUser');
      return null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { logOut } = userSlice.actions;

export default userSlice.reducer;
