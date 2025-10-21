import { api } from "@/redux/api/api";

const questionBankTypeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuestionBankTypes: builder.query({
      query: (params = {}) => ({
        url: "/question-bank-types",
        method: "GET",
        params: {
          search: params.search,
          status: params.status,
          sort: params.sort,
        },
      }),
      providesTags: ["bank"],
    }),

    getQuestionBankTypeById: builder.query({
      query: ({ id, search, status }) => {
        return {
          url: `/question-bank-types/${id}`,
          method: "GET",
          params: {
            search,
            status,
          },
        };
      },
      providesTags: (_result, _error, arg) => [{ type: "bank", id: arg.id }],
    }),

    createQuestionBankType: builder.mutation({
      query: (data) => ({
        url: "/question-bank-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bank"],
    }),

    updateQuestionBankType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/question-bank-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["bank", "curriculum"],
    }),

    deleteQuestionBankType: builder.mutation({
      query: (id) => ({
        url: `/question-bank-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["bank", "curriculum"],
    }),
  }),
});

export const {
  useGetAllQuestionBankTypesQuery,
  useGetQuestionBankTypeByIdQuery,
  useCreateQuestionBankTypeMutation,
  useUpdateQuestionBankTypeMutation,
  useDeleteQuestionBankTypeMutation,
} = questionBankTypeApi;
