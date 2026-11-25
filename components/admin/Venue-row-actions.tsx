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
  useDeleteVenueMutation,
} from "@/lib/redux/admin-api";
import { ImageUploadField } from "@/components/admin/image-upload-field";
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
  isPopular?: boolean;
  // Dibuat opsional supaya cocok dengan AdminVenue dari tabel admin
  popularityRank?: number | null;
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

  const [popular, setPopular] = useState(item.isPopular ?? false);

  // Mutation untuk hapus permanen venue beserta data terkait
  const [deleteVenue, { isLoading: isLoadingDelete }] =
    useDeleteVenueMutation();

  // Submit form edit venue
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const rankRaw = String(formData.get("popularityRank") ?? "");
    const parsedRank = Number(rankRaw);
    // Urutan disimpan hanya kalau venue ditandai popular dan angkanya valid
    const popularityRank =
      popular && Number.isInteger(parsedRank) && parsedRank > 0
        ? parsedRank
        : null;

    // Kumpulkan data dari form
    const data = {
      name: String(formData.get("name") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      coverImage: String(formData.get("coverImage") ?? "").trim() || null,
      isPopular: popular,
      popularityRank,
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

  // Hard delete venue beserta court, booking, dan payment terkait
  async function handleDelete() {
    if (!confirm(`Yakin ingin menghapus permanen "${item.name}"?`)) return;
    if (
      !confirm(
        `PERINGATAN: Tindakan ini tidak bisa dibatalkan! Semua court, booking, dan pembayaran terkait juga akan dihapus.`,
      )
    )
      return;

    try {
      await deleteVenue(item.slug).unwrap();
    } catch (err: any) {
      const serverMsg = err?.data?.error || "Gagal menghapus venue";
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

        {/* Tinggi dialog dibatasi supaya tidak melewati layar */}
        <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          {/* Header dikunci di atas */}
          <DialogHeader className="shrink-0 gap-1.5 border-b px-4 py-4">
            <DialogTitle>Edit Venue</DialogTitle>
            <DialogDescription>
              Perbarui detail venue yang tersedia.
            </DialogDescription>
          </DialogHeader>

          {/* Form dibagi dua: isi yang bisa digulir + footer yang tetap */}
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* Hanya bagian field yang digulir */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
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

              {/* Field: Kota dan Telepon (2 kolom) */}
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
              <ImageUploadField
                id="edit-venue-coverImage"
                name="coverImage"
                label="Gambar Cover"
                initialUrl={item.coverImage ?? ""}
              />

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

              {/* Switch popular: admin menandai venue untuk homepage */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-venue-popular">
                    Tampilkan di Popular Venues
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Venue ini akan muncul di homepage.
                  </p>
                </div>
                <Switch
                  id="edit-venue-popular"
                  checked={popular}
                  onCheckedChange={setPopular}
                  size="sm"
                />
              </div>

              {/* Input urutan hanya muncul kalau popular aktif */}
              {popular && (
                <div className="space-y-1.5">
                  <Label htmlFor="edit-venue-rank">Urutan popular</Label>
                  <Input
                    id="edit-venue-rank"
                    name="popularityRank"
                    type="number"
                    min={1}
                    placeholder="1"
                    defaultValue={item.popularityRank ?? ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Angka terkecil tampil paling depan.
                  </p>
                </div>
              )}
            </div>

            {/* Footer tidak ikut digulir, jadi tombol tetap terlihat */}
            <DialogFooter className="mx-0 mb-0 shrink-0 gap-2 rounded-none border-t bg-muted/80 px-4 py-3 sm:flex-row sm:justify-end">
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
