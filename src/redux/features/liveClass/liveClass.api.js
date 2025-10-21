import { api } from "@/redux/api/api";

const liveClassApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createLiveClass: builder.mutation({
      query: (post) => ({
        url: "/live-classes/create-live-classes",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["liveClasses"],
    }),

    getLiveClasses: builder.query({
      query: () => ({
        url: "/live-classes",
        method: "GET",
      }),
      providesTags: ["liveClasses"],
    }),
    getLiveClassesByLearner: builder.query({
      query: () => ({
        url: "/live-classes/all-by-learner",
        method: "GET",
      }),
      providesTags: ["liveClasses"],
    }),
    getAllLiveClassesByMentor: builder.query({
      query: () => ({
        url: "/live-classes/all-by-mentor",
        method: "GET",
      }),
      providesTags: ["liveClasses"],
    }),

    getLiveClassById: builder.query({
      query: (id) => ({
        url: `/live-classes/${id}`,
        method: "GET",
      }),
      providesTags: ["liveClasses"],
    }),
    getClassByCourseId: builder.query({
      query: (id) => ({
        url: `/live-classes/class/${id}`,
        method: "GET",
      }),
      providesTags: ["liveClasses"],
    }),

    deleteLiveClass: builder.mutation({
      query: (id) => ({
        url: `/live-classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["liveClasses"],
    }),

    updateLiveClass: builder.mutation({
      query: ({ id, body }) => ({
        url: `/live-classes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["liveClasses"],
    }),
    getUpcomingLiveClassesByMentor: builder.query({
      query: (mentorId) => ({
        url: `/live-classes/upcoming-by-mentor`,
        method: "GET",
      }),
      providesTags: ["liveClasses"],
    }),

    getPreviousLiveClassesByMentor: builder.query({
      query: (mentorId) => ({
        url: `/live-classes/previous-by-mentor`,
        method: "GET",
      }),
      providesTags: ["liveClasses"],
    }),
  }),
});

export const {
  useCreateLiveClassMutation,
  useGetLiveClassesQuery,
  useGetLiveClassByIdQuery,
  useDeleteLiveClassMutation,
  useUpdateLiveClassMutation,
  useGetClassByCourseIdQuery,
  useGetUpcomingLiveClassesByMentorQuery,
  useGetPreviousLiveClassesByMentorQuery,
  useGetLiveClassesByLearnerQuery,
  useGetAllLiveClassesByMentorQuery,
} = liveClassApi;
