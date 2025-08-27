import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const claimsApis = createApi({
  reducerPath: "claimsApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/claims`,
    credentials: "include",
  }),
  tagTypes: ["Claims"],

  endpoints: (builder) => ({
    // Get all Claims
    getClaims: builder.query({
      query: () => ({
        url: "/getClaims",
        method: "GET",
      }),
      providesTags: ["Claims"],
    }),

    // Get Invoices
    getInvoices: builder.query({
      query: () => ({
        url: "/getInvoices",
        method: "GET",
      }),
      providesTags: ["Claims"],
    }),

    // Add new Claims
    addClaims: builder.mutation({
      query: (data) => ({
        url: "/createClaims",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Claims"],
    }),

    // Update Claims
    updateClaims: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/updateClaim/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Claims"],
    }),

    // get Archieve Claims
    getArchieveClaims: builder.query({
      query: () => ({
        url: "/getArchieveClaims",
        method: "GET",
      }),
      providesTags: ["Claims"],
    }),

    // get Archieve Invoices

    getArchieveInvoices: builder.query({
      query: () => ({
        url: "/getArchieveInvoices",
        method: "GET",
      }),
      providesTags: ["Claims"],
    }),

    // Add Archieve Claims
    addArchieveClaims: builder.mutation({
      query: (data) => ({
        url: "/createArchieveClaims",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Claims"],
    }),

    // Add Archieve Invoices
    addArchieveInvoices: builder.mutation({
      query: (data) => ({
        url: "/createArchiveInvoices",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Claims"],
    }),

    // move out of archieve
    removeArchieveClaims: builder.mutation({
      query: (data) => ({
        url: "/removeArchieveClaims",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Claims"],
    }),

    // move out of invoice archieve
    removeArchieveInvoices: builder.mutation({
      query: (data) => ({
        url: "/removeArchiveInvoices",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Claims"],
    }),

    // Get Invoices Dashboard Stats
    getInvoicesStat: builder.query({
      query: () => ({
        url: "/getInvoicesStats",
        method: "GET",
      }),
      providesTags: ["Claims"],
    }),

    // Get Invoices Dashboard Stats
    getClaimsStat: builder.query({
      query: () => ({
        url: "/getClaimsStats",
        method: "GET",
      }),
      providesTags: ["Claims"],
    }),
  }),
});

export const {
  useGetClaimsQuery,
  useAddClaimsMutation,
  useUpdateClaimsMutation,
  useGetInvoicesQuery,
  useGetArchieveClaimsQuery,
  useAddArchieveClaimsMutation,
  useRemoveArchieveClaimsMutation,
  useGetArchieveInvoicesQuery,
  useAddArchieveInvoicesMutation,
  useRemoveArchieveInvoicesMutation,
  useGetInvoicesStatQuery,
  useGetClaimsStatQuery,
} = claimsApis;

export default claimsApis;
