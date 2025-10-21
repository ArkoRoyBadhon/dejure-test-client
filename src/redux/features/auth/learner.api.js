import { api } from "@/redux/api/api";

const learnerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    LearnerRegister: builder.mutation({
      query: (post) => ({
        url: "/learners/register",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    LearnerSimpleRegister: builder.mutation({
      query: (post) => ({
        url: "/learners/register-simple",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    verifyOtp: builder.mutation({
      query: (post) => ({
        url: "/learners/verify-otp",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    resendOTP: builder.mutation({
      query: (post) => ({
        url: "/learners/resend-otp",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    bulkRegisterLearners: builder.mutation({
      query: (post) => ({
        url: "/learners/bulk",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    learnerChecker: builder.mutation({
      query: (post) => ({
        url: "/learners/check-user",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    learnerLogin: builder.mutation({
      query: (post) => ({
        url: "/learners/login",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),

    // NEW: IP/Session Management Endpoints
    learnerLogout: builder.mutation({
      query: (token) => ({
        url: "/learners/logout",
        method: "POST",
        body: { token },
      }),
      invalidatesTags: ["learners", "session"],
    }),
    forceLogoutOtherSession: builder.mutation({
      query: (post) => ({
        url: "/learners/logout-all",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners", "session"],
    }),
    getSessionInfo: builder.query({
      query: () => ({
        url: "/learners/session-info",
        method: "GET",
      }),
      providesTags: ["session"],
    }),
    revokeDevice: builder.mutation({
      query: (post) => ({
        url: "/learners/revoke-device",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["session"],
    }),

    setupPassword: builder.mutation({
      query: (post) => ({
        url: "/learners/setup-password",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    getLearners: builder.query({
      query: () => ({
        url: "/learners/learner-profile",
        method: "GET",
      }),
      providesTags: ["learners"],
    }),
    getAllLearners: builder.query({
      query: () => ({
        url: "/learners/get-all",
        method: "GET",
      }),
      providesTags: ["learners"],
    }),
    changePassword: builder.mutation({
      query: (post) => ({
        url: "/learners/change-password",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    updateProfile: builder.mutation({
      query: (post) => ({
        url: "/learners/update-profile",
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    updateLearnerByAdmin: builder.mutation({
      query: (post) => ({
        url: "/learners/update-learner-admin",
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["learners"],
    }),
    updateStatusByAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/learners/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["learners"],
    }),
    deleteLearner: builder.mutation({
      query: (id) => ({
        url: `/learners/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["learners"],
    }),
    forgotPassword: builder.mutation({
      query: (post) => ({
        url: "/learners/forgot-request",
        method: "POST",
        body: post,
      }),
    }),
    resetPassword: builder.mutation({
      query: (post) => ({
        url: "/learners/reset-password",
        method: "POST",
        body: post,
      }),
    }),
    verifyResetOtp: builder.mutation({
      query: (post) => ({
        url: "/learners/verify-reset-otp",
        method: "POST",
        body: post,
      }),
    }),
  }),
});

export const {
  useLearnerRegisterMutation,
  useLearnerSimpleRegisterMutation,
  useVerifyOtpMutation,
  useResendOTPMutation,
  useBulkRegisterLearnersMutation,
  useLearnerCheckerMutation,
  useLearnerLoginMutation,

  // NEW: IP/Session Management Hooks
  useLearnerLogoutMutation,
  useForceLogoutOtherSessionMutation,

  useSetupPasswordMutation,
  useGetLearnersQuery,
  useGetAllLearnersQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUpdateStatusByAdminMutation,
  useDeleteLearnerMutation,
  useUpdateLearnerByAdminMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetOtpMutation,
} = learnerApi;
