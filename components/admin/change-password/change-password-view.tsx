"use client";

import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";

import { AuthField } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ChangePasswordView() {
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmError(null);
    setError(null);
    setSuccess(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") ?? "");
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setConfirmError("Password baru dan konfirmasi belum sama.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Gagal mengganti password.");
        return;
      }

      setSuccess("Password berhasil diubah. Perangkat lain telah logout.");
      form.reset();
    } catch {
      setError("Jaringan gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setConfirmError(null);
    setError(null);
    setSuccess(null);
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white py-0 shadow-sm ring-0">
      <CardHeader className="flex flex-row items-start gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <KeyRound className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Keamanan Akun
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Perbarui password akun admin Anda secara berkala.
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-5 py-5">
          <AuthField label="Password Saat Ini" htmlFor="currentPassword">
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              autoComplete="current-password"
              placeholder="Masukkan password saat ini"
              required
            />
          </AuthField>

          <AuthField
            label="Password Baru"
            htmlFor="newPassword"
            hint="Minimal 8 karakter."
          >
            <PasswordInput
              id="newPassword"
              name="newPassword"
              autoComplete="new-password"
              placeholder="Buat password baru"
              minLength={8}
              required
            />
          </AuthField>

          <AuthField
            label="Konfirmasi Password Baru"
            htmlFor="confirmPassword"
            error={confirmError ?? undefined}
          >
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Ulangi password baru"
              minLength={8}
              required
              onChange={() => setConfirmError(null)}
            />
          </AuthField>

          {error ? (
            <p
              className="text-xs font-medium text-red-600"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {success ? (
            <p
              className="text-xs font-medium text-emerald-700"
              role="status"
            >
              {success}
            </p>
          ) : null}

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
            <p className="text-xs leading-relaxed text-amber-800">
              Password akan diperbarui lewat Better Auth. Sesi di perangkat
              lain akan dicabut demi keamanan.
            </p>
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <Button
            type="reset"
            variant="outline"
            className="h-9 px-4"
            onClick={handleReset}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="h-9 px-4"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
