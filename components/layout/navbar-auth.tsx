"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const authLinks = [
  { title: "Masuk", href: "/login", variant: "outline" as const },
  { title: "Register", href: "/register", variant: "brand" as const },
];

export function NavbarAuth() {
  const router = useRouter();
  // Hook Better Auth: otomatis cek sesi via /api/auth/get-session
  const { data: session, isPending, error } = authClient.useSession();

  // Sesi masih diambil → placeholder, biar navbar tidak melompat
  if (error || isPending) {
    return <div className="h-9 w-32" aria-hidden="true" />;
  }

  // Belum login → tombol Masuk & Register seperti biasa
  if (!session) {
    return (
      <>
        {authLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: item.variant }),
              "px-2.5 text-sm font-semibold lg:px-3"
            )}
          >
            {item.title}
          </Link>
        ))}
      </>
    );
  }

  const handleLogout = async () => {
    await authClient.signOut(); // hapus sesi di server + cookie
    router.push("/");
    router.refresh(); // supaya navbar ikut segar kembali
  };

  // Sudah login → avatar + nama (+ badge Admin) + tombol keluar
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
        {session.user.name.slice(0, 2).toUpperCase()}
      </span>
      <span className="hidden text-sm font-semibold sm:inline">
        {session.user.name}
      </span>
      {(session.user as { role?: string }).role === "ADMIN" && (
        <span className="rounded border border-emerald-200/60 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
          Admin
        </span>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Keluar"
        onClick={handleLogout}
      >
        <LogOutIcon />
      </Button>
    </div>
  );
}
