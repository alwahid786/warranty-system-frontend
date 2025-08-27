import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const userApis = createApi({
  reducerPath: "userApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/users`,
    credentials: "include",
  }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: () => ({
        url: "/getUsers",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    // Get single user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // Add new user
    addUser: builder.mutation({
      query: (data) => ({
        url: "/createUser",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/updateUser/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/deleteUser/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // Get Active Inactive Count
    getActiveInactiveCount: builder.query({
      query: () => ({
        url: "/getActiveInactiveCount",
        method: "GET",
      }),
    }),

    // Get Users Stat
    getUsersStat: builder.query({
      query: () => ({
        url: "/getUserStats",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetActiveInactiveCountQuery,
  useGetUsersStatQuery,
} = userApis;

export default userApis;
