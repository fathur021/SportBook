"use client";

import { usePathname, useRouter } from "next/navigation"; // ← useRouter untuk refresh tanpa reload
import { useState } from "react";
import type { FormEvent, ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EquipmentFormDialogProps = {
  trigger: ReactElement;
};

export function EquipmentFormDialog({ trigger }: EquipmentFormDialogProps) {
  const router = useRouter(); // ← untuk refresh data tanpa reload halaman
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const slug = pathname.split("/").pop() ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim() || null,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
    };

    try {
      const res = await fetch(`/api/admin/venues/${slug}/equipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Gagal menyimpan equipment");
        return;
      }

      form.reset();
      setOpen(false);
      router.refresh(); // ← refresh data server component tanpa reload halaman
    } catch (err) {
      console.error("Gagal menyimpan equipment:", err);
      alert("Terjadi kesalahan saat menyimpan equipment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Equipment</DialogTitle>
          <DialogDescription>
            Isi detail peralatan yang tersedia untuk disewa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="equipment-name">Nama peralatan *</Label>
            <Input
              id="equipment-name"
              name="name"
              placeholder="Rental Racket (Wilson Pro)"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="equipment-category">Kategori</Label>
            <Input
              id="equipment-category"
              name="category"
              placeholder="Racket, Ball, Net, dll"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="equipment-price">Harga sewa (Rp) *</Label>
              <Input
                id="equipment-price"
                name="price"
                type="number"
                min={10000}
                step={1}
                placeholder="70000"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="equipment-stock">Stok *</Label>
              <Input
                id="equipment-stock"
                name="stock"
                type="number"
                min={0}
                step={1}
                placeholder="10"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Batal
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {loading ? "Menyimpan..." : "Simpan Equipment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
