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

export interface AdminBooking {
  id: string;
  orderCode: string;
  courtId?: string;
  playDate: string;
  startTime: string;
  endTime: string;
  durationHour: number;
  pricePerHour: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
  createdAt: string;
  court: {
    id: string;
    name: string;
    sport: string;
    venue?: {
      id: string;
      name: string;
      slug: string;
      address?: string | null;
      coverImage?: string | null;
    };
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  payment?: {
    orderCode: string;
    status: string;
    method?: string | null;
    paidAt?: string | null;
    amount?: number | null;
  } | null;
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
  isActive?: boolean;
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
  isActive?: boolean;
}

export type ReportPeriod = "all" | "30" | "90";
export interface AdminReportTransaction {
  id: string;
  orderCode: string;
  playDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  courtName: string;
  amount: number;
  method: string | null;
  paidAt: string | null;
  bookingStatus: string;
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
export interface AdminReportVenueTotal {
  venueName: string;
  total: number;
  transactionCount: number;
}
export interface AdminReport {
  revenue: number;
  paidTransactionCount: number;
  cancelledBookingCount: number;
  venues: AdminReportVenueTotal[];
  transactions: AdminReportTransaction[];
}
export type AdminUserRole = "ADMIN" | "USER";
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  emailVerified: boolean;
  joinedAt: string;
  bookingsCount: number;
  lastActiveAt: string | null;
}

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/", credentials: "include" }),
  tagTypes: [
    "AdminVenue",
    "AdminCourt",
    "AdminBooking",
    "AdminReport",
    "AdminUser",
  ],
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

    toggleVenue: build.mutation<
      AdminVenue,
      { slug: string; isActive: boolean }
    >({
      query: ({ slug, isActive }) => ({
        url: `/api/admin/venues/${slug}`,
        method: "PATCH",
        body: { isActive },
      }),
      transformResponse: (res: { data: AdminVenue }) => res.data,
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

    deleteCourt: build.mutation<void, { slug: string; courtId: string }>({
      query: ({ slug, courtId }) => ({
        url: `/api/admin/venues/${slug}/courts/${courtId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { slug }) => [{ type: "AdminCourt", id: slug }],
    }),

    toggleCourt: build.mutation<
      AdminCourt,
      { slug: string; courtId: string; isActive: boolean }
    >({
      query: ({ slug, courtId, isActive }) => ({
        url: `/api/admin/venues/${slug}/courts/${courtId}`,
        method: "PATCH",
        body: { isActive },
      }),
      transformResponse: (res: { data: AdminCourt }) => res.data,
      invalidatesTags: (_r, _e, { slug }) => [{ type: "AdminCourt", id: slug }],
    }),

    getAdminBookings: build.query<
      AdminBooking[],
      { playDate?: string; status?: string } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.playDate) searchParams.set("playDate", params.playDate);
        if (params?.status) searchParams.set("status", params.status);
        const qs = searchParams.toString();
        return `/api/admin/booking${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: { data: AdminBooking[] }) => res.data,
      providesTags: ["AdminBooking"],
    }),

    getAdminReport: build.query<
      AdminReport,
      { venueSlug?: string; period?: ReportPeriod }
    >({
      query: ({ venueSlug, period }) => {
        const searchParams = new URLSearchParams();

        if (venueSlug) searchParams.set("venueSlug", venueSlug);
        if (period) searchParams.set("period", period);
        const qs = searchParams.toString();
        return `/api/admin/reports${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: { data: AdminReport }) => res.data,
      providesTags: ["AdminReport"],
    }),

    getAdminUsers: build.query<
      AdminUser[],
      { search?: string; role?: AdminUserRole } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.set("search", params.search);
        if (params?.role) searchParams.set("role", params.role);
        const qs = searchParams.toString();
        return `/api/admin/users${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (res: { data: AdminUser[] }) => res.data,
      providesTags: ["AdminUser"],
    }),

    updateUserRole: build.mutation<
      AdminUser,
      { userId: string; role: AdminUserRole }
    >({
      query: ({ userId, role }) => ({
        url: `/api/admin/users/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      transformResponse: (res: { data: AdminUser }) => res.data,
      // Setelah berhasil, daftar user otomatis diambil ulang
      invalidatesTags: ["AdminUser"],
    }),
    updateBookingStatus: build.mutation<
      AdminBooking,
      { bookingId: string; status: string }
    >({
      query: ({ bookingId, status }) => ({
        url: `/api/admin/booking/${bookingId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (res: { data: AdminBooking }) => res.data,
      // Laporan juga ikut diperbarui karena perubahan status
      // memengaruhi jumlah booking yang dibatalkan.
      invalidatesTags: ["AdminBooking", "AdminReport"],
    }),
  }),
});

export const {
  useGetAdminVenuesQuery,
  useGetPublicVenueDetailQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeactivateVenueMutation,
  useToggleVenueMutation,
  useGetVenueCourtsQuery,
  useCreateCourtMutation,
  useUpdateCourtMutation,
  useDeleteCourtMutation,
  useToggleCourtMutation,
  useGetAdminBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetAdminReportQuery,
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
} = adminApi;

export default adminApi;
