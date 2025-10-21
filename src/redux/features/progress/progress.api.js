import { api } from "@/redux/api/api";

const studentProgressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create Student Progress
    createStudentProgress: builder.mutation({
      query: (body) => ({
        url: "/progress",
        method: "POST",
        body,
      }),
      invalidatesTags: ["progress"],
    }),

    // Get All Student Progress
    getAllStudentProgress: builder.query({
      query: () => ({
        url: "/progress",
        method: "GET",
      }),
      providesTags: ["progress"],
    }),

    // Get Student Progress by Student ID (course & class ID in body)
    getStudentProgressByStudentId: builder.mutation({
      query: ({ studentId, body }) => ({
        url: `/progress/check/${studentId}`,
        method: "POST",
        body,
      }),
      providesTags: (result, error, { studentId }) => [
        "progress",
        { type: "progress", id: studentId },
      ],
    }),
  }),
});

export const {
  useCreateStudentProgressMutation,
  useGetAllStudentProgressQuery,
  useGetStudentProgressByStudentIdMutation,
} = studentProgressApi;
