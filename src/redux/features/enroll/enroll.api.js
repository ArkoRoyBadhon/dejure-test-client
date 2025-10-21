import { api } from "@/redux/api/api";

const enrollmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create new enrollment (learner access)
    createEnrollment: builder.mutation({
      query: (data) => ({
        url: "/enrollments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["enrollments"],
    }),

    makeDuePayment: builder.mutation({
      query: ({ id, ...paymentData }) => ({
        url: `/enrollments/make-due-payment/${id}`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["enrollments", "transaction"],
    }),

    // Get all enrollments (admin access)
    getAllEnrollments: builder.query({
      query: () => ({
        url: "/enrollments",
        method: "GET",
      }),
      providesTags: ["enrollments"],
    }),

    // Get enrollments by user ID (learner access)
    getEnrollmentsByUser: builder.query({
      query: (learnerId) => ({
        url: `/enrollments/user/${learnerId}`,
        method: "GET",
      }),
      providesTags: ["enrollments"],
    }),

    // Get single enrollment by ID
    getEnrollmentById: builder.query({
      query: (id) => ({
        url: `/enrollments/${id}`,
        method: "GET",
      }),
      providesTags: ["enrollments"],
    }),

    // Enrollment Id Wise TRansactions
    getTransactionByEnrollId: builder.query({
      query: (id) => ({
        url: `/transaction/enrollment/${id}`,
        method: "GET",
      }),
      providesTags: ["transaction"],
    }),
    // Enrollment Id Wise TRansactions
    getDueEnrollmentBylearner: builder.query({
      query: (id) => ({
        url: `/enrollments/due/${id}`,
        method: "GET",
      }),
      providesTags: ["enrollments"],
    }),

    // Update enrollment (admin access)
    updateEnrollment: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/enrollments/${id}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["enrollments"],
    }),

    // Update suspend status (admin access)
    updateSuspendStatus: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/enrollments/${id}/suspend`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["enrollments"],
    }),

    // Update enrollment status (admin access)
    updateEnrollmentStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/enrollments/${id}/status`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: ["enrollments"],
    }),

    // Delete enrollment (admin access)
    deleteEnrollment: builder.mutation({
      query: (id) => ({
        url: `/enrollments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["enrollments"],
    }),
  }),
});

export const {
  useCreateEnrollmentMutation,
  useGetAllEnrollmentsQuery,
  useGetEnrollmentsByUserQuery,
  useGetEnrollmentByIdQuery,
  useUpdateEnrollmentMutation,
  useUpdateSuspendStatusMutation,
  useUpdateEnrollmentStatusMutation,
  useDeleteEnrollmentMutation,
  useGetTransactionByEnrollIdQuery,
  useGetDueEnrollmentBylearnerQuery,
  useMakeDuePaymentMutation,
} = enrollmentApi;
