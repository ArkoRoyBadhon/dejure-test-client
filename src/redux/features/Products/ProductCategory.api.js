import { api } from "@/redux/api/api";

const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProductCategory: builder.mutation({
      query: (formData) => ({
        url: "/product-category/create-category",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["productCategories"],
    }),

    getAllproductCategories: builder.query({
      query: () => ({
        url: "/product-category",
        method: "GET",
      }),
      providesTags: ["productCategories"],
    }),

    getProductCategoryById: builder.query({
      query: (id) => ({
        url: `/product-category/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "productCategories",
        { type: "productCategories", id },
      ],
    }),

    updateProductCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "productCategories",
        { type: "productCategories", id },
      ],
    }),

    deleteProductCategory: builder.mutation({
      query: (id) => ({
        url: `/product-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "productCategories",
        { type: "productCategories", id },
      ],
    }),
  }),
});

export const {
  useCreateProductCategoryMutation,
  useGetAllproductCategoriesQuery,
  useGetProductCategoryByIdQuery,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = categoryApi;
