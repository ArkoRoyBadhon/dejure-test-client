import { api } from "@/redux/api/api";

const staffApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Staff Member Endpoints
    createStaff: builder.mutation({
      query: (formData) => ({
        url: "/staff",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Staff"],
      transformErrorResponse: (response) => response.data,
    }),

    getAllStaff: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => ({
        url: "/staff",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Staff", id: _id })),
              "Staff",
            ]
          : ["Staff"],
      transformResponse: (response) => ({
        data: response,
        pagination: response.pagination || {},
      }),
    }),

    getStaffById: builder.query({
      query: (id) => ({
        url: `/staff/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Staff", id }],
    }),

    updateStaff: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/staff/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Staff",
        { type: "Staff", id },
      ],
    }),

    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),

    // Staff Role Endpoints
    getStaffRoles: builder.query({
      query: () => ({
        url: "/staff/roles/all",
        method: "GET",
      }),
      providesTags: ["StaffRole"],
    }),

    getModules: builder.query({
      query: () => ({
        url: "/staff/modules",
        method: "GET",
      }),
      providesTags: ["StaffRole"],
    }),

    createStaffRole: builder.mutation({
      query: (roleData) => ({
        url: "/staff/roles/create",
        method: "POST",
        body: roleData,
      }),
      invalidatesTags: ["StaffRole"],
    }),

    updateStaffRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `/staff/roles/update/${id}`,
        method: "PATCH",
        body: roleData,
      }),
      invalidatesTags: ["StaffRole"],
    }),

    deleteStaffRole: builder.mutation({
      query: (id) => ({
        url: `/staff/roles/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StaffRole"],
    }),

    // Staff Permission Endpoints
    updateStaffPermissions: builder.mutation({
      query: ({ id, customPermissions }) => ({
        url: `/staff/${id}/permissions`,
        method: "PATCH",
        body: { customPermissions },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Staff", id },
        "Staff",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateStaffMutation,
  useGetAllStaffQuery,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useGetStaffRolesQuery,
  useCreateStaffRoleMutation,
  useUpdateStaffRoleMutation,
  useDeleteStaffRoleMutation,
  useUpdateStaffPermissionsMutation,
  useGetModulesQuery,
} = staffApi;
