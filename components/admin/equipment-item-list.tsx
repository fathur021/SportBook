"use client";

import { useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Dumbbell,
  Package,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/format-rupiah";
import { EquipmentRowActions } from "@/components/admin/Equipment-row-actions";
import {
  AdminStatCards,
  type AdminStatItem,
} from "@/components/admin/admin-stat-cards";
import { SearchInput } from "@/components/admin/search-input";

type EquipmentRow = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  isActive: boolean;
};

type EquipmentItemListProps = {
  equipment: EquipmentRow[];
  action?: ReactNode;
};

export function EquipmentItemList({
  equipment,
  action,
}: EquipmentItemListProps) {
  const [query, setQuery] = useState("");

  const filtered = equipment.filter((item) =>
    `${item.name} ${item.category ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const activeItems = equipment.filter((item) => item.isActive).length;
  const totalStock = equipment.reduce((total, item) => total + item.stock, 0);
  const averagePrice =
    equipment.length > 0
      ? Math.round(
          equipment.reduce((total, item) => total + item.price, 0) /
            equipment.length,
        )
      : 0;

  const stats: AdminStatItem[] = [
    {
      label: "Total Item",
      value: equipment.length,
      note: "Peralatan di venue ini",
      icon: Package,
      tone: "slate",
    },
    {
      label: "Item Aktif",
      value: activeItems,
      note: "Bisa disewa pelanggan",
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      label: "Total Stok",
      value: totalStock,
      note: "Unit tersedia",
      icon: Dumbbell,
      tone: "blue",
    },
    {
      label: "Rata-rata Harga",
      value: formatRupiah(averagePrice),
      note: "Tarif sewa per item",
      icon: Wallet,
      tone: "amber",
    },
  ];

  return (
    <div className="space-y-4">
      <AdminStatCards items={stats} />

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Daftar Peralatan</CardTitle>
              <CardDescription>
                Menampilkan {filtered.length} dari {equipment.length} item.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Cari nama atau kategori..."
              />
              {action}
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto px-0">
          <Table className="min-w-[880px]">
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="min-w-[240px] pl-5">
                  Nama Peralatan
                </TableHead>
                <TableHead className="min-w-[160px]">Kategori</TableHead>
                <TableHead className="w-[160px]">Harga</TableHead>
                <TableHead className="w-[100px]">Stok</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[180px] pr-5 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {equipment.length > 0 && filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-28 text-center text-muted-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Package className="size-4" />
                      Peralatan tidak ditemukan.
                    </span>
                  </TableCell>
                </TableRow>
              ) : equipment.length > 0 ? (
                filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/70"
                  >
                    <TableCell className="py-3 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-2 ring-white">
                          <Dumbbell className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {item.category ?? "Tanpa kategori"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="border-slate-200 bg-slate-50 font-medium text-slate-600"
                      >
                        {item.category ?? "-"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-emerald-700">
                        {formatRupiah(item.price)}
                      </span>
                    </TableCell>

                    <TableCell>
                      {item.stock > 0 ? (
                        <span className="text-sm font-medium text-slate-700">
                          {item.stock} unit
                        </span>
                      ) : (
                        <Badge className="border-rose-200 bg-rose-50 font-medium text-rose-700">
                          Habis
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          item.isActive
                            ? "gap-1.5 border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
                            : "gap-1.5 border-slate-200 bg-slate-100 font-medium text-slate-500"
                        }
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            item.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>

                    <TableCell className="pr-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EquipmentRowActions item={item} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-28 text-center text-muted-foreground"
                  >
                    <span className="inline-flex flex-col items-center gap-2">
                      <Dumbbell className="size-5" />
                      Belum ada peralatan untuk venue ini.
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
