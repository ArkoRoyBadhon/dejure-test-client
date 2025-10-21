import { api } from "@/redux/api/api";

const learningReportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLearningReport: builder.query({
      query: ({ courseId, learnerId }) => ({
        url: `/learning-report/course/${courseId}/learner/${learnerId}`,
        method: "GET",
      }),
      providesTags: ["exams"],
    }),
  }),
});

export const { useGetLearningReportQuery } = learningReportApi;
