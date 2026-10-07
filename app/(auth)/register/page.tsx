import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar — Sportbook",
  description:
    "Buat akun Sportbook dan booking lapangan padel, badminton, futsal, atau tenis dalam hitungan detik.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Buat akun Sportbook"
      description="Gratis selamanya — jelajahi 500+ venue dan booking lapangan favoritmu lebih cepat."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
          >
            Masuk
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
