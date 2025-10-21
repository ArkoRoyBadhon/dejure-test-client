import { api } from "@/redux/api/api";

const conversationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseConversation: builder.query({
      query: ({ courseId }) => ({
        url: `/conversation/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["conversation"],
    }),
    getCourseConversationdashboard: builder.query({
      query: ({ courseId }) => ({
        url: `/conversation/course-dashboard/${courseId}`,
        method: "GET",
      }),
      providesTags: ["conversation"],
    }),

    // createStudentMessage: builder.mutation({
    //   query: ({ courseId, payload }) => ({
    //     url: `/conversation/course/${courseId}/student-message`,
    //     method: "POST",
    //     body: payload,
    //   }),
    //   invalidatesTags: ["conversation", "message"],
    // }),

    createStudentMessage: builder.mutation({
      query: ({ courseId, formData }) => ({
        url: `/conversation/course/${courseId}/student-message`,
        method: "POST",
        body: formData,
        formData: true, // ⬅️ this tells RTK to send multipart/form-data
      }),
    }),
    getMentorCourses: builder.query({
      query: () => ({
        url: `/conversation/mentor`,
        method: "GET",
      }),
      providesTags: ["conversation"],
    }),
    getMentorConversations: builder.query({
      query: ({ courseId }) => {
        return {
          url: `/conversation/mentor/${courseId}`,
          method: "GET",
        };
      },
      providesTags: ["conversation"],
    }),

    mentorReply: builder.mutation({
      query: ({ conversationId, formData }) => ({
        url: `/conversation/${conversationId}/mentor-reply`,
        method: "POST",
        body: formData,
        formData: true, // 🔥 This tells RTK Query to automatically set multipart/form-data
      }),
      invalidatesTags: ["message"],
    }),
    adminReply: builder.mutation({
      query: ({ conversationId, formData }) => ({
        url: `/conversation/${conversationId}/admin-reply`,
        method: "POST",
        body: formData,
        formData: true, // 🔥 This tells RTK Query to automatically set multipart/form-data
      }),
      invalidatesTags: ["message"],
    }),

    getConversationMessages: builder.query({
      query: ({ conversationId }) => ({
        url: `/conversation/${conversationId}/messages`,
        method: "GET",
      }),
      providesTags: ["message"],
    }),
    getConversationMessagesDashboard: builder.query({
      query: ({ conversationId }) => ({
        url: `/conversation/${conversationId}/messages-dashboard`,
        method: "GET",
      }),
      providesTags: ["message"],
    }),

    getConversationMessagesMentor: builder.query({
      query: ({ conversationId }) => ({
        url: `/conversation/${conversationId}/messages-mentor`,
        method: "GET",
      }),
      providesTags: ["message"],
    }),

    markConversationAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/conversation/${conversationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["conversation"],
    }),
    // getCoursesWithConversations
    getCoursesWithConversations: builder.query({
      query: () => ({
        url: "/conversation/course-with-conversations",
        method: "GET",
      }),
      providesTags: ["conversation"],
    }),
  }),
});

export const {
  useGetCourseConversationQuery,
  useGetCourseConversationdashboardQuery,
  useCreateStudentMessageMutation,
  useGetMentorCoursesQuery,
  useGetMentorConversationsQuery,
  useMentorReplyMutation,
  useAdminReplyMutation,
  useGetConversationMessagesQuery,
  useGetConversationMessagesDashboardQuery,
  useGetConversationMessagesMentorQuery,
  useMarkConversationAsReadMutation,
  useGetCoursesWithConversationsQuery,
} = conversationApi;
