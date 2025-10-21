import { api } from "@/redux/api/api";

const lectureApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createLecture: builder.mutation({
      query: (post) => ({
        url: "/records/subjects/create",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["lectures"],
    }),

    getAllLectures: builder.query({
      query: () => ({
        url: "/records/subjects",
        method: "GET",
      }),
      providesTags: ["lectures"],
    }),

    getLectureBySubject: builder.query({
      query: (id) => ({
        url: `/records/subjects/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "lectures", id }],
    }),

    updateLecture: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/records/subjects/update/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "lectures",
        { type: "lectures", id },
      ],
    }),

    deleteLecture: builder.mutation({
      query: (id) => ({
        url: `/records/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "lectures",
        { type: "lectures", id },
      ],
    }),
  }),
});

export const {
  useCreateLectureMutation,
  useGetAllLecturesQuery,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
  useGetLectureBySubjectQuery,
} = lectureApi;
