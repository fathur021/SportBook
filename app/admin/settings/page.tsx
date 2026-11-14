import { SettingsView } from "@/components/admin/settings/settings-view";

export default function AdminSetting() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola aturan booking, jam operasional, dan pembayaran.
        </p>
      </div>

      <SettingsView />
    </main>
  );
}
