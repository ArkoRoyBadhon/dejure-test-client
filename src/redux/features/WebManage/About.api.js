import { api } from "@/redux/api/api";

const aboutApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAbout: builder.mutation({
      query: (formData) => ({
        url: "/about/create-about",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["about"],
    }),

    getAllAbout: builder.query({
      query: () => ({
        url: "/about",
        method: "GET",
      }),
      providesTags: ["about"],
    }),

    getAboutById: builder.query({
      query: (id) => ({
        url: `/about/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => ["about", { type: "about", id }],
    }),

    updateAbout: builder.mutation({
      query: ({ id, data }) => ({
        url: `/about/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "about",
        { type: "about", id },
      ],
    }),

    updateAboutImages: builder.mutation({
      query: ({ id, data }) => ({
        url: `/about/images/${id}`,
        method: "PATCH",
        body: data,
        formData: true, // This tells RTK Query to handle FormData properly
      }),
      invalidatesTags: (result, error, { id }) => [
        "about",
        { type: "about", id },
      ],
    }),

    deleteAbout: builder.mutation({
      query: (id) => ({
        url: `/about/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "about",
        { type: "about", id },
      ],
    }),
  }),
});

export const {
  useCreateAboutMutation,
  useGetAllAboutQuery,
  useGetAboutByIdQuery,
  useUpdateAboutMutation,
  useUpdateAboutImagesMutation,
  useDeleteAboutMutation,
} = aboutApi;