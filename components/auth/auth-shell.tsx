import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-4 py-10 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center"
      >
        <div className="h-64 w-[42rem] max-w-full rounded-full bg-emerald-100/70 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-sm flex-col">
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-2"
        >
          <Image
            src="/logo.png"
            alt="SportBook"
            width={256}
            height={256}
            priority
            className="h-11 w-auto object-contain"
          />
          <span className="bg-linear-to-r from-[#059669] to-[#047857] bg-clip-text text-[22px] font-semibold leading-none text-transparent">
            Sportbook
          </span>
        </Link>

        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold tracking-[0.18em] text-emerald-700 uppercase">
            Sportbook Account
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-8">{children}</div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      </div>
    </div>
  );
}