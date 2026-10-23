"use client";

import { useId, useState } from "react";
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
import { Switch } from "@/components/ui/switch";

type CourtFormDialogProps = {
  trigger: ReactElement;
  defaultPricePerHour?: number;
  disciplineLabel?: string;
};

export default function CourtFormDialog({
  trigger,
  defaultPricePerHour,
  disciplineLabel,
}: CourtFormDialogProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

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
          <DialogTitle>Tambah Court</DialogTitle>
          <DialogDescription>
            {disciplineLabel
              ? `Isi data court untuk cabang ${disciplineLabel}. Field bertanda * wajib diisi.`
              : "Isi data court. Field bertanda * wajib diisi."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${id}-label`}>Nama court *</Label>
            <Input
              id={`${id}-label`}
              name="label"
              placeholder="Court 1 - Panoramic Glass"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-price`}>Harga per jam (Rp) *</Label>
              <Input
                id={`${id}-price`}
                name="pricePerHour"
                type="number"
                min={0}
                defaultValue={defaultPricePerHour}
                placeholder="260000"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-players`}>Kapasitas pemain</Label>
              <Input
                id={`${id}-players`}
                name="maxPlayers"
                type="number"
                min={1}
                placeholder="4"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-badge`}>Badge</Label>
              <Input
                id={`${id}-badge`}
                name="badge"
                placeholder="Featured Arena"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-image`}>URL foto</Label>
              <Input
                id={`${id}-image`}
                name="image"
                placeholder="/hero.webp"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-specs`}>Spesifikasi</Label>
            <Input
              id={`${id}-specs`}
              name="specs"
              placeholder="Panoramic Glass, Supercourt Mondo Turf"
            />
            <p className="text-xs text-slate-500">Pisahkan dengan koma.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-features`}>Fasilitas</Label>
            <Input
              id={`${id}-features`}
              name="features"
              placeholder="AC Indoor, LED Lighting"
            />
            <p className="text-xs text-slate-500">Pisahkan dengan koma.</p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor={`${id}-operational`}>Court aktif</Label>
              <p className="text-xs text-slate-500">
                Court nonaktif tidak bisa dipesan.
              </p>
            </div>
            <Switch
              id={`${id}-operational`}
              name="isOperational"
              defaultChecked
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Batal
            </DialogClose>
            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Simpan Court
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
