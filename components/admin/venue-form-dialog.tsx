"use client";

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

type VenueFormDialogProps = {
  trigger: ReactElement;
};

export function VenueFormDialog({ trigger }: VenueFormDialogProps) {
  const [open, setOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    console.log(data); // sementara: lihat hasil input di console
    // TODO: kirim ke API / server action kalau backend sudah siap

    setOpen(false);
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
              <Label htmlFor="venue-sport">Cabang olahraga *</Label>
              <Input
                id="venue-sport"
                name="sportTag"
                placeholder="Padel"
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
              <Label htmlFor="venue-price">Harga per jam (Rp) *</Label>
              <Input
                id="venue-price"
                name="pricePerHour"
                type="number"
                min={0}
                placeholder="260000"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="venue-image">URL foto</Label>
              <Input id="venue-image" name="image" placeholder="/hero.webp" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="venue-specs">Spesifikasi</Label>
            <Input
              id="venue-specs"
              name="specs"
              placeholder="4 Panoramic Courts, Indoor AC"
            />
            <p className="text-xs text-slate-500">Pisahkan dengan koma.</p>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Batal
            </DialogClose>
            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Simpan Venue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
