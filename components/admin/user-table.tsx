"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminUser, AdminUserRole } from "@/lib/redux/admin-api";

// Ambil huruf depan nama untuk avatar, contoh "Budi Santoso" -> "BS"
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// Format tanggal "YYYY-MM-DD" ke format Indonesia
function formatDate(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Format waktu ISO ke tanggal dan jam lokal
function formatDateTime(iso: string | null): string {
  if (!iso) return "Belum pernah";
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UserTable({
  users,
  onRoleChange,
}: {
  users: AdminUser[];
  onRoleChange: (userId: string, role: AdminUserRole) => void;
}) {
  return (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="min-w-56 pl-5">Pengguna</TableHead>
          <TableHead className="w-36">Role</TableHead>
          <TableHead className="w-36">Verifikasi</TableHead>
          <TableHead className="w-24">Booking</TableHead>
          <TableHead className="w-36">Bergabung</TableHead>
          <TableHead className="w-40 pr-5">Terakhir Aktif</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id} className="hover:bg-slate-50/70">
              {/* Kolom 1: avatar, nama, dan email */}
              <TableCell className="py-3 pl-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Kolom 2: dropdown ubah role */}
              <TableCell className="py-3">
                <Select
                  value={user.role}
                  onValueChange={(value) => {
                    // Base UI mengirim null kalau pilihan dikosongkan
                    if (!value) return;
                    onRoleChange(user.id, value as AdminUserRole);
                  }}
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Kolom 3: status verifikasi email */}
              <TableCell className="py-3">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    Terverifikasi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <ShieldAlert className="h-4 w-4" />
                    Belum
                  </span>
                )}
              </TableCell>

              {/* Kolom 4: jumlah booking milik user */}
              <TableCell className="py-3 text-sm font-medium text-slate-700">
                {user.bookingsCount}
              </TableCell>

              {/* Kolom 5: tanggal bergabung */}
              <TableCell className="py-3 text-sm text-slate-600">
                {formatDate(user.joinedAt)}
              </TableCell>

              {/* Kolom 6: aktivitas terakhir */}
              <TableCell className="py-3 pr-5 text-sm text-slate-600">
                {formatDateTime(user.lastActiveAt)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-slate-500">
              Tidak ada user yang cocok dengan pencarian.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
