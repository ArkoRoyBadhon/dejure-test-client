import { api } from "@/redux/api/api";

const mentorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    mentorLogin: builder.mutation({
      query: (post) => ({
        url: "/mentors/login",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["mentor"],
    }),
    getMentorProfile: builder.query({
      query: () => ({
        url: "/mentors/profile",
        method: "GET",
      }),
      providesTags: ["mentor"],
    }),
    getMentors: builder.query({
      query: () => ({
        url: "/mentors",
        method: "GET",
      }),
      providesTags: ["mentor"],
    }),
    getAllMentors: builder.query({
      query: () => ({
        url: "/mentors",
        method: "GET",
      }),
      providesTags: ["mentor"],
    }),
    addMentor: builder.mutation({
      query: (mentorData) => ({
        url: "/mentors/add",
        method: "POST",
        body: mentorData,
      }),
      invalidatesTags: ["Mentor"],
    }),

    updateMentor: builder.mutation({
      query: (mentorData) => ({
        url: "/mentors/update",
        method: "PATCH",
        body: mentorData,
      }),
      invalidatesTags: ["Mentor"],
    }),
    changePasswordMentor: builder.mutation({
      query: (mentorData) => ({
        url: "/mentors/update-password",
        method: "PATCH",
        body: mentorData,
      }),
      invalidatesTags: ["Mentor"],
    }),
    updateMentorByAdmin: builder.mutation({
      query: (formData) => {
        return {
          url: "/mentors/update-admin",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Mentor"],
    }),

    updateMentorStatus: builder.mutation({
      query: ({ id, ...statusData }) => ({
        url: `/mentors/status/${id}`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: ["Mentor"],
    }),

    deleteMentor: builder.mutation({
      query: (id) => ({
        url: `/mentors/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mentor"],
    }),
  }),
});

export const {
  useMentorLoginMutation,
  useGetMentorProfileQuery,
  useGetMentorsQuery,
  useGetAllMentorsQuery,
  useAddMentorMutation,
  useUpdateMentorMutation,
  useChangePasswordMentorMutation,
  useUpdateMentorByAdminMutation,
  useUpdateMentorStatusMutation,
  useDeleteMentorMutation,
} = mentorApi;
