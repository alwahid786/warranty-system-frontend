import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: undefined },
  reducers: {
    userExist: (state, action) => {
      state.user = action.payload;
    },
    userNotExist: (state) => {
      state.user = undefined;
    },
  },
});

export const { userExist, userNotExist } = authSlice.actions;
export default authSlice;
