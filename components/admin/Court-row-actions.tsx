"use client";
import { FormEvent, useEffect, useState } from "react";

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
import { Switch } from "@/components/ui/switch";
import {
  useUpdateCourtMutation,
  useToggleCourtMutation,
  useDeleteCourtMutation,
} from "@/lib/redux/admin-api";
import { ImageUploadField } from "@/components/admin/image-upload-field";

type CourtItem = {
  id: string;
  name: string;
  sport: string;
  surface?: string | null;
  isIndoor: boolean;
  pricePerHour: number;
  image?: string | null;
  maxPlayers?: number | null;
  isActive?: boolean;
};

type CourtRowActionsProps = {
  item: CourtItem;
  slug: string;
};
export function CourtRowActions({ item, slug }: CourtRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [updateCourt, { isLoading: isLoadingEdit }] = useUpdateCourtMutation();

  // State form dikendalikan supaya tidak memakai defaultValue yang bisa berubah
  const [name, setName] = useState(item.name);
  const [sport, setSport] = useState(item.sport);
  const [surface, setSurface] = useState(item.surface ?? "");
  const [maxPlayers, setMaxPlayers] = useState(
    item.maxPlayers?.toString() ?? "",
  );
  const [pricePerHour, setPricePerHour] = useState(String(item.pricePerHour));

  // Segarkan state saat dialog dibuka dengan data terbaru dari tabel
  useEffect(() => {
    if (!open) return;
    setName(item.name);
    setSport(item.sport);
    setSurface(item.surface ?? "");
    setMaxPlayers(item.maxPlayers?.toString() ?? "");
    setPricePerHour(String(item.pricePerHour));
  }, [
    open,
    item.name,
    item.sport,
    item.surface,
    item.maxPlayers,
    item.pricePerHour,
  ]);

  const [active, setActive] = useState(item.isActive);
  const [toggleCourt, { isLoading: isLoadingToggle }] =
    useToggleCourtMutation();
  const [deleteCourt, { isLoading: isLoadingDelete }] =
    useDeleteCourtMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") ?? "").trim(),
      sport: String(formData.get("sport") ?? "").trim(),
      surface: String(formData.get("surface") ?? "").trim() || null,
      pricePerHour: Number(formData.get("pricePerHour")),
      maxPlayers: Number(formData.get("maxPlayers")) || null,
      image: String(formData.get("image") ?? "").trim() || null,
    };
    try {
      await updateCourt({
        slug,
        courtId: item.id,
        body: data,
      }).unwrap();

      form.reset();
      setOpen(false);
    } catch (error: any) {
      const serverMsg = error?.data?.error || "Gagal memperbarui court";
      alert(serverMsg);
    }
  }

  async function handleToggle() {
    const newStatus = !active;
    setActive(newStatus);
    try {
      await toggleCourt({
        slug,
        courtId: item.id,
        isActive: newStatus,
      }).unwrap();
    } catch (error: any) {
      const serverMsg = error?.data?.error || "Gagal mengubah status court";
      alert(serverMsg);
      setActive(!newStatus);
    }
  }
  async function handleDelete() {
    // Konfirmasi pertama — pastikan user ingin menghapus
    if (!confirm(`Yakin ingin menghapus "${item.name}" secara permanen?`))
      return;
    // Konfirmasi kedua — peringatan bahwa tindakan tidak bisa dibatalkan
    if (
      !confirm(
        `PERINGATAN: Tindakan ini tidak bisa dibatalkan! Semua booking terkait juga akan dihapus.`,
      )
    )
      return;

    try {
      // Kirim DELETE request ke API via Redux mutation untuk hard delete
      await deleteCourt({
        slug,
        courtId: item.id,
      }).unwrap();
    } catch (err: any) {
      // Jika API error, tampilkan pesan
      const serverMsg = err?.data?.error || "Gagal menghapus court";
      alert(serverMsg);
    }
  }
  return (
    <div className="flex items-center gap-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="group/button inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 hover:bg-secondary/50 px-2.5 py-1.5">
          <Pencil data-icon="inline-start" size={14} />
          Edit
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Court</DialogTitle>
            <DialogDescription>
              Perbarui detail lapangan yang tersedia.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Nama lapangan */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-court-name">Nama lapangan *</Label>
              <Input
                id="edit-court-name"
                name="name"
                placeholder="Court 1 - Panoramic Glass"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            {/* Field: Cabang Olahraga dan Kapasitas (2 kolom) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-court-sport">Cabang olahraga *</Label>
                <Input
                  id="edit-court-sport"
                  name="sport"
                  placeholder="Padel"
                  value={sport}
                  onChange={(event) => setSport(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-court-players">Kapasitas pemain</Label>
                <Input
                  id="edit-court-players"
                  name="maxPlayers"
                  type="number"
                  min={1}
                  placeholder="4"
                  value={maxPlayers}
                  onChange={(event) => setMaxPlayers(event.target.value)}
                />
              </div>
            </div>

            {/* Field: Jenis Permukaan */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-court-surface">Jenis permukaan</Label>
              <Input
                id="edit-court-surface"
                name="surface"
                placeholder="Vinyl"
                value={surface}
                onChange={(event) => setSurface(event.target.value)}
              />
            </div>

            {/* Field: URL Gambar */}

            <ImageUploadField
              key={open ? `${item.id}-image-open` : `${item.id}-image-closed`}
              id="edit-court-image"
              name="image"
              label="Gambar Court"
              initialUrl={item.image ?? ""}
            />

            {/* Field: Harga per Jam */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-court-price">Harga per jam (Rp) *</Label>
              <Input
                id="edit-court-price"
                name="pricePerHour"
                type="number"
                min={10000}
                step={1}
                placeholder="260000"
                value={pricePerHour}
                onChange={(event) => setPricePerHour(event.target.value)}
                required
              />
            </div>

            {/* Tombol di bawah dialog */}
            <DialogFooter>
              <DialogClose className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 px-4 py-2">
                Batal
              </DialogClose>
              <Button
                type="submit"
                disabled={isLoadingEdit}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isLoadingEdit ? "Menyimpan..." : "Perbarui Court"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Switch
        checked={active}
        onCheckedChange={handleToggle}
        size="sm"
        disabled={isLoadingToggle}
      />
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
