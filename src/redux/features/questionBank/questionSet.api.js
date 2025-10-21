import { api } from "@/redux/api/api";

const questionSetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new question set
    createQuestionSet: builder.mutation({
      query: (questionSetData) => ({
        url: "/question-sets",
        method: "POST",
        body: questionSetData,
      }),
      invalidatesTags: ["questionSet"],
    }),

    getAllQuestionSets: builder.query({
      query: (params = {}) => ({
        url: "/question-sets",
        method: "GET",
        params: {
          status: params.status,
          subject: params.subject,
          createdBy: params.createdBy,
          search: params.search,
          sort: params.sort,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "questionSet", id: _id })),
              { type: "questionSet", id: "LIST" },
            ]
          : [{ type: "questionSet", id: "LIST" }],
    }),

    // Get a single question set by ID
    getQuestionSetById: builder.query({
      query: (id) => ({
        url: `/question-sets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "questionSet", id }],
    }),

    // Update a question set
    updateQuestionSet: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/question-sets/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "questionSet", id },
        "questionSet",
      ],
    }),

    // Delete a question set
    deleteQuestionSet: builder.mutation({
      query: (id) => {
        return {
          url: `/question-sets/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["questionSet"],
    }),

    // Add questions to a category in a question set
    addQuestionsToCategory: builder.mutation({
      query: ({ questionSetId, categoryId, questions }) => ({
        url: `/question-sets/${questionSetId}/categories/${categoryId}/questions`,
        method: "POST",
        body: { questions },
      }),
      invalidatesTags: (result, error, { questionSetId }) => [
        { type: "questionSet", id: questionSetId },
      ],
    }),

    // Remove questions from a category
    removeQuestionsFromCategory: builder.mutation({
      query: ({ questionSetId, categoryId, questionIds }) => ({
        url: `/question-sets/${questionSetId}/categories/${categoryId}/questions`,
        method: "DELETE",
        body: { questionIds },
      }),
      invalidatesTags: (result, error, { questionSetId }) => [
        { type: "questionSet", id: questionSetId },
      ],
    }),

    // Add a new category to a question set
    addCategoryToSet: builder.mutation({
      query: ({ questionSetId, ...categoryData }) => ({
        url: `/question-sets/${questionSetId}/categories`,
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: (result, error, { questionSetId }) => [
        { type: "questionSet", id: questionSetId },
      ],
    }),

    // Remove a category from a question set
    removeCategoryFromSet: builder.mutation({
      query: ({ questionSetId, categoryId }) => ({
        url: `/question-sets/${questionSetId}/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { questionSetId }) => [
        { type: "questionSet", id: questionSetId },
      ],
    }),

    // Update question set status
    changeQuestionSetStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/question-sets/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "questionSet", id },
        "questionSet",
      ],
    }),

    getQuestionSetsBySubQuestionSubject: builder.query({
      query: (subjectId) =>
        `/question-sets/by-subquestion-subject/${subjectId}`,
      providesTags: ["QuestionSet"],
    }),
  }),
});

export const {
  useCreateQuestionSetMutation,
  useGetAllQuestionSetsQuery,
  useGetQuestionSetByIdQuery,
  useUpdateQuestionSetMutation,
  useDeleteQuestionSetMutation,
  useAddQuestionsToCategoryMutation,
  useRemoveQuestionsFromCategoryMutation,
  useAddCategoryToSetMutation,
  useRemoveCategoryFromSetMutation,
  useChangeQuestionSetStatusMutation,
  useGetQuestionSetsBySubQuestionSubjectQuery,
} = questionSetApi;
