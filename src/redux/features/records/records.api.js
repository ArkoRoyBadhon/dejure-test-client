import { api } from "@/redux/api/api";

const recordApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRecord: builder.mutation({
      query: (data) => ({
        url: "/records/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["records"],
    }),

    getRecords: builder.query({
      query: () => ({
        url: "/records",
        method: "GET",
      }),
      providesTags: ["records"],
    }),

    getRecordById: builder.query({
      query: (id) => ({
        url: `/records/${id}`,
        method: "GET",
      }),
      providesTags: ["records"],
    }),
    getRecordByCourseId: builder.query({
      query: (id) => ({
        url: `/records/course/${id}`,
        method: "GET",
      }),
      providesTags: ["records"],
    }),

    updateRecord: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/records/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["records"],
    }),

    deleteRecord: builder.mutation({
      query: (id) => ({
        url: `/records/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["records"],
    }),
  }),
});

export const {
  useCreateRecordMutation,
  useGetRecordsQuery,
  useGetRecordByIdQuery,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
  useGetRecordByCourseIdQuery
} = recordApi;
