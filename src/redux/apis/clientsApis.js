import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const clientApis = createApi({
  reducerPath: "clientApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/clients`,
    credentials: "include",
  }),
  tagTypes: ["Clients"],

  endpoints: (builder) => ({
    // Get all clients
    getClients: builder.query({
      query: () => ({
        url: "/getClients",
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),

    // Get single Client by ID
    getClientById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Clients", id }],
    }),

    // Add new Client
    addClient: builder.mutation({
      query: (data) => ({
        url: "/createClient",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Clients"],
    }),

    // Update Client
    updateClient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/updateClient/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Clients"],
    }),

    // Delete Client
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/deleteClient/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),

    // Get Active Inactive Count
    getActiveInactiveCount: builder.query({
      query: () => ({
        url: "/getActiveInactiveCount",
        method: "GET",
      }),
    }),

    // Get Clients Stat
    getClientsStat: builder.query({
      query: () => ({
        url: "/getClientStats",
        method: "GET",
      }),
    }),

    // Get Clients Stats By Filters Today, Week, Month
    getClientsStatByFilters: builder.query({
      query: () => ({
        url: "/getClientsStatsByFilters",
        method: "GET",
      }),
    }),

    // Get Clients Activity Stats
    getClientsActivityStats: builder.query({
      query: () => ({
        url: "/getClientsActivityStats",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetActiveInactiveCountQuery,
  useGetClientsStatQuery,
  useGetClientsStatByFiltersQuery,
  useGetClientsActivityStatsQuery,
} = clientApis;

export default clientApis;
