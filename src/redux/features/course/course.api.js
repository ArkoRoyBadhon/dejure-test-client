import { api } from "@/redux/api/api";

const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (post) => ({
        url: "/courses/create-course",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["courses"],
    }),
    getCourses: builder.query({
      query: () => ({
        url: "/courses",
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    getCoursesByMentor: builder.query({
      query: () => ({
        url: "/courses/all-by-mentor",
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    getCoursesByLearner: builder.query({
      query: () => ({
        url: "/courses/all-by-learner",
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    getCourseStats: builder.query({
      query: () => ({
        url: "/courses/stats",
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    getCourseById: builder.query({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    getCourseBySlug: builder.query({
      query: (slug) => ({
        url: `/courses/${slug}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    getCourseByIdOrSlug: builder.query({
      query: (identifier) => ({
        url: `/courses/${identifier}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),

    getCategoryWiseCourse: builder.query({
      query: (id) => ({
        url: `/courses/category/${id}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    getSubCategoryWiseCourse: builder.query({
      query: (id) => ({
        url: `/courses/subcategory/${id}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courses"],
    }),
    updateCourse: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: patch,
      }),

      invalidatesTags: (result, error, { id }) => [
        "courses",
        { type: "courses", id },
      ],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetCoursesQuery,
  useGetCoursesByMentorQuery,
  useGetCoursesByLearnerQuery,
  useGetCourseByIdQuery,
  useGetCourseBySlugQuery,
  useGetCourseByIdOrSlugQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseStatsQuery,
  useGetCategoryWiseCourseQuery,
  useGetSubCategoryWiseCourseQuery,
} = courseApi;
