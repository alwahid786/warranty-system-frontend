import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { notification: null },
  reducers: {
    unReadNotifications: (state, action) => {
      state.notification = action.payload;
    },
    noUnReadNotifications: (state) => {
      state.notification = null;
    },
  },
});

export const { unReadNotifications, noUnReadNotifications } =
  notificationsSlice.actions;

export default notificationsSlice;
