import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload;
    },
    clear(state, action) {
      return null;
    },
  },
});

export const setNotification = (content, type, seconds) => {
  return async (dispatch) => {
    dispatch(
      set({
        message: content,
        type,
      })
    );
    setTimeout(() => {
      dispatch(clear());
    }, seconds * 1000);
  };
};

export const { set, clear } = notificationSlice.actions;
export default notificationSlice.reducer;
