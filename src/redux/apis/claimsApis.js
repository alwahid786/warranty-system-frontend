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

    // export Claims
    exportClaims: builder.query({
      query: () => ({
        url: "/exportClaims",
        method: "GET",
        responseHandler: (res) => res.blob(),
      }),
      providesTags: ["Claims"],
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

    // Update Claims Additional Data
    updateClaimsAdditionalData: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/updateClaimAdditionalData/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Claims"],
    }),

    // Delete Claim
    deleteClaim: builder.mutation({
      query: (id) => ({
        url: `/deleteClaim/${id}`,
        method: "DELETE",
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

    // Add Archieve Claims
    addArchieveClaims: builder.mutation({
      query: (data) => ({
        url: "/createArchieveClaims",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Claims"],
    }),

    // move claims out of archieve
    removeArchieveClaims: builder.mutation({
      query: (data) => ({
        url: "/removeArchieveClaims",
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
  useLazyExportClaimsQuery,
  useUpdateClaimsMutation,
  useGetInvoicesQuery,
  useGetArchieveClaimsQuery,
  useAddArchieveClaimsMutation,
  useRemoveArchieveClaimsMutation,
  useGetInvoicesStatQuery,
  useGetClaimsStatQuery,
  useUpdateClaimsAdditionalDataMutation,
  useDeleteClaimMutation,
} = claimsApis;

export default claimsApis;
