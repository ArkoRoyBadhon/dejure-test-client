import { api } from "@/redux/api/api";

const representativeApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getAllRepresentatives: builder.query({
      query: () => ({
        url: "/representatives",
        method: "GET",
      }),
      providesTags: ["Representative"],
    }),
    getRepresentativeById: builder.query({
      query: (id) => ({
        url: `/representatives/${id}`,
        method: "GET",
      }),
      providesTags: ["Representative"],
    }),
    updateRepresentative: builder.mutation({
      query: ({ id, ...post }) => ({
        url: `/representatives/${id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Representative"],
    }),
    deleteRepresentative: builder.mutation({
      query: (id) => ({
        url: `/representatives/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Representative"],
    }),
  }),
});

export const {
  useGetAllRepresentativesQuery,
  useGetRepresentativeByIdQuery,
  useUpdateRepresentativeMutation,
  useDeleteRepresentativeMutation,
} = representativeApi;