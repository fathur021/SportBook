"use client";

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
import { useState, useId } from "react";
import { useCreateVenueMutation } from "@/lib/redux/admin-api";

type VenueFormDialogProps = {
  trigger: ReactElement;
};

export function VenueFormDialog({ trigger }: VenueFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const id = useId();
  const [createVenue, { isLoading }] = useCreateVenueMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const slug = formData.get("slug");
    const address = formData.get("address");
    const city = formData.get("city");
    const phone = formData.get("phone");
    const image = formData.get("image");
    const facilitiesRaw = formData.get("facilities");

    if (!name || !slug || !address || !city) return;

    const facilities = facilitiesRaw
      ? String(facilitiesRaw)
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    const body = {
      name: String(name),
      slug: String(slug),
      address: String(address),
      city: String(city),
      phone: phone ? String(phone) : undefined,
      coverImage: image ? String(image) : undefined,
      facilities,
    };

    try {
      await createVenue(body).unwrap();
      setOpen(false);
      event.currentTarget.reset();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Gagal membuat venue";
      setError(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Venue Baru</DialogTitle>
          <DialogDescription>
            Isi data venue. Field bertanda * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="venue-name">Nama venue *</Label>
            <Input
              id="venue-name"
              name="name"
              placeholder="Smash Padel Club Kemang"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="venue-slug">Slug *</Label>
              <Input
                id="venue-slug"
                name="slug"
                placeholder="smash-padel-club-kemang"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="venue-city">Kota *</Label>
              <Input
                id="venue-city"
                name="city"
                placeholder="Jakarta"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="venue-address">Alamat *</Label>
            <Input
              id="venue-address"
              name="address"
              placeholder="Jl. Kemang Timur No. 48"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="venue-phone">Nomor WhatsApp CS</Label>
              <Input
                id="venue-phone"
                name="phone"
                placeholder="081234567890"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="venue-image">URL foto cover</Label>
              <Input id="venue-image" name="image" placeholder="/hero.webp" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="venue-facilities">Fasilitas Venue</Label>
            <Input
              id="venue-facilities"
              name="facilities"
              placeholder="Free Wi-Fi, AC Lounge, Hot Shower, Parkir Luas"
            />
            <p className="text-xs text-slate-500">Pisahkan dengan koma.</p>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Batal
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isLoading ? "Menyimpan..." : "Simpan Venue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
