import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk — Sportbook",
  description:
    "Masuk ke akun Sportbook untuk mengelola booking lapangan olahragamu.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Selamat datang kembali"
      description="Masuk untuk melihat jadwal, booking lapangan, dan riwayat pertandinganmu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
          >
            Daftar sekarang
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
