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
      const incoming = action.payload;
      if (!incoming?._id) return;
      const exists = state.items.some((n) => n?._id === incoming._id);
      if (exists) return;
      state.items.unshift(incoming);
      if (!incoming?.isRead) state.unReadCount += 1;
    },
    markNotificationRead: (state, action) => {
      const notificationId = action.payload;
      state.items = state.items.map((item) =>
        item?._id === notificationId ? { ...item, isRead: true } : item
      );
      state.unReadCount = state.items.filter((item) => !item?.isRead).length;
    },
    markAllNotificationsRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, isRead: true }));
      state.unReadCount = 0;
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
  markNotificationRead,
  markAllNotificationsRead,
  resetNotifications,
} = notificationsSlice.actions;

export default notificationsSlice;
