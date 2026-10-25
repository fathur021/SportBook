import { Button } from "@/components/ui/button";

export function SettingsSaveBar() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Perubahan belum disimpan. Tombol ini belum terhubung ke database.
      </p>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" className="h-9 px-4">
          Batal
        </Button>
        <Button
          type="button"
          className="h-9 px-4 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
