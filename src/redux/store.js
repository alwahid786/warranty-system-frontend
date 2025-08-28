import { configureStore } from "@reduxjs/toolkit";
import authApis from "./apis/authApis";
import userApis from "./apis/userApis";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import claimsApis from "./apis/claimsApis";
import chatApis from "./apis/chatApis";
import notificationsApis from "./apis/notificationsApis";
import notificationsSlice from "./slices/notificationsSlice";

const store = configureStore({
  reducer: {
    // apis
    [authApis.reducerPath]: authApis.reducer,
    [userApis.reducerPath]: userApis.reducer,
    [claimsApis.reducerPath]: claimsApis.reducer,
    [chatApis.reducerPath]: chatApis.reducer,
    [notificationsApis.reducerPath]: notificationsApis.reducer,

    // slices
    [authSlice.name]: authSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [notificationsSlice.name]: notificationsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false })
      .concat(authApis.middleware)
      .concat(userApis.middleware)
      .concat(claimsApis.middleware)
      .concat(chatApis.middleware)
      .concat(notificationsApis.middleware);
  },
});

export default store;
