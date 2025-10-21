import { api } from "@/redux/api/api";

const homeFeatureApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createHomeFeature: builder.mutation({
      query: (formData) => ({
        url: "/feature-manage/create-feature",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["homeFeature"],
    }),

    getAllHomeFeatures: builder.query({
      query: () => ({
        url: "/feature-manage",
        method: "GET",
      }),
      providesTags: ["homeFeature"],
    }),

    getHomeFeatureById: builder.query({
      query: (id) => ({
        url: `/feature-manage/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "homeFeature",
        { type: "homeFeature", id },
      ],
    }),

    updateHomeFeature: builder.mutation({
      query: ({ id, data }) => ({
        url: `/feature-manage/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "homeFeature",
        { type: "homeFeature", id },
      ],
    }),

    deleteHomeFeature: builder.mutation({
      query: (id) => ({
        url: `/feature-manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "homeFeature",
        { type: "homeFeature", id },
      ],
    }),
  }),
});

export const {
  useCreateHomeFeatureMutation,
  useGetAllHomeFeaturesQuery,
  useGetHomeFeatureByIdQuery,
  useUpdateHomeFeatureMutation,
  useDeleteHomeFeatureMutation,
} = homeFeatureApi;
