import { api } from "@/redux/api/api";

const photoGalleryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new PhotoGallery record
    createPhotoGallery: builder.mutation({
      query: (formData) => ({
        url: "/gallery-manage/create-gallery",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["photoGallery"],
    }),

    // Get all PhotoGallery records
    getAllPhotoGalleries: builder.query({
      query: () => ({
        url: "/gallery-manage",
        method: "GET",
      }),
      providesTags: ["photoGallery"],
    }),

    // Get a single PhotoGallery record by ID
    getPhotoGalleryById: builder.query({
      query: (id) => ({
        url: `/gallery-manage/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "photoGallery",
        { type: "photoGallery", id },
      ],
    }),

    // Update a PhotoGallery record
    updatePhotoGallery: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gallery-manage/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "photoGallery",
        { type: "photoGallery", id },
      ],
    }),

    // Delete a PhotoGallery record
    deletePhotoGallery: builder.mutation({
      query: (id) => ({
        url: `/gallery-manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "photoGallery",
        { type: "photoGallery", id },
      ],
    }),
  }),
});

export const {
  useCreatePhotoGalleryMutation,
  useGetAllPhotoGalleriesQuery,
  useGetPhotoGalleryByIdQuery,
  useUpdatePhotoGalleryMutation,
  useDeletePhotoGalleryMutation,
} = photoGalleryApi;
