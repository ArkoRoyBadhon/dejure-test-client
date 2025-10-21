import { api } from "@/redux/api/api";

const homeManageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createHomeManage: builder.mutation({
      query: (formData) => ({
        url: "/home-manage/create-home",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["homeManage"],
    }),

    getAllHomeManages: builder.query({
      query: () => ({
        url: "/home-manage",
        method: "GET",
      }),
      providesTags: ["homeManage"],
      // Add retry logic for token expiration
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // If token expired, try again without token
          if (error.error?.status === 401) {
            console.log(
              "Token expired, retrying without token for public access"
            );
            // This will be handled by the baseQueryWithReauth
          }
        }
      },
    }),

    // Add a public version that doesn't require authentication
    getAllHomeManagesPublic: builder.query({
      query: () => ({
        url: "/home-manage",
        method: "GET",
      }),
      providesTags: ["homeManage"],
      meta: {
        skipToken: true,
      },
    }),

    getHomeManageById: builder.query({
      query: (id) => ({
        url: `/home-manage/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "homeManage",
        { type: "homeManage", id },
      ],
    }),

    updateHomeManage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/home-manage/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "homeManage",
        { type: "homeManage", id },
      ],
    }),

    deleteHomeManage: builder.mutation({
      query: (id) => ({
        url: `/home-manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "homeManage",
        { type: "homeManage", id },
      ],
    }),
  }),
});

export const {
  useCreateHomeManageMutation,
  useGetAllHomeManagesQuery,
  useGetAllHomeManagesPublicQuery,
  useGetHomeManageByIdQuery,
  useUpdateHomeManageMutation,
  useDeleteHomeManageMutation,
} = homeManageApi;
