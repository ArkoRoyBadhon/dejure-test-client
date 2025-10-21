import { api } from "@/redux/api/api";

const curriculumApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCurriculum: builder.mutation({
      query: (data) => ({
        url: "/curriculum/create-curriculum",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["curriculums"],
    }),

    getCurriculums: builder.query({
      query: () => ({
        url: "/curriculum",
        method: "GET",
      }),
      providesTags: ["curriculums", "subjects"],
    }),

    getCurriculumById: builder.query({
      query: (id) => ({
        url: `/curriculum/${id}`,
        method: "GET",
      }),
      providesTags: ["curriculums", "subjects"],
    }),

    updateCurriculum: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/curriculum/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "curriculums",
        { type: "curriculums", id },
      ],
    }),

    deleteCurriculum: builder.mutation({
      query: (id) => ({
        url: `/curriculum/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["curriculums"],
    }),
    getAllCurriculumTypes: builder.query({
      query: () => ({
        url: "/curriculum/question-bank",
        method: "GET",
      }),
      providesTags: ["curriculums"],
    }),
  }),
});

export const {
  useCreateCurriculumMutation,
  useGetCurriculumsQuery,
  useGetCurriculumByIdQuery,
  useUpdateCurriculumMutation,
  useDeleteCurriculumMutation,
  useGetAllCurriculumTypesQuery,
} = curriculumApi;
