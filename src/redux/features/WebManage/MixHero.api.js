import { api } from "@/redux/api/api";

const mixHeroApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createMixHero: builder.mutation({
      query: (data) => ({
        url: "/mix-heroes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["mixHero"],
    }),

    getAllMixHeros: builder.query({
      query: () => ({
        url: "/mix-heroes",
        method: "GET",
      }),
      providesTags: ["mixHero"],
    }),

    getMixHeroById: builder.query({
      query: (id) => ({
        url: `/mix-heroes/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => ["mixHero", { type: "mixHero", id }],
    }),

    updateMixHero: builder.mutation({
      query: ({ id, data }) => ({
        url: `/mix-heroes/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "mixHero",
        { type: "mixHero", id },
      ],
    }),

    deleteMixHero: builder.mutation({
      query: (id) => ({
        url: `/mix-heroes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "mixHero",
        { type: "mixHero", id },
      ],
    }),
  }),
});

export const {
  useCreateMixHeroMutation,
  useGetAllMixHerosQuery,
  useGetMixHeroByIdQuery,
  useUpdateMixHeroMutation,
  useDeleteMixHeroMutation,
} = mixHeroApi;
