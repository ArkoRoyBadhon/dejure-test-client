import { api } from "@/redux/api/api";

const subjectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubjects: builder.mutation({
      query: (post) => ({
        url: "/question-bank/",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["bank"],
    }),
    getAllQuestionbank: builder.query({
      query: () => ({
        url: "/question-bank",
        method: "GET",
      }),
      providesTags: ["bank"],
    }),
  }),
});

export const { useGetAllSubjectsMutation, useGetAllQuestionbankQuery } =
  subjectApi;
