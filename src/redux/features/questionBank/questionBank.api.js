import { api } from "@/redux/api/api";

const questionBankApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCurriculumTypes: builder.query({
      query: (params = {}) => ({
        url: "/question-bank",
        method: "GET",
        params: {
          search: params.search,
          status: params.status,
          sort: params.sort,
        },
      }),
      providesTags: ["curriculums", "bank"],
    }),

    getSubjectsByCurriculum: builder.query({
      query: ({ curriculumId, search, status }) => {
        const id =
          typeof curriculumId === "object" ? curriculumId.id : curriculumId;
        return {
          url: `/question-bank/curriculum/${id}/subjects`,
          method: "GET",
          params: {
            search,
            status: status === "all" ? undefined : status,
          },
        };
      },
      providesTags: ["curriculums", "bank"],
    }),

    getModulesBySubject: builder.query({
      query: (subjectId) => ({
        url: `/question-bank/subject/${subjectId}/modules`,
        method: "GET",
      }),
      providesTags: ["curriculums", "bank"],
    }),
    getQuestionsByModule: builder.query({
      query: ({ moduleId, search, status, type }) => ({
        url: `/question-bank/module/${moduleId}/questions`,
        method: "GET",
        params: {
          search,
          status,
          type,
        },
      }),
      providesTags: (result, error, arg) => [
        { type: "bank", id: arg.moduleId },
      ],
    }),
    getQuestionBySubject: builder.query({
      query: ({ subjectId, search, status, type }) => ({
        url: `/questions/subject/${subjectId}`,
        method: "GET",
        params: {
          search,
          status,
          type,
        },
      }),
      providesTags: (result, error, arg) => [
        { type: "bank", id: arg.moduleId },
      ],
    }),
    getQuestionsByMultipleSubjects: builder.query({
      query: ({ subjectIds, search, status, type, hasSubQuestions }) => ({
        url: "/questions/subject-multi",
        params: {
          subjectIds: Array.isArray(subjectIds)
            ? subjectIds.join(",")
            : subjectIds,
          search,
          status,
          type,
          hasSubQuestions,
        },
      }),
      providesTags: ["curriculums", "bank"],
    }),
    createQuestion: builder.mutation({
      query: (post) => ({
        url: "/questions",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["curriculums", "bank"],
    }),
    getFullQuestionBankHierarchy: builder.query({
      query: () => ({
        url: "/question-bank/hierarchy",
        method: "GET",
      }),
      providesTags: ["curriculums", "bank"],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...patchData }) => ({
        url: `/questions/${id}`,
        method: "PATCH", // Using PATCH method for partial updates
        body: patchData,
      }),
      invalidatesTags: ["curriculums", "bank"], // Same tags as delete for cache invalidation
    }),
    deleteQuestionById: builder.mutation({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["curriculums", "bank"],
    }),
  }),
});

export const {
  useGetAllCurriculumTypesQuery,
  useGetSubjectsByCurriculumQuery,
  useGetModulesBySubjectQuery,
  useGetQuestionBySubjectQuery,
  useGetQuestionsByMultipleSubjectsQuery,
  useGetQuestionsByModuleQuery,
  useCreateQuestionMutation,
  useGetFullQuestionBankHierarchyQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionByIdMutation,
} = questionBankApi;
