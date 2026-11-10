"use client";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useUpdateVenueMutation,
  useToggleVenueMutation,
  useDeactivateVenueMutation,
} from "@/lib/redux/admin-api";

// Tipe data venue yang diterima dari tabel
type VenueItem = {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  coverImage?: string | null;
  description?: string | null;
  facilities?: string[];
  isActive?: boolean;
};

type VenueRowActionsProps = {
  item: VenueItem;
};

export function VenueRowActions({ item }: VenueRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [updateVenue, { isLoading: isLoadingEdit }] = useUpdateVenueMutation();

  // State untuk switch toggle — mengikuti status awal dari data
  const [active, setActive] = useState(item.isActive);
  const [toggleVenue, { isLoading: isLoadingToggle }] =
    useToggleVenueMutation();

  // Mutation untuk soft delete venue
  const [deactivateVenue, { isLoading: isLoadingDelete }] =
    useDeactivateVenueMutation();

  // Submit form edit venue
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Kumpulkan data dari form
    const data = {
      name: String(formData.get("name") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      coverImage: String(formData.get("coverImage") ?? "").trim() || null,
    };

    try {
      // Kirim PATCH request ke API via Redux mutation
      await updateVenue({
        slug: item.slug,
        body: data,
      }).unwrap();

      // Tutup dialog setelah berhasil
      form.reset();
      setOpen(false);
    } catch (error: any) {
      // Jika API error, tampilkan pesan
      const serverMsg = error?.data?.error || "Gagal memperbarui venue";
      alert(serverMsg);
    }
  }

  // Toggle status aktif/non-aktif dengan optimistic UI
  async function handleToggle() {
    const newStatus = !active;
    setActive(newStatus); // Langsung ubah tampilan tanpa tunggu API

    try {
      await toggleVenue({
        slug: item.slug,
        isActive: newStatus,
      }).unwrap();
    } catch (error: any) {
      // Rollback jika API gagal
      const serverMsg = error?.data?.error || "Gagal mengubah status venue";
      alert(serverMsg);
      setActive(!newStatus); // Kembalikan ke status semula
    }
  }

  // Soft delete venue (nonaktifkan, bukan hapus permanen)
  async function handleDelete() {
    // Konfirmasi sebelum menonaktifkan
    if (!confirm(`Yakin ingin menonaktifkan "${item.name}"? Venue ini tidak akan terlihat oleh pengguna.`)) return;

    try {
      // Kirim DELETE request ke API via Redux mutation untuk soft delete
      await deactivateVenue(item.slug).unwrap();
    } catch (err: any) {
      // Jika API error, tampilkan pesan
      const serverMsg = err?.data?.error || "Gagal menonaktifkan venue";
      alert(serverMsg);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* Dialog Edit Venue */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Tombol Edit — styling disalin manual karena @base-ui/react tidak support asChild */}
        <DialogTrigger className="group/button inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 hover:bg-secondary/50 px-2.5 py-1.5">
          <Pencil data-icon="inline-start" size={14} />
          Edit
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Venue</DialogTitle>
            <DialogDescription>
              Perbarui detail venue yang tersedia.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Nama venue */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-name">Nama venue *</Label>
              <Input
                id="edit-venue-name"
                name="name"
                placeholder="SportHub Arena Jakarta"
                defaultValue={item.name}
                required
              />
            </div>

            {/* Field: Alamat dan Kota (2 kolom) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-venue-city">Kota *</Label>
                <Input
                  id="edit-venue-city"
                  name="city"
                  placeholder="Jakarta"
                  defaultValue={item.city}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-venue-phone">Telepon</Label>
                <Input
                  id="edit-venue-phone"
                  name="phone"
                  placeholder="+62 812-xxxx-xxxx"
                  defaultValue={item.phone ?? ""}
                />
              </div>
            </div>

            {/* Field: Alamat lengkap */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-address">Alamat *</Label>
              <Input
                id="edit-venue-address"
                name="address"
                placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
                defaultValue={item.address}
                required
              />
            </div>

            {/* Field: Email */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-email">Email</Label>
              <Input
                id="edit-venue-email"
                name="email"
                type="email"
                placeholder="info@sportbook.com"
                defaultValue={item.email ?? ""}
              />
            </div>

            {/* Field: URL Gambar Cover */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-coverImage">URL Gambar Cover</Label>
              <Input
                id="edit-venue-coverImage"
                name="coverImage"
                type="url"
                placeholder="https://images.unsplash.com/..."
                defaultValue={item.coverImage ?? ""}
              />
            </div>

            {/* Field: Deskripsi */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-description">Deskripsi</Label>
              <Textarea
                id="edit-venue-description"
                name="description"
                placeholder="Deskripsi singkat tentang venue..."
                defaultValue={item.description ?? ""}
                rows={3}
              />
            </div>

            {/* Tombol di bawah dialog */}
            <DialogFooter>
              {/* Tombol Batal — styling disalin manual karena @base-ui/react tidak support asChild */}
              <DialogClose className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 px-4 py-2">
                Batal
              </DialogClose>
              <Button
                type="submit"
                disabled={isLoadingEdit}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isLoadingEdit ? "Menyimpan..." : "Perbarui Venue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Switch Toggle Aktif/Non-aktif */}
      <Switch
        checked={active}
        onCheckedChange={handleToggle}
        size="sm"
        disabled={isLoadingToggle}
      />

      {/* Tombol Hapus (Soft Delete) */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isLoadingDelete}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 data-icon="inline-start" size={14} />
        Hapus
      </Button>
    </div>
  );
}
