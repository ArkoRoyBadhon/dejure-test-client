import { api } from "@/redux/api/api";

const freeResourceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFreeResource: builder.mutation({
      query: (formData) => ({
        url: "/free-resources/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["freeResources"],
    }),

    getAllFreeResources: builder.query({
      query: () => ({
        url: "/free-resources",
        method: "GET",
      }),
      providesTags: ["freeResources"],
    }),

    getFreeResourceById: builder.query({
      query: (id) => ({
        url: `/free-resources/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "freeResources",
        { type: "freeResources", id },
      ],
    }),

    updateFreeResource: builder.mutation({
      query: ({ id, data }) => ({
        url: `/free-resources/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "freeResources",
        { type: "freeResources", id },
      ],
    }),

    deleteFreeResource: builder.mutation({
      query: (id) => ({
        url: `/free-resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "freeResources",
        { type: "freeResources", id },
      ],
    }),
  }),
});

export const {
  useCreateFreeResourceMutation,
  useGetAllFreeResourcesQuery,
  useGetFreeResourceByIdQuery,
  useUpdateFreeResourceMutation,
  useDeleteFreeResourceMutation,
} = freeResourceApi;
