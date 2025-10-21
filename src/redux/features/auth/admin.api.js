import { api } from "@/redux/api/api";

const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // LearnerRegister: builder.mutation({
    //   query: (post) => ({
    //     url: "/learners/register",
    //     method: "POST",
    //     body: post,
    //   }),
    //   invalidatesTags: ["learners"],
    // }),
    adminLogin: builder.mutation({
      query: (post) => ({
        url: "/admins/login",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["admin"],
    }),
    getAdmin: builder.query({
      query: () => ({
        url: "/admins/profile",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    dashboardStats: builder.query({
      query: () => ({
        url: "/admins/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    createRepresentative: builder.mutation({
      query: (post) => ({
        url: "/admins/create-representative",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Representative"],
    }),
    updateAdminProfile: builder.mutation({
      query: (post) => ({
        url: "/admins/update-profile",
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["admin"],
    }),

    changeAdminPassword: builder.mutation({
      query: (post) => ({
        url: "/admins/update-profile-password",
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  //   useLearnerRegisterMutation,
  useAdminLoginMutation,
  useGetAdminQuery,
  useDashboardStatsQuery,
  useCreateRepresentativeMutation,
  useUpdateAdminProfileMutation,
  useChangeAdminPasswordMutation,
} = adminApi;
