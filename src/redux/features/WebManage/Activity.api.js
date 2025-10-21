import { api } from "@/redux/api/api"; // Assuming the base API setup is imported here

const activityGalleryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new ActivityGallery record
    createActivityGallery: builder.mutation({
      query: (formData) => ({
        url: "/activity-manage/create-gallery",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["activityGallery"],
    }),

    // Get all ActivityGallery records
    getAllActivityGalleries: builder.query({
      query: () => ({
        url: "/activity-manage",
        method: "GET",
      }),
      providesTags: ["activityGallery"],
    }),

    // Get a single ActivityGallery record by ID
    getActivityGalleryById: builder.query({
      query: (id) => ({
        url: `/activity-manage/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "activityGallery",
        { type: "activityGallery", id },
      ],
    }),

    // Update an ActivityGallery record
    updateActivityGallery: builder.mutation({
      query: ({ id, data }) => ({
        url: `/activity-manage/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "activityGallery",
        { type: "activityGallery", id },
      ],
    }),

    // Delete an ActivityGallery record
    deleteActivityGallery: builder.mutation({
      query: (id) => ({
        url: `/activity-manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "activityGallery",
        { type: "activityGallery", id },
      ],
    }),
  }),
});

export const {
  useCreateActivityGalleryMutation,
  useGetAllActivityGalleriesQuery,
  useGetActivityGalleryByIdQuery,
  useUpdateActivityGalleryMutation,
  useDeleteActivityGalleryMutation,
} = activityGalleryApi;
