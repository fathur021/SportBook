"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRightIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";
import { AuthDivider, GoogleButton } from "@/components/auth/auth-social";
import {
  AuthField,
  authCheckboxClass,
  authInputClass,
} from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RegisterForm() {
  const router = useRouter();
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleConfirmChange(event: ChangeEvent<HTMLInputElement>) {
    if (confirmError && event.target.value) setConfirmError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmPassword") ?? "");

    if (password !== confirmation) {
      setConfirmError("Password tidak cocok, coba periksa lagi.");
      return;
    }

    setConfirmError(null);

    setLoading(true);

    const {error:authError} = await authClient.signUp.email({
      name,email,password
    })
    if(authError){
      console.error("Registrasi Gagal:",authError);
      setError(authError.message ?? "Gagal membuat akun, coba lagi.");
      setLoading(false);
      return;
    }
    setLoading(false);
    const {data:session} = await authClient.getSession();
    if(session){
      router.push("/");
      router.refresh();
    }else{
      router.push("/login");
    }
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
      <AuthField label="Nama lengkap" htmlFor="name">
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Nama kamu"
          required
          className={authInputClass}
        />
      </AuthField>

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

      <AuthField
        label="Password"
        htmlFor="password"
        hint="Minimal 8 karakter."
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Buat password"
          minLength={8}
          required
        />
      </AuthField>

      <AuthField
        label="Konfirmasi password"
        htmlFor="confirmPassword"
        error={confirmError ?? undefined}
      >
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Ulangi password"
          minLength={8}
          required
          aria-invalid={confirmError ? true : undefined}
          onChange={handleConfirmChange}
        />
      </AuthField>

      <Label className="items-start gap-2 font-normal">
        <Checkbox
          name="terms"
          required
          className={`mt-0.5 ${authCheckboxClass}`}
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          Saya menyetujui{" "}
          <Link
            href="/legal/terms"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Syarat & Ketentuan
          </Link>{" "}
          dan{" "}
          <Link
            href="/legal/privacy"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Kebijakan Privasi
          </Link>
          .
        </span>
      </Label>

      <Button
        type="submit"
        variant="brand"
        className="h-11 w-full text-sm font-semibold"
        disabled={loading} 
      >
        {loading ? "Memproses..." : "Buat akun"}
        <ArrowRightIcon className="size-4" />
      </Button>

      <AuthDivider label="atau" />

      <GoogleButton />
    </form>
  );
}

export { RegisterForm };