import { api } from "@/redux/api/api";

export const submissionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubmission: builder.mutation({
      query: (formData) => ({
        url: "/submissions/create-submission",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["submissions", "liveExams"],
    }),

    getSubmissions: builder.query({
      query: () => "/submissions",
      providesTags: ["submissions"],
    }),

    getSubmissionById: builder.query({
      query: (id) => `/submissions/${id}`,
      providesTags: ["submissions"],
    }),

    updateSubmission: builder.mutation({
      query: ({ id, data }) => ({
        url: `/submissions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["submissions"],
    }),

    deleteSubmission: builder.mutation({
      query: (id) => ({
        url: `/submissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["submissions"],
    }),

    getSubmissionsByExam: builder.query({
      query: (examId) => `/submissions/exam/${examId}`,
      providesTags: ["submissions"],
    }),

    getSubmissionsByStudent: builder.query({
      query: (studentId) => `/submissions/student/${studentId}`,
      providesTags: ["submissions"],
    }),

    getSubmissionsByExamAndStudent: builder.query({
      query: ({ examId, studentId }) =>
        `/submissions/exam/${examId}/student/${studentId}`,
      providesTags: ["submissions"],
    }),

    getSubmissionsByExamAndStatus: builder.query({
      query: ({ examId, status }) =>
        `/submissions/exam/${examId}/status/${status}`,
      providesTags: ["submissions"],
    }),

    getSubmissionsByStudentAndStatus: builder.query({
      query: ({ studentId, status }) =>
        `/submissions/student/${studentId}/status/${status}`,
      providesTags: ["submissions"],
    }),

    getSubmissionsByExamAndDateRange: builder.query({
      query: ({ examId, startDate, endDate }) =>
        `/submissions/exam/${examId}/date-range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["submissions"],
    }),

    getSubmissionsByStudentAndDateRange: builder.query({
      query: ({ studentId, startDate, endDate }) =>
        `/submissions/student/${studentId}/date-range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["submissions"],
    }),
    getEnhancedExamLeaderboard: builder.query({
      query: (examId) => `/submissions/exams/${examId}/leaderboard/enhanced`,
      providesTags: ["submissions"],
    }),
  }),
});

export const {
  useCreateSubmissionMutation,
  useGetSubmissionsQuery,
  useGetSubmissionByIdQuery,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
  useGetSubmissionsByExamQuery,
  useGetSubmissionsByStudentQuery,
  useGetSubmissionsByExamAndStudentQuery,
  useGetSubmissionsByExamAndStatusQuery,
  useGetSubmissionsByStudentAndStatusQuery,
  useGetSubmissionsByExamAndDateRangeQuery,
  useGetSubmissionsByStudentAndDateRangeQuery,
  useGetEnhancedExamLeaderboardQuery,
} = submissionApi;
