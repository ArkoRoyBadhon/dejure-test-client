import { api } from "@/redux/api/api";

const reviewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (formData) => ({
        url: "/reviews/create-review",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["review"],
    }),

    getAllReviews: builder.query({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
      providesTags: ["review"],
    }),

    getReviewById: builder.query({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => ["review", { type: "review", id }],
    }),

    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "review",
        { type: "review", id },
      ],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "review",
        { type: "review", id },
      ],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
