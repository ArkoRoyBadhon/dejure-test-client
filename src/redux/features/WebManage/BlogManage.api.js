import { api } from "@/redux/api/api";

const blogManageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBlogManage: builder.mutation({
      query: (formData) => ({
        url: "/blogs-manage/create-bloghero",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["blogManage"],
    }),

    getAllBlogManages: builder.query({
      query: () => ({
        url: "/blogs-manage",
        method: "GET",
      }),
      providesTags: ["blogManage"],
    }),

    getBlogManageById: builder.query({
      query: (id) => ({
        url: `/blogs-manage/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "blogManage",
        { type: "blogManage", id },
      ],
    }),

    updateBlogManage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blogs-manage/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "blogManage",
        { type: "blogManage", id },
      ],
    }),

    deleteBlogManage: builder.mutation({
      query: (id) => ({
        url: `/blogs-manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "blogManage",
        { type: "blogManage", id },
      ],
    }),
  }),
});

export const {
  useCreateBlogManageMutation,
  useGetAllBlogManagesQuery,
  useGetBlogManageByIdQuery,
  useUpdateBlogManageMutation,
  useDeleteBlogManageMutation,
} = blogManageApi;
