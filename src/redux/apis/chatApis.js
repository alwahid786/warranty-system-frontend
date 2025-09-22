import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const chatApis = createApi({
  reducerPath: "chatApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/chats`,
    credentials: "include",
  }),
  tagTypes: ["chat"],

  endpoints: (builder) => ({
    // Get Chat
    getChat: builder.query({
      query: (claimId) => ({
        url: `/getChat/${claimId}`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),

    // Send Message
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/sendMessage",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chat"],
    }),

    // Get Companies Avg Response Time
    getCompaniesAvgResponseTime: builder.query({
      query: () => ({
        url: "/companies/avg-response-time",
        method: "GET",
      }),
    }),

    // Get Companies Avg Response Time All
    getCompaniesAvgResponseTimeAll: builder.query({
      query: ({ page, limit }) => ({
        url: `/companies/avg-response-time/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetChatQuery,
  useSendMessageMutation,
  useGetCompaniesAvgResponseTimeQuery,
  useGetCompaniesAvgResponseTimeAllQuery,
} = chatApis;

export default chatApis;
