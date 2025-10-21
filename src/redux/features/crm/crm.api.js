import { api } from "@/redux/api/api";

const crmApi = api.injectEndpoints({
  tagTypes: ["Lead", "Stage", "Learner", "Task", "Note", "Activity"],

  endpoints: (builder) => ({
    // Lead Operations
    createLead: builder.mutation({
      query: (data) => ({
        url: "/leads",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lead"],
    }),

    getLeads: builder.query({
      query: (params) => ({
        url: "/leads",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Lead", id: _id })),
              { type: "Lead", id: "LIST" },
            ]
          : [{ type: "Lead", id: "LIST" }],
    }),
    getLeadsTasks: builder.query({
      query: (params) => ({
        url: "/leads/tasks-lead",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Lead", id: _id })),
              { type: "Lead", id: "LIST" },
            ]
          : [{ type: "Lead", id: "LIST" }],
    }),

    getLeadById: builder.query({
      query: (id) => `/leads/${id}`,
      providesTags: (result, error, id) => [{ type: "Lead", id }],
    }),

    updateLead: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/leads/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Task", id: "LIST" },
        { type: "Note", id: "LIST" },
        { type: "Activity", id: "LIST" },
      ],
    }),

    uploadLeadProfileImage: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file); // Changed from "profileImg" to "file"
        return {
          url: `/leads/${id}/profile-image`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Learner", id: "LIST" },
      ],
    }),

    updateLeadStage: builder.mutation({
      query: ({ id, stage, data, notes }) => ({
        url: `/leads/${id}/stage`,
        method: "PATCH",
        body: { stage, data, notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Stage", id: "LIST" },
      ],
    }),

    convertLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}/convert`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Lead", id },
        { type: "Learner", id: "LIST" },
      ],
    }),

    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lead"],
    }),

    // Stage Operations
    getStages: builder.query({
      query: () => "/leads/stages",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Stage", id: _id })),
              { type: "Stage", id: "LIST" },
            ]
          : [{ type: "Stage", id: "LIST" }],
    }),

    addStage: builder.mutation({
      query: (data) => ({
        url: "/leads/stages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Stage", id: "LIST" }],
    }),

    updateStage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/leads/stages/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Stage", id },
        { type: "Stage", id: "LIST" },
      ],
    }),

    deleteStage: builder.mutation({
      query: (stageId) => ({
        url: `/leads/stages/${stageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stage", id },
        { type: "Stage", id: "LIST" },
      ],
    }),

    updateStagePositions: builder.mutation({
      query: (stages) => ({
        url: "/leads/stages/positions",
        method: "PATCH",
        body: { stages },
      }),
      invalidatesTags: [{ type: "Stage", id: "LIST" }],
    }),

    initializeStages: builder.mutation({
      query: () => ({
        url: "/leads/stages/init",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Stage", id: "LIST" }],
    }),

    // Task Operations
    createLeadTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/leads/${id}/tasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    getLeadTasks: builder.query({
      query: (id) => `/leads/${id}/tasks`,
      providesTags: (result, error, id) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Task", id: _id })),
              { type: "Task", id: `LIST-${id}` },
            ]
          : [{ type: "Task", id: `LIST-${id}` }],
    }),

    updateLeadTask: builder.mutation({
      query: ({ id, taskId, ...data }) => ({
        url: `/leads/${id}/tasks/${taskId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Task", id: `LIST-${id}` },
      ],
    }),

    deleteLeadTask: builder.mutation({
      query: ({ id, taskId }) => ({
        url: `/leads/${id}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Task", id: `LIST-${id}` },
      ],
    }),

    // Note Operations
    createLeadNote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/leads/${id}/notes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Note", id: "LIST" },
      ],
    }),

    getLeadNotes: builder.query({
      query: (id) => `/leads/${id}/notes`,
      providesTags: (result, error, id) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Note", id: _id })),
              { type: "Note", id: `LIST-${id}` },
            ]
          : [{ type: "Note", id: `LIST-${id}` }],
    }),

    updateLeadNote: builder.mutation({
      query: ({ id, noteId, ...data }) => ({
        url: `/leads/${id}/notes/${noteId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Note", id: `LIST-${id}` },
      ],
    }),

    deleteLeadNote: builder.mutation({
      query: ({ id, noteId }) => ({
        url: `/leads/${id}/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Lead", id },
        { type: "Note", id: `LIST-${id}` },
      ],
    }),

    // Activity Operations
    getLeadActivities: builder.query({
      query: (id) => `/leads/${id}/activities`,
      providesTags: (result, error, id) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Activity", id: _id })),
              { type: "Activity", id: `LIST-${id}` },
            ]
          : [{ type: "Activity", id: `LIST-${id}` }],
    }),

    // ======================= stats related hooks
    // ======================= stats related hooks
    getCRMDashboard: builder.query({
      query: () => "/crm-stats/dashboard",
      providesTags: ["Lead"],
    }),

    getCRMStats: builder.query({
      query: () => "/crm-stats/stats",
      providesTags: ["Lead"],
    }),

    getRecentLeads: builder.query({
      query: (limit = 5) => `/crm-stats/recent-leads?limit=${limit}`,
      providesTags: ["Lead"],
    }),

    getSalesPipeline: builder.query({
      query: () => "/crm-stats/sales-pipeline",
      providesTags: ["Lead"],
    }),

    getUserTasks: builder.query({
      query: (limit = 3) => `/crm-stats/user-tasks?limit=${limit}`,
      providesTags: ["Lead"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateLeadMutation,
  useGetLeadsQuery,
  useGetLeadsTasksQuery,
  useGetLeadByIdQuery,
  useUpdateLeadStageMutation,
  useConvertLeadMutation,
  useDeleteLeadMutation,
  useGetStagesQuery,
  useAddStageMutation,
  useUpdateStageMutation,
  useDeleteStageMutation,
  useUpdateStagePositionsMutation,
  useInitializeStagesMutation,
  useUpdateLeadMutation,
  useCreateLeadTaskMutation,
  useGetLeadTasksQuery,
  useUpdateLeadTaskMutation,
  useDeleteLeadTaskMutation,
  useCreateLeadNoteMutation,
  useGetLeadNotesQuery,
  useUpdateLeadNoteMutation,
  useDeleteLeadNoteMutation,
  useGetLeadActivitiesQuery,
  useUploadLeadProfileImageMutation,

  // stats related hooks
  useGetCRMDashboardQuery,
  useGetCRMStatsQuery,
  useGetRecentLeadsQuery,
  useGetSalesPipelineQuery,
  useGetUserTasksQuery,
} = crmApi;
