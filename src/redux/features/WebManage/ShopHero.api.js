import { api } from "@/redux/api/api";

const shopHeroApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createShopHero: builder.mutation({
      query: (formData) => ({
        url: "/shop-manage/create-shophero",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["shopHero"],
    }),

    getAllShopHeros: builder.query({
      query: () => ({
        url: "/shop-manage",
        method: "GET",
      }),
      providesTags: ["shopHero"],
    }),

    getShopHeroById: builder.query({
      query: (id) => ({
        url: `/shop-manage/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "shopHero",
        { type: "shopHero", id },
      ],
    }),

    updateShopHero: builder.mutation({
      query: ({ id, data }) => ({
        url: `/shop-manage/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "shopHero",
        { type: "shopHero", id },
      ],
    }),

    deleteShopHero: builder.mutation({
      query: (id) => ({
        url: `/shop-manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "shopHero",
        { type: "shopHero", id },
      ],
    }),
  }),
});

export const {
  useCreateShopHeroMutation,
  useGetAllShopHerosQuery,
  useGetShopHeroByIdQuery,
  useUpdateShopHeroMutation,
  useDeleteShopHeroMutation,
} = shopHeroApi;
