"use client";

import { useId, useState } from "react";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { useCreateCourtMutation } from "@/lib/redux/admin-api";

type CourtFormDialogProps = {
  trigger: ReactElement;
  slug: string;
};

export default function CourtFormDialog({
  trigger,
  slug,
}: CourtFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [createCourt, { isLoading: isSubmitting }] = useCreateCourtMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [isIndoor, setIsIndoor] = useState(false);
  const id = useId();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString()?.trim();
    const sport = formData.get("sport")?.toString()?.trim();
    const surfaceRaw = formData.get("surface")?.toString()?.trim();
    const surface = surfaceRaw || undefined;
    const pricePerHourStr = formData.get("pricePerHour")?.toString();
    const pricePerHour = pricePerHourStr ? Number(pricePerHourStr) : undefined;
    const imageRaw = formData.get("image")?.toString()?.trim();
    const image = imageRaw || undefined;
    const maxPlayersStr = formData.get("maxPlayers")?.toString();
    const maxPlayers = maxPlayersStr ? Number(maxPlayersStr) : undefined;

    if (!name || !sport || !pricePerHour) {
      setFormError("Nama court, cabang olahraga, dan harga per jam wajib diisi.");
      return;
    }

    try {
      await createCourt({
        slug,
        body: { name, sport, surface, isIndoor, pricePerHour, image, maxPlayers },
      }).unwrap();
      setOpen(false);
      setIsIndoor(false);
      event.currentTarget.reset();
    } catch (err: any) {
      const serverMsg = err?.data?.error || err?.error || "Gagal membuat court. Coba lagi.";
      setFormError(serverMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Court</DialogTitle>
          <DialogDescription>
            Isi data court untuk venue ini. Field bertanda * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {formError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-name`}>Nama court *</Label>
            <Input
              id={`${id}-name`}
              name="name"
              placeholder="Court 1 - Panoramic Glass"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-sport`}>Cabang olahraga *</Label>
              <Input
                id={`${id}-sport`}
                name="sport"
                placeholder="Padel"
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

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-surface`}>Jenis permukaan</Label>
            <Input
              id={`${id}-surface`}
              name="surface"
              placeholder="Vinyl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${id}-image`}>URL Gambar</Label>
            <Input
              id={`${id}-image`}
              name="image"
              type="url"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-price`}>Harga per jam (Rp) *</Label>
              <Input
                id={`${id}-price`}
                name="pricePerHour"
                type="number"
                min={10000}
                placeholder="260000"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor={`${id}-indoor`}>Indoor</Label>
                <p className="text-xs text-slate-500">
                  Centang jika court indoor.
                </p>
              </div>
              <Switch
                id={`${id}-indoor`}
                checked={isIndoor}
                onCheckedChange={setIsIndoor}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Court"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
