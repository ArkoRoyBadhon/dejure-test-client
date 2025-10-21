import { api } from "@/redux/api/api";

const noticeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createNotice: builder.mutation({
      query: (formData) => ({
        url: "/notice",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["notice"],
    }),
    getAllNotices: builder.query({
      query: () => ({
        url: "/notice",
        method: "GET",
      }),
      providesTags: ["notice"],
    }),
    getNoticeById: builder.query({
      query: (id) => ({
        url: `/notice/${id}`,
        method: "GET",
      }),
      providesTags: ["notice"],
    }),
  }),
});

export const {
  useCreateNoticeMutation,
  useGetAllNoticesQuery,
  useGetNoticeByIdQuery,
} = noticeApi;
