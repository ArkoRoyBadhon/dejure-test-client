import { api } from "@/redux/api/api";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate payment
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: "/payment/initiate",
        method: "POST",
        body: data,
      }),
    }),

    // Check payment status
    checkPaymentStatus: builder.query({
      query: (transactionId) => `/payment/status/${transactionId}`,
    }),

    // Payment success (optional if you want to call manually)
    paymentSuccess: builder.mutation({
      query: (data) => ({
        url: "/payment/success",
        method: "POST",
        body: data,
      }),
    }),

    // Payment fail (optional)
    paymentFail: builder.mutation({
      query: (data) => ({
        url: "/payment/fail",
        method: "POST",
        body: data,
      }),
    }),

    // Payment cancel (optional)
    paymentCancel: builder.mutation({
      query: (data) => ({
        url: "/payment/cancel",
        method: "POST",
        body: data,
      }),
    }),

    // Order Payment
    initiateOrderPayment: builder.mutation({
      query: (data) => ({
        url: "/payment/order/initiate",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useInitiatePaymentMutation,
  useCheckPaymentStatusQuery,
  usePaymentSuccessMutation,
  usePaymentFailMutation,
  usePaymentCancelMutation,
  useInitiateOrderPaymentMutation,
} = paymentApi;
