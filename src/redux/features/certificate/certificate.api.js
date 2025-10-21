import { api } from "../../api/api.js";

export const certificateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Generate certificate PDF and download
    generateCertificate: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/generate",
        method: "POST",
        body: certificateData,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error("Failed to generate certificate");
          }
          return response.blob();
        },
      }),
      invalidatesTags: ["certificates"],
    }),

    // Generate certificate and return as base64
    generateCertificateBase64: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/generate-base64",
        method: "POST",
        body: certificateData,
      }),
      invalidatesTags: ["certificates"],
    }),

    // Preview certificate HTML
    previewCertificate: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/preview",
        method: "POST",
        body: certificateData,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error("Failed to preview certificate");
          }
          return response.text();
        },
      }),
    }),

    // Admin routes for generating certificates for any student
    generateCertificateAdmin: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/admin/generate",
        method: "POST",
        body: certificateData,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error("Failed to generate certificate");
          }
          return response.blob();
        },
      }),
      invalidatesTags: ["certificates"],
    }),

    generateCertificateBase64Admin: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/admin/generate-base64",
        method: "POST",
        body: certificateData,
      }),
      invalidatesTags: ["certificates"],
    }),

    previewCertificateAdmin: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/admin/preview",
        method: "POST",
        body: certificateData,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error("Failed to preview certificate");
          }
          return response.text();
        },
      }),
    }),

    // Check if certificate exists
    checkCertificateExists: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/check-exists",
        method: "POST",
        body: certificateData,
      }),
    }),

    // Download certificate file directly
    downloadCertificateFile: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/download-file",
        method: "POST",
        body: certificateData,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error("Failed to download certificate");
          }
          return response.blob();
        },
      }),
    }),

    // Generate and save certificate (for course completion)
    generateAndSaveCertificate: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/generate-and-save",
        method: "POST",
        body: certificateData,
      }),
      invalidatesTags: ["certificates"],
    }),

    // Admin routes for new endpoints
    checkCertificateExistsAdmin: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/admin/check-exists",
        method: "POST",
        body: certificateData,
      }),
    }),

    downloadCertificateFileAdmin: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/admin/download-file",
        method: "POST",
        body: certificateData,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error("Failed to download certificate");
          }
          return response.blob();
        },
      }),
    }),

    generateAndSaveCertificateAdmin: builder.mutation({
      query: (certificateData) => ({
        url: "/certificates/admin/generate-and-save",
        method: "POST",
        body: certificateData,
      }),
      invalidatesTags: ["certificates"],
    }),
  }),
});

export const {
  useGenerateCertificateMutation,
  useGenerateCertificateBase64Mutation,
  usePreviewCertificateMutation,
  useGenerateCertificateAdminMutation,
  useGenerateCertificateBase64AdminMutation,
  usePreviewCertificateAdminMutation,
  useCheckCertificateExistsMutation,
  useDownloadCertificateFileMutation,
  useGenerateAndSaveCertificateMutation,
  useCheckCertificateExistsAdminMutation,
  useDownloadCertificateFileAdminMutation,
  useGenerateAndSaveCertificateAdminMutation,
} = certificateApi;
