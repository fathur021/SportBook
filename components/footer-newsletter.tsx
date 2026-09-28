"use client";

import * as React from "react";
import { CheckIcon, MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FooterNewsletter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  if (subscribed) {
    return (
      <p className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
        <CheckIcon className="mt-0.5 shrink-0" />
        <span>
          Terima kasih! Promo & slot prime-time mingguan akan kami kirim ke{" "}
          <span className="font-medium text-emerald-200">{email}</span>.
        </span>
      </p>
    );
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSubscribed(true);
      }}
    >
      <div className="space-y-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@anda.com"
          aria-label="Alamat email untuk promo mingguan"
          className="h-9 border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/40"
        />
        <Button type="submit" variant="brand" className="h-9 w-full">
          Subscribe
        </Button>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <MailIcon className="size-3.5" />
        Promo mingguan, tanpa spam, berhenti kapan saja.
      </p>
    </form>
  );
}
