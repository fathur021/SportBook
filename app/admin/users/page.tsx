"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { UserTable } from "@/components/admin/user-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  type AdminUserRole,
} from "@/lib/redux/admin-api";

export default function AdminUsersPage() {
  // Kata kunci pencarian nama atau email
  const [search, setSearch] = useState("");

  // Filter role: "all" berarti semua role
  const [roleFilter, setRoleFilter] = useState<"all" | AdminUserRole>("all");

  const [actionError, setActionError] = useState<string | null>(null);

  const { data: users, isLoading, isError } = useGetAdminUsersQuery();

  const [updateUserRole] = useUpdateUserRoleMutation();

  const filteredUsers = useMemo(() => {
    const list = users ?? [];
    const keyword = search.trim().toLowerCase();

    return list.filter((user) => {
      const matchRole = roleFilter === "all" || user.role === roleFilter;
      const matchKeyword =
        keyword.length === 0 ||
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword);

      return matchRole && matchKeyword;
    });
  }, [users, roleFilter, search]);

  const allUsers = users ?? [];
  const adminCount = allUsers.filter((user) => user.role === "ADMIN").length;
  const unverifiedCount = allUsers.filter((user) => !user.emailVerified).length;

  async function handleRoleChange(userId: string, role: AdminUserRole) {
    setActionError(null);
    try {
      await updateUserRole({ userId, role }).unwrap();
    } catch (error) {
      const apiError = error as { data?: { error?: string } };
      setActionError(apiError.data?.error ?? "Gagal mengubah role user")
    }
  }

  const summaryCards = [
    {
      key: "total",
      label: "Total User",
      value: allUsers.length,
      note: "Semua akun terdaftar",
      icon: Users,
      iconClassName: "bg-slate-100 text-slate-600",
    },
    {
      key: "admin",
      label: "Admin",
      value: adminCount,
      note: "Punya akses panel admin",
      icon: ShieldCheck,
      iconClassName: "bg-emerald-50 text-emerald-700",
    },
    {
      key: "unverified",
      label: "Belum Verifikasi",
      value: unverifiedCount,
      note: "Email belum dikonfirmasi",
      icon: ShieldAlert,
      iconClassName: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header halaman */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola User
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lihat daftar pengguna dan atur role aksesnya.
          </p>
        </div>

        {/* Tombol ini belum berfungsi karena backend belum ada */}
        <Button disabled title="Belum tersedia">
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      {/* Ringkasan jumlah user */}
      <section className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.key}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{card.note}</p>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconClassName}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </article>
          );
        })}
      </section>

      {/* Kartu daftar user */}
      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Daftar User</CardTitle>
          <CardDescription>
            Semua akun yang terdaftar di SportBook.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          {/* Baris pencarian dan filter role */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama atau email..."
                className="pl-9"
              />
            </div>

            <Select
              value={roleFilter}
              onValueChange={(value) =>
                setRoleFilter((value ?? "all") as "all" | AdminUserRole)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semua role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua role</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <UserTable users={filteredUsers} onRoleChange={handleRoleChange} />
        </CardContent>
      </Card>
    </div>
  );
}
