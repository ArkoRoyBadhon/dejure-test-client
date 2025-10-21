const { api } = require("@/redux/api/api");

const jobPortalHeroApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createJobPortalHero: builder.mutation({
      query: (formData) => ({
        url: "/job-manage/create-jobportalhero",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["jobPortalHero"],
    }),

    getAllJobPortalHeros: builder.query({
      query: () => ({
        url: "/job-manage",
        method: "GET",
      }),
      providesTags: ["jobPortalHero"],
    }),

    getJobPortalHeroById: builder.query({
      query: (id) => ({
        url: `/job-manage/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        "jobPortalHero",
        { type: "jobPortalHero", id },
      ],
    }),

    updateJobPortalHero: builder.mutation({
      query: ({ id, data }) => ({
        url: `/job-manage/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "jobPortalHero",
        { type: "jobPortalHero", id },
      ],
    }),

    deleteJobPortalHero: builder.mutation({
      query: (id) => ({
        url: `/job-manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "jobPortalHero",
        { type: "jobPortalHero", id },
      ],
    }),
  }),
});

export const {
  useCreateJobPortalHeroMutation,
  useGetAllJobPortalHerosQuery,
  useGetJobPortalHeroByIdQuery,
  useUpdateJobPortalHeroMutation,
  useDeleteJobPortalHeroMutation,
} = jobPortalHeroApi;
