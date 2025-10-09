import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const paymentApis = createApi({
  reducerPath: "paymentApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/payments`,
    credentials: "include",
  }),
  tagTypes: ["payments"],

  endpoints: (builder) => ({
    // create payment intent
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: "/create-payment-intent",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation, useCheckMembershipMutation } =
  paymentApis;

export default paymentApis;
