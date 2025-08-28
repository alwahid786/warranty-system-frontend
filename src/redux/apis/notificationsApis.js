import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const notificationsApis = createApi({
  reducerPath: "notificationsApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/notifications`,
    credentials: "include",
  }),
  tagTypes: ["notifications"],

  endpoints: (builder) => ({
    // Get Notifications
    getNotifications: builder.query({
      query: () => ({
        url: `/getNotifications`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    // Delete Notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/deleteNotification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Read Notification
    readNotification: builder.mutation({
      query: (id) => ({
        url: `/readNotification/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useReadNotificationMutation,
} = notificationsApis;

export default notificationsApis;
