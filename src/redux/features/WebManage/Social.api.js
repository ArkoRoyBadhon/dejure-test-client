import { api } from "@/redux/api/api";

const socialApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSocial: builder.mutation({
      query: (formData) => ({
        url: "/socials",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["social"],
    }),

    getAllSocials: builder.query({
      query: () => ({
        url: "/socials",
        method: "GET",
      }),
      providesTags: ["social"],
    }),

    getSocialById: builder.query({
      query: (id) => ({
        url: `/socials/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => ["social", { type: "social", id }],
    }),

    updateSocial: builder.mutation({
      query: ({ id, data }) => ({
        url: `/socials/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "social",
        { type: "social", id },
      ],
    }),

    deleteSocial: builder.mutation({
      query: (id) => ({
        url: `/socials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "social",
        { type: "social", id },
      ],
    }),
  }),
});

export const {
  useCreateSocialMutation,
  useGetAllSocialsQuery,
  useGetSocialByIdQuery,
  useUpdateSocialMutation,
  useDeleteSocialMutation,
} = socialApi;
