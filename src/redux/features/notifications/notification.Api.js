import { api } from "@/redux/api/api";

const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications for current user
    getNotifications: builder.query({
      query: () => ({
        url: "/notification",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    // Get unread notification count
    getUnreadCount: builder.query({
      query: () => ({
        url: "/notification/unread-count",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    // Create a notification
    createNotification: builder.mutation({
      query: (body) => ({
        url: "/notification",
        method: "POST",
        body,
      }),
      invalidatesTags: ["notifications"],
    }),

    // Mark notification as read
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Archive notification
    archiveNotification: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}/archive`,
        method: "PUT",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Create payment due notification
    createPaymentDueNotification: builder.mutation({
      query: (enrollmentId) => ({
        url: `/notification/payment-due/${enrollmentId}`,
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Create class cancellation notification
    createClassCancellationNotification: builder.mutation({
      query: ({ classId, reason }) => ({
        url: `/notification/class-cancelled/${classId}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["notifications"],
    }),

    // Create exam result notification
    createExamResultNotification: builder.mutation({
      query: (submissionId) => ({
        url: `/notification/exam-result/${submissionId}`,
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Create admin notice
    createAdminNotice: builder.mutation({
      query: (body) => ({
        url: "/notification/admin-notice",
        method: "POST",
        body,
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useCreateNotificationMutation,
  useMarkAsReadMutation,
  useArchiveNotificationMutation,
  useCreatePaymentDueNotificationMutation,
  useCreateClassCancellationNotificationMutation,
  useCreateExamResultNotificationMutation,
  useCreateAdminNoticeMutation,
} = notificationApi;
