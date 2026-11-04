import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AdminCourt {
  id: string;
  name: string;
  sport: string;
  surface?: string | null;
  isIndoor: boolean;
  pricePerHour: number;
  image?: string | null;
  maxPlayers?: number | null;
  isActive?: boolean;
}

export interface AdminVenue {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  coverImage?: string | null;
  facilities: string[];
  courts: AdminCourt[];
}

export interface CreateVenueBody {
  slug: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  phone?: string;
  email?: string;
  coverImage?: string;
  facilities?: string[];
}

export interface CreateCourtBody {
  name: string;
  sport: string;
  surface?: string;
  isIndoor: boolean;
  pricePerHour: number;
  image?: string;
  maxPlayers?: number;
}

export interface UpdateVenueBody {
  name?: string;
  address?: string;
  city?: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  coverImage?: string | null;
  facilities?: string[];
}

export interface UpdateCourtBody {
  name?: string;
  sport?: string;
  surface?: string | null;
  isIndoor?: boolean;
  pricePerHour?: number;
  image?: string | null;
  maxPlayers?: number | null;
}

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/", credentials: "include" }),
  tagTypes: ["AdminVenue", "AdminCourt"],
  endpoints: (build) => ({
    getAdminVenues: build.query<AdminVenue[], void>({
      query: () => "/api/admin/venues",
      transformResponse: (res: { data: AdminVenue[] }) => res.data,
      providesTags: ["AdminVenue"],
    }),

    getPublicVenueDetail: build.query<AdminVenue, string>({
      query: (slug) => `/api/venues/${slug}`,
      transformResponse: (res: { data: AdminVenue }) => res.data,
      providesTags: (_r, _e, slug) => [{ type: "AdminVenue", id: slug }],
    }),

    createVenue: build.mutation<AdminVenue, CreateVenueBody>({
      query: (body) => ({
        url: "/api/admin/venues",
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: AdminVenue }) => res.data,
      invalidatesTags: ["AdminVenue"],
    }),

    updateVenue: build.mutation<
      AdminVenue,
      { slug: string; body: UpdateVenueBody }
    >({
      query: ({ slug, body }) => ({
        url: `/api/admin/venues/${slug}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: { data: AdminVenue }) => res.data,
      invalidatesTags: ["AdminVenue"],
    }),

    deactivateVenue: build.mutation<void, string>({
      query: (slug) => ({
        url: `/api/admin/venues/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminVenue"],
    }),

    getVenueCourts: build.query<AdminCourt[], string>({
      query: (slug) => `/api/admin/venues/${slug}/courts`,
      transformResponse: (res: { data: AdminCourt[] }) => res.data,
      providesTags: (_r, _e, slug) => [{ type: "AdminCourt", id: slug }],
    }),

    createCourt: build.mutation<
      AdminCourt,
      { slug: string; body: CreateCourtBody }
    >({
      query: ({ slug, body }) => ({
        url: `/api/admin/venues/${slug}/courts`,
        method: "POST",
        body,
      }),
      transformResponse: (res: { data: AdminCourt }) => res.data,
      invalidatesTags: (_r, _e, { slug }) => [{ type: "AdminCourt", id: slug }],
    }),

    updateCourt: build.mutation<
      AdminCourt,
      { slug: string; courtId: string; body: UpdateCourtBody }
    >({
      query: ({ slug, courtId, body }) => ({
        url: `/api/admin/venues/${slug}/courts/${courtId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: { data: AdminCourt }) => res.data,
      invalidatesTags: (_r, _e, { slug }) => [{ type: "AdminCourt", id: slug }],
    }),

    deactivateCourt: build.mutation<void, { slug: string; courtId: string }>({
      query: ({ slug, courtId }) => ({
        url: `/api/admin/venues/${slug}/courts/${courtId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { slug }) => [{ type: "AdminCourt", id: slug }],
    }),
  }),
});

export const {
  useGetAdminVenuesQuery,
  useGetPublicVenueDetailQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeactivateVenueMutation,
  useGetVenueCourtsQuery,
  useCreateCourtMutation,
  useUpdateCourtMutation,
  useDeactivateCourtMutation,
} = adminApi;

export default adminApi;
