import Image from "next/image";
import Link from "next/link";
import { BellIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavbarAuth } from "@/components/layout/navbar-auth";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const links = [
  { title: "Home", href: "/" },
  { title: "Explore", href: "/explore" },
  { title: "MyBooking", href: "/mybooking" },
];

const rightLinks = [{ title: "List Your Venue", href: "/list-your-venue" }];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center gap-1 sm:gap-2">
        <div className="lg:hidden">
          <MobileNav />
        </div>

        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "h-auto gap-2 px-1 sm:px-2")}
        >
          <Image
            src="/logo.png"
            alt="SportBook"
            width={256}
            height={256}
            priority
            className="h-8 w-auto object-contain sm:h-10 lg:h-12"
          />
          <span className="hidden bg-linear-to-r from-[#059669] to-[#047857] bg-clip-text text-lg font-semibold leading-none text-transparent drop-shadow-[0_1px_2px_rgba(4,120,87,0.35)] sm:inline sm:text-[22px]">
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

          <NavbarAuth />
        </div>
      </Container>
    </header>
  );
}
