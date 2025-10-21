import { api } from "@/redux/api/api";

const subCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubCategory: builder.mutation({
      query: (post) => ({
        url: "/subcategory/create-subcategory",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["subcategories"],
    }),
    getSubCategories: builder.query({
      query: () => ({
        url: "/subcategory",
        method: "GET",
      }),
      providesTags: ["subcategories"],
    }),
    getSubCategoryById: builder.query({
      query: (id) => ({
        url: `/subcategory/${id}`,
        method: "GET",
      }),
      providesTags: ["subcategories"],
    }),
    subCategoryByCategoryId: builder.query({
      query: (categoryId) => ({
        url: `/subcategory/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["subcategories"],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/subcategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subcategories"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subcategory/${id}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["subcategories"],
    }),
  }),
});

export const {
  useCreateSubCategoryMutation,
  useGetSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useSubCategoryByCategoryIdQuery,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation,
} = subCategoryApi;
