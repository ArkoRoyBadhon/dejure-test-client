import { api } from "@/redux/api/api";

const leaderboardApi = api.injectEndpoints({
  tagTypes: ["Leaderboard"],
  endpoints: (builder) => ({
    // Get leaderboard data
    getLeaderboard: builder.query({
      query: (params) => ({
        url: "/leaderboard",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Leaderboard", id: _id })),
              { type: "Leaderboard", id: "LIST" },
            ]
          : [{ type: "Leaderboard", id: "LIST" }],
    }),
    
    // Generate/update leaderboard
    generateLeaderboard: builder.mutation({
      query: (data) => ({
        url: "/leaderboard/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Leaderboard", id: "LIST" }],
    }),
    
    // Get representative ranking history
    getRepresentativeRankingHistory: builder.query({
      query: (id, params) => ({
        url: `/leaderboard/history/${id}`,
        params,
      }),
      providesTags: (result, error, id) => [{ type: "Leaderboard", id: `HISTORY-${id}` }],
    }),
    
    // Get top performers
    getTopPerformers: builder.query({
      query: (params) => ({
        url: "/leaderboard/top-performers",
        params,
      }),
      providesTags: [{ type: "Leaderboard", id: "TOP" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeaderboardQuery,
  useGenerateLeaderboardMutation,
  useGetRepresentativeRankingHistoryQuery,
  useGetTopPerformersQuery,
} = leaderboardApi;