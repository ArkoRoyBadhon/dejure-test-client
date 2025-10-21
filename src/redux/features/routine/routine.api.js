import { api } from "@/redux/api/api";

const routineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRoutine: builder.mutation({
      query: (formData) => ({
        url: "/routine/create-routine",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["routines"],
    }),

    getAllRoutines: builder.query({
      query: () => ({
        url: "/routine",
        method: "GET",
      }),
      providesTags: ["routines"],
    }),

    getRoutinesByCourse: builder.query({
      query: (courseId) => ({
        url: `/routine/course/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        "routines",
        { type: "routines", id: `course-${courseId}` },
      ],
    }),

    getRoutineById: builder.query({
      query: (id) => ({
        url: `/routine/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "routines",
        { type: "routines", id },
      ],
    }),

    updateRoutine: builder.mutation({
      query: ({ id, data }) => ({
        url: `/routine/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "routines",
        { type: "routines", id },
      ],
    }),

    deleteRoutine: builder.mutation({
      query: (id) => ({
        url: `/routine/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "routines",
        { type: "routines", id },
      ],
    }),
  }),
});

export const {
  useCreateRoutineMutation,
  useGetAllRoutinesQuery,
  useGetRoutinesByCourseQuery,
  useGetRoutineByIdQuery,
  useUpdateRoutineMutation,
  useDeleteRoutineMutation,
} = routineApi;
