"use client";

import { useState, type ReactNode } from "react";
import { Dumbbell } from "lucide-react";

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

  return (
    <Card className="py-0">
      <CardHeader className="border-b py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Peralatan</CardTitle>
            <CardDescription>
              Daftar peralatan yang bisa disewa di venue ini.
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

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px] pl-4">
                Nama Peralatan
              </TableHead>
              <TableHead className="min-w-[160px]">Kategori</TableHead>
              <TableHead className="w-[160px]">Harga</TableHead>
              <TableHead className="w-[100px]">Stok</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[180px] pr-4 text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {equipment.length > 0 && filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Peralatan tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : equipment.length > 0 ? (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-4 font-semibold text-slate-900">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.category ?? "-"}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {formatRupiah(item.price)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.stock}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        item.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }
                    >
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right">
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
                  className="h-24 text-center text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Dumbbell className="size-4" />
                    Belum ada peralatan untuk venue ini.
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
