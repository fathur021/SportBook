"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRightIcon } from "lucide-react";

import { AuthDivider, GoogleButton } from "@/components/auth/auth-social";
import {
  AuthField,
  authCheckboxClass,
  authInputClass,
} from "@/components/auth/auth-field";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      console.error("Login gagal:", authError);
      setError(
        authError.status === 401
          ? "Email atau password salah."
          : (authError.message ?? "Gagal login, coba lagi."),
      );
      setLoading(false);
      return; // berhenti di sini saat gagal
    }
    setLoading(false);

    // Cek role dulu sebelum menghormati ?next=
    // ?next= hanya dihormati kalau user ADMIN — agar tidak terjadi putaran tak berujung:
    // user biasa → /admin (layout lempar ke /login) → login sukses → /admin → dst.
    const { data: session } = await authClient.getSession();
    const isAdmin = Boolean(
      session?.user && "role" in session.user && session.user.role === "ADMIN",
    );

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    if (isAdmin && next && next.startsWith("/") && next !== "/login") {
      // ?next= harus path internal (mulai dari "/") — cegah redirect ke situs luar
      router.push(next);
    } else if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      <AuthField label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          required
          className={authInputClass}
        />
      </AuthField>

      <AuthField label="Password" htmlFor="password">
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Masukkan password"
          required
        />
      </AuthField>

      <div className="flex items-center justify-between gap-3">
        <Label className="gap-2 font-normal text-muted-foreground">
          <Checkbox name="remember" className={authCheckboxClass} />
          Ingat saya
        </Label>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
        >
          Lupa password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="brand"
        disabled={loading}
        className="h-11 w-full text-sm font-semibold"
      >
        {loading ? "Memproses..." : "Masuk"} 
        <ArrowRightIcon className="size-4" />
      </Button>

      <AuthDivider label="atau" />

      <GoogleButton />
    </form>
  );
}

export { LoginForm };
