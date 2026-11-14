import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type SettingsSaveBarProps = {
  isDirty: boolean;
  isSaving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onReset: () => void;
  onSave: () => void;
};

export function SettingsSaveBar({
  isDirty,
  isSaving,
  message,
  onReset,
  onSave,
}: SettingsSaveBarProps) {
  // Teks di sisi kiri mengikuti kondisi form.
  const statusText = message
    ? message.text
    : isDirty
      ? "Ada perubahan yang belum disimpan."
      : "Semua perubahan sudah tersimpan.";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p
        className={
          message?.type === "error"
            ? "text-xs text-red-600"
            : message?.type === "success"
              ? "text-xs text-emerald-700"
              : "text-xs text-slate-500"
        }
      >
        {statusText}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-9 px-4"
          disabled={!isDirty || isSaving}
          onClick={onReset}
        >
          Batal
        </Button>
        <Button
          type="button"
          className="h-9 px-4 bg-emerald-600 text-white hover:bg-emerald-700"
          disabled={!isDirty || isSaving}
          onClick={onSave}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </div>
  );
}
