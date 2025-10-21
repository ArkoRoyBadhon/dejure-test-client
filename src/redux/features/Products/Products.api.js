import { api } from "@/redux/api/api";

const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/products/create-product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["products"],
    }),

    getAllProducts: builder.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    getProductsByCategory: builder.query({
      query: (categoryId) => ({
        url: `/products/category-products/${categoryId}`,
        method: "GET",
      }),
      providesTags: (result, error, categoryId) => [
        "products",
        { type: "products", id: `category-${categoryId}` },
      ],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "products",
        { type: "products", id },
      ],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "products",
        { type: "products", id },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "products",
        { type: "products", id },
      ],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
