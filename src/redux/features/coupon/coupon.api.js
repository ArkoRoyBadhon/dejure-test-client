import { api } from "@/redux/api/api";

const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ----- CRUD -----
    createCoupon: builder.mutation({
      query: (body) => ({
        url: "/coupon/create-coupon",
        method: "POST",
        body,
      }),
      invalidatesTags: ["coupons"],
    }),
    getCoupons: builder.query({
      query: () => ({
        url: "/coupon",
        method: "GET",
      }),
      providesTags: ["coupons"],
    }),
    getCouponById: builder.query({
      query: (id) => ({
        url: `/coupon/${id}`,
        method: "GET",
      }),
      providesTags: ["coupons"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, body }) => ({
        url: `/coupon/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["coupons"],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupons"],
    }),

    // ----- Flow: validate + redeem -----
    validateCoupon: builder.mutation({
      // expects: { code, learnerId, productId?, courseId?, orderTotal? }
      query: (body) => ({
        url: "/coupon/validate",
        method: "POST",
        body,
      }),
    }),
    redeemCoupon: builder.mutation({
      // expects: { code, learnerId, orderId?, enrollmentId?, productId?, courseId?, discountedAmount? }
      query: (body) => ({
        url: "/coupon/redeem",
        method: "POST",
        body,
      }),
      invalidatesTags: ["coupons"],
    }),

    // ----- Analytics -----
    getCouponAnalytics: builder.query({
      query: (couponId) => ({
        url: `/coupon/analytics/${couponId}`,
        method: "GET",
      }),
      providesTags: ["coupons"],
    }),
    getAllCouponRedemptions: builder.query({
      query: ({ page = 1, limit = 20, couponId, learnerId } = {}) => ({
        url: `/coupon/redemptions?page=${page}&limit=${limit}${
          couponId ? `&couponId=${couponId}` : ""
        }${learnerId ? `&learnerId=${learnerId}` : ""}`,
        method: "GET",
      }),
      providesTags: ["coupons"],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
  useRedeemCouponMutation,
  useGetCouponAnalyticsQuery,
  useGetAllCouponRedemptionsQuery,
} = couponApi;
