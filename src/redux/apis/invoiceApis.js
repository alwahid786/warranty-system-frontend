import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const invoiceApis = createApi({
  reducerPath: "invoiceApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/invoices`,
    credentials: "include",
  }),
  tagTypes: ["Invoices"],

  endpoints: (builder) => ({
    // Get all clients
    getClients: builder.query({
      query: () => ({
        url: "/getClients",
        method: "GET",
      }),
      providesTags: ["Invoices"],
    }),
    // Get all Invoices
    getInvoices: builder.query({
      query: () => ({
        url: "/getInvoices",
        method: "GET",
      }),
      providesTags: ["Invoices"],
    }),
    // Get single invoice by ID
    getInvoiceById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Invoices", id }],
    }),

    // Add new Invoice
    addInvoice: builder.mutation({
      query: (data) => ({
        url: "/createInvoice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invoices"],
    }),

    // Update Invoice
    updateInvoice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/editInvoice/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Invoices"],
    }),

    // Change Invoice Status
    changeInvoiceStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/changeInvoiceStatus/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Invoices"],
    }),

    // Delete Invoice
    deleteInvoice: builder.mutation({
      query: ({ id }) => ({
        url: `/deleteInvoice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoices"],
    }),

    // Send Invoice
    sendInvoice: builder.mutation({
      query: ({ id }) => ({
        url: `/sendInvoice/${id}`,
        method: "POST",
        responseHandler: (res) => res.blob(),
      }),
      invalidatesTags: ["Invoices"],
    }),

    // Get Active Inactive Count
    getActiveInactiveCount: builder.query({
      query: () => ({
        url: "/getActiveInactiveCount",
        method: "GET",
      }),
    }),

    // Get Invoices Stat
    getInvoicesStat: builder.query({
      query: () => ({
        url: "/getInvoiceStats",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetInvoiceByIdQuery,
  useAddInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetActiveInactiveCountQuery,
  useGetInvoicesStatQuery,
  useGetInvoicesQuery,
  useChangeInvoiceStatusMutation,
  useSendInvoiceMutation,
} = invoiceApis;

export default invoiceApis;
