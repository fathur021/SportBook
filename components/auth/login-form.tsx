"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { ArrowRightIcon } from "lucide-react";

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

function LoginForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        className="h-11 w-full text-sm font-semibold"
      >
        Masuk
        <ArrowRightIcon className="size-4" />
      </Button>

      <AuthDivider label="atau" />

      <GoogleButton />
    </form>
  );
}

export { LoginForm };