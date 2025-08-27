import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,
  userCount: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUserCount: (state, action) => {
      state.userCount = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser, setUserCount } =
  userSlice.actions;
export default userSlice;
