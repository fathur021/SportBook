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

type EquipmentFormDialogProps = {
  trigger: ReactElement;
};

export function EquipmentFormDialog({ trigger }: EquipmentFormDialogProps) {
  const [open, setOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      pricePerUnit: Number(formData.get("pricePerUnit")),
      unit: String(formData.get("unit") ?? "").trim(),
    };
    console.log(data);
    form.reset();
    setOpen(false);
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
            <Label htmlFor="equipment-description">Deskripsi</Label>
            <Input
              id="equipment-description"
              name="description"
              placeholder="Raket siap pakai untuk sesi bermain"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="equipment-price">Harga per unit (Rp) *</Label>
              <Input
                id="equipment-price"
                name="pricePerUnit"
                type="number"
                min={0}
                step={1}
                placeholder="70000"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="equipment-unit">Satuan</Label>
              <Input
                id="equipment-unit"
                name="unit"
                placeholder="per racket / session"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Batal
            </DialogClose>
            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Simpan Equipment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
