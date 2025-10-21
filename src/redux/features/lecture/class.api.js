import { api } from "@/redux/api/api";

const classApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createClass: builder.mutation({
      query: (body) => ({
        url: "/records/class/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["classes"],
    }),

    getAllClasses: builder.query({
      query: () => ({
        url: "/records/class",
        method: "GET",
      }),
      providesTags: ["classes"],
    }),

    getClassByLectureId: builder.query({
      query: (lectureId) => ({
        url: `/records/class/${lectureId}`,
        method: "GET",
      }),
      providesTags: (result, error, lectureId) => [
        "classes",
        { type: "classes", id: lectureId },
      ],
    }),

    getClasssLengthByCourse: builder.query({
      query: (id) => ({
        url: `/records/classln/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, lectureId) => [
        "classes",
        { type: "classes", id: lectureId },
      ],
    }),

    updateClass: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/records/class/update/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "classes",
        { type: "classes", id },
      ],
    }),

    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/records/class/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "classes",
        { type: "classes", id },
      ],
    }),
  }),
});

export const {
  useCreateClassMutation,
  useGetAllClassesQuery,
  useGetClassByLectureIdQuery,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useGetClasssLengthByCourseQuery,
} = classApi;
