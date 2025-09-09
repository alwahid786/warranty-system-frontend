// notificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unReadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
    },
    unReadNotifications: (state, action) => {
      state.unReadCount = action.payload;
    },
    noUnReadNotifications: (state) => {
      state.unReadCount = 0;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unReadCount += 1;
    },
    resetNotifications: (state) => {
      state.items = [];
      state.unReadCount = 0;
    },
  },
});

export const {
  setNotifications,
  unReadNotifications,
  noUnReadNotifications,
  addNotification,
  resetNotifications,
} = notificationsSlice.actions;

export default notificationsSlice;
