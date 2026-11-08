"use client";

import { useRouter } from "next/navigation"; // ← untuk refresh halaman tanpa reload
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Pencil,Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type EquipmentItem = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  isActive: boolean;
};

export function EquipmentRowActions({ item }: { item: EquipmentItem }) {
  const router = useRouter(); // ← untuk refresh data tanpa reload halaman
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(item.isActive); // ← status aktif/non-aktif

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim() || null, // ← kategori (bisa null)
      price: Number(formData.get("price")), // ← harga (angka)
      stock: Number(formData.get("stock")), // ← stok (angka)
    };
    try {
      const res = await fetch(`/api/admin/equipments/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Fafal memperbarui equipment");
        return;
      }
      form.reset();
      setOpen(false);
      router.refresh(); // ← refresh data server component tanpa reload halaman
    } catch (error) {
      console.error("Gagal memperbarui equipment: ", error);
      alert("Terjadi kesalahan saat memperbarui equipment");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle() {
    // ← toggle status aktif/non-aktif
    const newStatus = !active; // ← balik status: true→false atau false→true
    setActive(newStatus); // ← langsung ubah tampilan switch

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/equipments/${item.id}`, {
        method: "PATCH", // ← PATCH untuk update sebagian data
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: newStatus }), // ← kirim status baru
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Gagal mengubah status equipment");
        setActive(!newStatus); // ← kembalikan status jika gagal
        return;
      }
      router.refresh(); // ← refresh data tabel tanpa reload halaman
    } catch (err) {
      console.error("Gagal mengubah status equipment:", err);
      alert("Terjadi kesalahan saat mengubah status equipment");
      setActive(!newStatus); // ← kembalikan status jika gagal
    } finally {
      setLoading(false);
    }
  }
  
  async function handleDelete(){
    if(!confirm(`Yakin ingin menghapus "${item.name}" secara permanen?`)) return;
    if(!confirm(`PERINGATAN: Tinfakan ini tidak bisa di batalkan!`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/equipments/${item.id}`, {
        method:"DELETE",
        credentials:"include"
      })
      if(!res.ok){
        const error = await res.json();
        alert(error.error || "Gagal menghapus equipment");
        return;
      }
      router.refresh();
    } catch (error) {
      console.error("Gagal menghapus equipment : ", error);
      alert("Terjadi kesalahan saat menghapus equipment")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="group/button inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 hover:bg-secondary/50 px-2.5 py-1.5">
          <Pencil data-icon="inline-start" size={14} />
          Edit
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>
              Perbarui detail peralatan yang tersedia.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="">
            {/* Field 1: Nama peralatan */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-equipment-name">Nama peralatan *</Label>
              <Input
                id="edit-equipment-name"
                name="name" // ← name harus sama saat baca FormData
                placeholder="Rental Racket (Wilson Pro)"
                defaultValue={item.name} // ← isi otomatis dengan data existing
                required // ← wajib diisi
              />
            </div>

            {/* Field 2: Kategori */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-equipment-category">Kategori</Label>
              <Input
                id="edit-equipment-category"
                name="category"
                placeholder="Racket, Ball, Net, dll"
                defaultValue={item.category ?? ""} // ← jika null, tampilkan kosong
              />
            </div>

            {/* Field 3 & 4: Harga dan Stok (2 kolom berdampingan) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-equipment-price">Harga sewa (Rp) *</Label>
                <Input
                  id="edit-equipment-price"
                  name="price"
                  type="number" // ← input angka
                  min={10000} // ← minimal 10000
                  step={1}
                  placeholder="70000"
                  defaultValue={item.price}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-equipment-stock">Stok *</Label>
                <Input
                  id="edit-equipment-stock"
                  name="stock"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="10"
                  defaultValue={item.stock}
                  required
                />
              </div>
            </div>

            {/* Tombol di bawah dialog */}
            <DialogFooter>
              <DialogClose className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 px-4 py-2">
                Batal
              </DialogClose>
              <Button
                type="submit"
                disabled={loading} // ← disable saat sedang menyimpan
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {loading ? "Menyimpan..." : "Perbarui Equipment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Switch toggle untuk aktif/non-aktif */}
      <Switch
        checked={active} // ← sesuai dengan status equipment
        onCheckedChange={handleToggle} // ← saat switch di klik
        size="sm" // ← ukuran kecil
        disabled={loading} // ← disable saat sedang menyimpan
      />
      <Button
        variant="ghost"                     // ← gaya tombol transparan
        size="sm"                           // ← ukuran kecil
        onClick={handleDelete}              // ← saat diklik, jalankan handleDelete
        disabled={loading}                  // ← disable saat proses
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        // ← warna merah untuk menandakan aksi berbahaya
      >
        <Trash2 data-icon="inline-start" size={14} /> {/* ← ikon */}
        Hapus
      </Button>
    </div>
  );
}
