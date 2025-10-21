import { api } from "@/redux/api/api";

const careerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCareer: builder.mutation({
      query: (post) => ({
        url: "/careers/create-career",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["careers"],
    }),
    getCareers: builder.query({
      query: () => ({
        url: "/careers",
        method: "GET",
      }),
      providesTags: ["careers"],
    }),
    getCareerById: builder.query({
      query: (id) => ({
        url: `/careers/${id}`,
        method: "GET",
      }),
      providesTags: ["careers"],
    }),
    deleteCareer: builder.mutation({
      query: (id) => ({
        url: `/careers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["careers"],
    }),
    updateCareer: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/careers/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "careers",
        { type: "careers", id },
      ],
    }),
  }),
});

export const {
  useCreateCareerMutation,
  useGetCareersQuery,
  useGetCareerByIdQuery,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
} = careerApi;
