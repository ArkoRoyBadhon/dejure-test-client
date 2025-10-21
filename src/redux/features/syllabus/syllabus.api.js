import { api } from "@/redux/api/api";

const syllabusApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSyllabus: builder.mutation({
      query: (post) => ({
        url: "/syllabus",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["syllabus"], 
    }),

    getAllSyllabus: builder.query({
      query: () => ({
        url: "/syllabus", 
        method: "GET",
      }),
      providesTags: ["syllabus"], 
    }),

    getSyllabusById: builder.query({
      query: (id) => ({
        url: `/syllabus/${id}`, 
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "syllabus", id }],
    }),

     getSyllabusByCourseId: builder.query({
      query: (id) => ({
        url: `/syllabus/course/${id}`, 
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "syllabus", id }],
    }),

    updateSyllabus: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/syllabus/${id}`, 
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => ["syllabus", { type: "syllabus", id }],
    }),

    deleteSyllabus: builder.mutation({
      query: (id) => ({
        url: `/syllabus/${id}`, 
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["syllabus", { type: "syllabus", id }],
    }),
  }),
});

export const {
  useCreateSyllabusMutation,
  useGetAllSyllabusQuery,
  useDeleteSyllabusMutation,
  useUpdateSyllabusMutation,
  useGetSyllabusByIdQuery,
  useGetSyllabusByCourseIdQuery
} = syllabusApi;
