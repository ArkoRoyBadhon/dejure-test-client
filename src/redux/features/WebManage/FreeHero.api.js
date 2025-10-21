import { api } from "@/redux/api/api";

const freeResourceHeroApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFreeResourceHero: builder.mutation({
      query: (formData) => ({
        url: "/free-manage/create-freeresourcehero",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["freeResourceHero"],
    }),

    getAllFreeResourceHeros: builder.query({
      query: () => ({
        url: "/free-manage",
        method: "GET",
      }),
      providesTags: ["freeResourceHero"],
    }),

    getFreeResourceHeroById: builder.query({
      query: (id) => ({
        url: `/free-manage/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "freeResourceHero",
        { type: "freeResourceHero", id },
      ],
    }),

    updateFreeResourceHero: builder.mutation({
      query: ({ id, data }) => ({
        url: `/free-manage/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "freeResourceHero",
        { type: "freeResourceHero", id },
      ],
    }),

    deleteFreeResourceHero: builder.mutation({
      query: (id) => ({
        url: `/free-manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "freeResourceHero",
        { type: "freeResourceHero", id },
      ],
    }),
  }),
});

export const {
  useCreateFreeResourceHeroMutation,
  useGetAllFreeResourceHerosQuery,
  useGetFreeResourceHeroByIdQuery,
  useUpdateFreeResourceHeroMutation,
  useDeleteFreeResourceHeroMutation,
} = freeResourceHeroApi;
