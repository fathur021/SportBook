"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Explore", href: "/explore" },
  { title: "MyBooking", href: "/mybooking" },
  { title: "List Your Venue", href: "/list-your-venue" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Buka menu navigasi"
            aria-expanded={open}
          >
            <MenuIcon />
          </Button>
        }
      />

      <PopoverContent align="start" className="w-56 p-2">
        <nav className="flex flex-col" aria-label="Navigasi utama">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium",
                "text-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </PopoverContent>
    </Popover>
  );
}
