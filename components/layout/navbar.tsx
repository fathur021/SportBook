import Image from "next/image";
import Link from "next/link";
import { BellIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "cn";

const links = [
  { title: "Home", href: "/" },
  { title: "Explore", href: "/explore" },
  { title: "MyBooking", href: "/mybooking" },
];

const rightLinks = [{ title: "List Your Venue", href: "/list-your-venue" }];

const authLinks = [
  { title: "Masuk", href: "/login", variant: "outline" as const },
  { title: "Register", href: "/register", variant: "brand" as const },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center gap-2">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "h-auto gap-2 px-2")}
        >
          <Image
            src="/logo.png"
            alt="SportBook"
            width={256}
            height={256}
            priority
            className="h-10 w-auto object-contain lg:h-12"
          />
          <span className="bg-linear-to-r from-[#059669] to-[#047857] bg-clip-text text-[22px] font-semibold leading-none text-transparent drop-shadow-[0_1px_2px_rgba(4,120,87,0.35)]">
            Sportbook
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex lg:gap-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "px-2 text-base font-medium"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:gap-1.5">
          {rightLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden px-2.5 text-base font-medium lg:inline-flex"
              )}
            >
              {item.title}
            </Link>
          ))}

          <Button variant="ghost" size="icon-sm" aria-label="Notifikasi">
            <BellIcon />
          </Button>

          <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-border" />

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
        </div>
      </Container>
    </header>
  );
}
