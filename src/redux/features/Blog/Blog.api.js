import { api } from "@/redux/api/api";

const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "/blogs/create-blog",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["blogs"],
    }),

    getAllBlogs: builder.query({
      query: () => ({
        url: "/blogs",
        method: "GET",
      }),
      providesTags: ["blogs"],
    }),

    getMyBlogs: builder.query({
      query: () => ({
        url: "/blogs/my-blogs",
        method: "GET",
      }),
      providesTags: ["blogs"],
    }),

    getSingleBlog: builder.query({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "blogs", id }],
    }),

    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/blogs/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "blogs",
        { type: "blogs", id },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogs"],
    }),

    // Get pending blogs (unapproved blogs)
    getPendingBlogs: builder.query({
      query: () => ({
        url: "/blogs/pending",
        method: "GET",
      }),
      providesTags: ["blogs"],
    }),

    // Approve blog
    approveBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetMyBlogsQuery,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetPendingBlogsQuery,
  useApproveBlogMutation,
} = blogApi;
