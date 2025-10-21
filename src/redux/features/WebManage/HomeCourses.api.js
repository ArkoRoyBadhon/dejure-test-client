import { api } from "@/redux/api/api";

const homeCourseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createHomeCourse: builder.mutation({
      query: (data) => ({
        url: "/home-courses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["homeCourse"],
    }),

    getAllHomeCourses: builder.query({
      query: () => ({
        url: "/home-courses",
        method: "GET",
      }),
      providesTags: ["homeCourse"],
    }),

    getHomeCourseById: builder.query({
      query: (id) => ({
        url: `/home-courses/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "homeCourse",
        { type: "homeCourse", id },
      ],
    }),

    updateHomeCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/home-courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "homeCourse",
        { type: "homeCourse", id },
      ],
    }),

    deleteHomeCourse: builder.mutation({
      query: (id) => ({
        url: `/home-courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "homeCourse",
        { type: "homeCourse", id },
      ],
    }),
  }),
});

export const {
  useCreateHomeCourseMutation,
  useGetAllHomeCoursesQuery,
  useGetHomeCourseByIdQuery,
  useUpdateHomeCourseMutation,
  useDeleteHomeCourseMutation,
} = homeCourseApi;
