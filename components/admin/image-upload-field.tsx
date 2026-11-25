"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { Label } from "@/components/ui/label";

type ImageUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  initialUrl?: string | null;
};

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export function ImageUploadField({
  id,
  name,
  label,
  initialUrl = "",
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    // Cek dulu di browser sebelum request
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Format harus PNG, JPG, atau WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Ukuran gambar maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    const body = new FormData();
    body.append("file", file);

    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Gagal mengunggah gambar");
      }

      setUrl(result.url as string);
    } catch (err: any) {
      setError(err?.message || "Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>

      {/* Nilai ini yang ikut terkirim saat form venue/court disimpan */}
      <input type="hidden" name={name} value={url} readOnly />

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleChange}
        disabled={uploading}
        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-700 hover:file:bg-emerald-100"
      />

      {uploading && <p className="text-xs text-slate-500">Mengunggah...</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {url && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Pratinjau gambar"
            className="h-16 w-16 rounded-md border object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setUrl("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-xs text-red-500 underline"
          >
            Hapus gambar
          </button>
        </div>
      )}

      <p className="text-xs text-slate-500">
        PNG, JPG, atau WebP. Maksimal 5 MB.
      </p>
    </div>
  );
}
