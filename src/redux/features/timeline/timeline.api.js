import { api } from "@/redux/api/api";

const timelineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTimeline: builder.mutation({
      query: (post) => ({
        url: "/timelines/create-timeline",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["timelines"],
    }),
    getTimelines: builder.query({
      query: () => ({
        url: "/timelines",
        method: "GET",
      }),
      providesTags: ["timelines"],
    }),
    getTimelineById: builder.query({
      query: (id) => ({
        url: `/timelines/${id}`,
        method: "GET",
      }),
      providesTags: ["timelines"],
    }),
    deleteTimeline: builder.mutation({
      query: (id) => ({
        url: `/timelines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["timelines"],
    }),
    updateTimeline: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/timelines/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "timelines",
        { type: "timelines", id },
      ],
    }),
  }),
});

export const {
  useCreateTimelineMutation,
  useGetTimelinesQuery,
  useGetTimelineByIdQuery,
  useUpdateTimelineMutation,
  useDeleteTimelineMutation,
} = timelineApi;
