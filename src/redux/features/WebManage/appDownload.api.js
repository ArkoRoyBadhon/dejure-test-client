import { api } from "@/redux/api/api";

const appDownloadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAppDownload: builder.mutation({
      query: (formData) => ({
        url: "/app-downloads",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["appDownload"],
    }),

    getAllAppDownloads: builder.query({
      query: () => ({
        url: "/app-downloads",
        method: "GET",
      }),
      providesTags: ["appDownload"],
    }),

    // Add a public version that doesn't require authentication
    getAllAppDownloadsPublic: builder.query({
      query: () => ({
        url: "/app-downloads",
        method: "GET",
      }),
      providesTags: ["appDownload"],
      meta: {
        skipToken: true,
      },
    }),

    getAppDownloadById: builder.query({
      query: (id) => ({
        url: `/app-downloads/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "appDownload",
        { type: "appDownload", id },
      ],
    }),

    updateAppDownload: builder.mutation({
      query: ({ id, data }) => ({
        url: `/app-downloads/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "appDownload",
        { type: "appDownload", id },
      ],
    }),

    deleteAppDownload: builder.mutation({
      query: (id) => ({
        url: `/app-downloads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "appDownload",
        { type: "appDownload", id },
      ],
    }),
  }),
});

export const {
  useCreateAppDownloadMutation,
  useGetAllAppDownloadsQuery,
  useGetAllAppDownloadsPublicQuery,
  useGetAppDownloadByIdQuery,
  useUpdateAppDownloadMutation,
  useDeleteAppDownloadMutation,
} = appDownloadApi;
