import { api } from "@/redux/api/api";

const liveExamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLiveExams: builder.query({
      query: () => ({
        url: "/live-exams",
        method: "GET",
      }),
      providesTags: ["liveExams"],
    }),

    getAllLiveExamsByCourse: builder.query({
      query: (courseId) => {
        const params = courseId ? `?courseId=${courseId}` : "";
        return {
          url: `/live-exams/all-by-course${params}`,
          method: "GET",
        };
      },
      providesTags: ["liveExams"],
    }),

    getAllLiveExamsByLearner: builder.query({
      query: () => {
        return {
          url: `/live-exams/all-by-learner`,
          method: "GET",
        };
      },
      providesTags: ["liveExams"],
    }),

    getLiveExamById: builder.query({
      query: (id) => ({
        url: `/live-exams/${id}`,
        method: "GET",
      }),
      providesTags: ["liveExams"],
    }),

    createLiveExam: builder.mutation({
      query: (data) => ({
        url: "/live-exams",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["liveExams"],
    }),
    startAnytimeExam: builder.mutation({
      query: (examId) => ({
        url: `/live-exams/${examId}/start`,
        method: "POST",
      }),
      invalidatesTags: ["liveExams"],
    }),

    publishLiveExam: builder.mutation({
      query: ({ id, data }) => ({
        url: `/live-exams/publish/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["liveExams", "submissions"],
    }),

    updateLiveExam: builder.mutation({
      query: ({ id, data }) => ({
        url: `/live-exams/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["liveExams"],
    }),

    deleteLiveExam: builder.mutation({
      query: (id) => ({
        url: `/live-exams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["liveExams"],
    }),

    getUpcomingLiveExams: builder.query({
      query: (courseId) => {
        const params = courseId ? `?courseId=${courseId}` : "";
        return {
          url: `/live-exams/upcoming${params}`,
          method: "GET",
        };
      },
      providesTags: ["liveExams"],
    }),

    getPreviousLiveExams: builder.query({
      query: (courseId) => {
        const params = courseId ? `?courseId=${courseId}` : "";
        return {
          url: `/live-exams/previous${params}`,
          method: "GET",
        };
      },
      providesTags: ["liveExams"],
    }),

    checkExamForStudent: builder.query({
      query: (examId) => ({
        url: `/live-exams/check/${examId}`,
        method: "GET",
      }),
      providesTags: ["liveExams", "submissions"],
    }),
    getExamResultsForStudent: builder.query({
      query: ({ examId }) => ({
        url: `/live-exams/result/${examId}`,
        method: "GET",
      }),
      providesTags: (result, error, { examId, studentId }) => [
        { type: "ExamResults", id: `${examId}-${studentId}` },
        "liveExams",
        "submissions",
      ],
    }),
    getResultsForStudentByExamByMentor: builder.query({
      query: ({ examId, studentId }) => ({
        url: `/live-exams/resultbymentor/${examId}?studentId=${studentId}`,
        method: "GET",
      }),
      providesTags: (result, error, { examId, studentId }) => [
        { type: "ExamResults", id: `${examId}-${studentId}` },
        "liveExams",
        "submissions",
      ],
    }),
    getLiveExamsByEvaluator: builder.query({
      query: () => ({
        url: `/live-exams/mentor-exams`,
        method: "GET",
      }),
      providesTags: ["liveExams", "submissions"],
    }),
    getLiveExamsByEvaluatorPrev: builder.query({
      query: () => ({
        url: `/live-exams/mentor-exams-prev`,
        method: "GET",
      }),
      providesTags: ["liveExams", "submissions"],
    }),
    getHighlightedExamsAndClasses: builder.query({
      query: () => ({
        url: `/live-exams/mentor-highlight`,
        method: "GET",
      }),
      providesTags: ["liveExams", "submissions"],
    }),
  }),
});

export const {
  useGetLiveExamsQuery,
  useGetAllLiveExamsByCourseQuery,
  useGetAllLiveExamsByLearnerQuery,
  useGetLiveExamByIdQuery,
  useCreateLiveExamMutation,
  useStartAnytimeExamMutation,
  usePublishLiveExamMutation,
  useUpdateLiveExamMutation,
  useDeleteLiveExamMutation,
  useGetUpcomingLiveExamsQuery,
  useGetPreviousLiveExamsQuery,
  useCheckExamForStudentQuery,
  useGetExamResultsForStudentQuery,
  useGetLiveExamsByEvaluatorQuery,
  useGetLiveExamsByEvaluatorPrevQuery,
  useGetResultsForStudentByExamByMentorQuery,
  useGetHighlightedExamsAndClassesQuery,
} = liveExamApi;
