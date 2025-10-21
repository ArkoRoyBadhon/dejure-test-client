import { api } from "@/redux/api/api";

const subjectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubject: builder.mutation({
      query: (data) => ({
        url: "/subject/create-subject",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subjects", "curriculums"],
    }),

    getSubjects: builder.query({
      query: () => ({
        url: "/subject",
        method: "GET",
      }),
      providesTags: ["subjects"],
    }),
    getSubjectsBySubjectTypeId: builder.query({
      query: (subjectTypeId) => ({
        url: `/subject/by-subject-type/${subjectTypeId}`,
        method: "GET",
      }),
      providesTags: ["subjects"],
    }),

    getSubjectById: builder.query({
      query: (id) => ({
        url: `/subject/${id}`,
        method: "GET",
      }),
      providesTags: ["subjects"],
    }),

    updateSubject: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/subject/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["subjects", "curriculums"],
    }),

    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subjects", "curriculums"],
    }),
  }),
});

export const {
  useCreateSubjectMutation,
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetSubjectsBySubjectTypeIdQuery,
} = subjectApi;
