import { api } from "@/redux/api/api";

const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (formData) => ({
        url: "/contacts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["contact"],
    }),

    getAllContacts: builder.query({
      query: () => ({
        url: "/contacts",
        method: "GET",
      }),
      providesTags: ["contact"],
    }),

    getContactById: builder.query({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => ["contact", { type: "contact", id }],
    }),

    updateContact: builder.mutation({
      query: ({ id, data }) => ({
        url: `/contacts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "contact",
        { type: "contact", id },
      ],
    }),

    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "contact",
        { type: "contact", id },
      ],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactApi;
