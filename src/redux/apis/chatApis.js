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
  }),
});

export const { useGetChatQuery, useSendMessageMutation } = chatApis;

export default chatApis;
