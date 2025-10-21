const { api } = require("@/redux/api/api");

const footerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFooter: builder.mutation({
      query: (formData) => ({
        url: "/footers",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["footer"],
    }),

    getAllFooters: builder.query({
      query: () => ({
        url: "/footers",
        method: "GET",
      }),
      providesTags: ["footer"],
    }),

    getFooterById: builder.query({
      query: (id) => ({
        url: `/footers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => ["footer", { type: "footer", id }],
    }),

    updateFooter: builder.mutation({
      query: ({ id, data }) => ({
        url: `/footers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "footer",
        { type: "footer", id },
      ],
    }),

    deleteFooter: builder.mutation({
      query: (id) => ({
        url: `/footers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "footer",
        { type: "footer", id },
      ],
    }),
  }),
});

export const {
  useCreateFooterMutation,
  useGetAllFootersQuery,
  useGetFooterByIdQuery,
  useUpdateFooterMutation,
  useDeleteFooterMutation,
} = footerApi;
