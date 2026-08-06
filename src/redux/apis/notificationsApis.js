import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import getEnv from "../../configs/config.js";

const notificationsApis = createApi({
  reducerPath: "notificationsApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/notifications`,
    credentials: "include"
  }),
  tagTypes: ["notifications"],

  endpoints: (builder) => ({
    // Get Notifications
    getNotifications: builder.query({
      query: (params) => {
        let url = `/getNotifications`;

        if (params && typeof params === "object") {
          const queryParams = new URLSearchParams();

          if (params.page) queryParams.append("page", params.page);
          if (params.limit) queryParams.append("limit", params.limit);
          const queryString = queryParams.toString();

          if (queryString) url += `?${queryString}`;
        }

        return {
          url,
          method: "GET"
        };
      },
      providesTags: ["notifications"]
    }),

    // Delete Notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/deleteNotification/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["notifications"]
    }),

    // Read Notification
    readNotification: builder.mutation({
      query: (id) => ({
        url: `/readNotification/${id}`,
        method: "PUT"
      }),
      invalidatesTags: ["notifications"]
    }),

    // Read All Notifications
    readAllNotifications: builder.mutation({
      query: () => ({
        url: `/readAllNotifications`,
        method: "PUT"
      }),
      invalidatesTags: ["notifications"]
    })
  })
});

export const {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useReadNotificationMutation,
  useReadAllNotificationsMutation
} = notificationsApis;

export default notificationsApis;
