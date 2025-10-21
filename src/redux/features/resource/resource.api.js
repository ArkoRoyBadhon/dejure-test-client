import { api } from "@/redux/api/api";

const resourceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createResource: builder.mutation({
      query: (formData) => ({
        url: "/resource/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["resources"],
    }),

    getAllResources: builder.query({
      query: () => ({
        url: "/resource",
        method: "GET",
      }),
      providesTags: ["resources"],
    }),

    getResourcesByCourse: builder.query({
      query: (courseId) => ({
        url: `/resource/course/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        "resources",
        { type: "resources", id: `course-${courseId}` },
      ],
    }),

    getResourcesByClass: builder.query({
      query: (classId) => ({
        url: `/resource/class/${classId}`,
        method: "GET",
      }),
      providesTags: (result, error, classId) => [
        "resources",
        { type: "resources", id: `class-${classId}` },
      ],
    }),

    updateResource: builder.mutation({
      query: ({ id, data }) => ({
        url: `/resource/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "resources",
        { type: "resources", id },
      ],
    }),

    deleteResource: builder.mutation({
      query: (id) => ({
        url: `/resource/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "resources",
        { type: "resources", id },
      ],
    }),
  }),
});

export const {
  useCreateResourceMutation,
  useGetAllResourcesQuery,
  useGetResourcesByCourseQuery,
  useGetResourcesByClassQuery,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourceApi;
