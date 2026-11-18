import { ChangePasswordView } from "@/components/admin/change-password/change-password-view";

export default function AdminChangePasswordPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Ganti Password
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola keamanan akun dan perbarui kata sandi Anda.
        </p>
      </div>

      <ChangePasswordView />
    </main>
  );
}
