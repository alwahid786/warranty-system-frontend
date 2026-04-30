import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import getEnv from "../../configs/config.js";

const userApis = createApi({
  reducerPath: "userApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/users`,
    credentials: "include"
  }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: (params) => ({
        url: "/getUsers",
        method: "GET",
        params
      }),
      providesTags: ["Users"]
    }),

    // Get single user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET"
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }]
    }),

    // Add new user
    addUser: builder.mutation({
      query: (data) => ({
        url: "/createUser",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Users"]
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/updateUser/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Users"]
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/deleteUser/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Users"]
    }),

    // Get Active Inactive Count
    getActiveInactiveCount: builder.query({
      query: () => ({
        url: "/getActiveInactiveCount",
        method: "GET"
      })
    }),

    // Get Users Stat
    getUsersStat: builder.query({
      query: (params) => ({
        url: "/getUserStats",
        method: "GET",
        params
      })
    }),

    // Get Total Users Count Today, This week and this month
    getTotalUsersCount: builder.query({
      query: (params) => ({
        url: "/getUserStatsByFilters",
        method: "GET",
        params
      })
    }),

    // Get Attendance Chart Data
    getAttendanceChartData: builder.query({
      query: (params) => ({
        url: "/getUserActivityStats",
        method: "GET",
        params
      })
    })
  })
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetActiveInactiveCountQuery,
  useGetUsersStatQuery,
  useGetTotalUsersCountQuery,
  useGetAttendanceChartDataQuery
} = userApis;

export default userApis;
