import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AppleIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  GlobeIcon,
  PlayIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { FooterNewsletter } from "@/components/footer-newsletter";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/sportbook.id",
    paths: [
      "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    ],
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@sportbook.id",
    paths: [
      "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    ],
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@sportbook",
    paths: [
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    ],
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/sportbook",
    paths: [
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
    ],
  },
  {
    label: "X",
    href: "https://x.com/sportbook",
    paths: [
      "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
    ],
  },
];

const sportLinks = [
  { title: "Sewa Lapangan Padel", href: "/explore?sport=padel" },
  { title: "Lapangan Badminton", href: "/explore?sport=badminton" },
  { title: "Arena Futsal", href: "/explore?sport=futsal" },
  { title: "Lapangan Tenis", href: "/explore?sport=tenis" },
  { title: "Lapangan Basket", href: "/explore?sport=basket" },
  { title: "Mini Soccer", href: "/explore?sport=mini-soccer" },
];

const partnerLinks = [
  { title: "Daftarkan Venue Anda", href: "/list-your-venue" },
  { title: "SportBook OS", href: "/partner/sportbook-os" },
  { title: "Panduan Mitra & Pricing", href: "/partner/guide" },
  { title: "Mitra Komunitas & Turnamen", href: "/partner/community" },
];

const companyLinks = [
  { title: "Tentang SportBook", href: "/about" },
  { title: "Pusat Bantuan (FAQ & Support 24/7)", href: "/help" },
  { title: "Syarat & Ketentuan Pemesanan", href: "/legal/terms" },
  { title: "Kebijakan Privasi", href: "/legal/privacy" },
  { title: "Pembatalan & Refund", href: "/legal/refund" },
];

const paymentMethods = [
  "QRIS",
  "BCA",
  "Mandiri",
  "GoPay",
  "OVO",
  "Visa",
  "Mastercard",
];

const languages = { id: "Bahasa Indonesia", en: "English" };
const currencies = { IDR: "IDR", USD: "USD" };

function FooterHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`font-heading text-sm font-semibold tracking-wide text-white ${className ?? ""}`}
    >
      {children}
    </h3>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { title: string; href: string }[];
}) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm leading-relaxed text-slate-400 transition-colors hover:text-emerald-400"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0B132B] text-slate-400">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="SportBook"
                width={256}
                height={256}
                className="size-9 object-contain"
              />
              <span className="font-heading text-lg font-semibold text-white">
                Sportbook
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Platform pemesanan venue olahraga premier untuk booking lapangan
              padel, badminton, futsal, dan tenis secara instan dan transparan.
            </p>

            <ul className="mt-5 flex items-center gap-2">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid size-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-4"
                    >
                      {social.paths.map((path) => (
                        <path key={path} d={path} />
                      ))}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="h-6 gap-1.5 border-white/10 bg-white/5 px-2.5 text-slate-300"
              >
                <ShieldCheckIcon className="text-emerald-400" />
                SSL 256-bit
              </Badge>
              <Badge
                variant="outline"
                className="h-6 gap-1.5 border-white/10 bg-white/5 px-2.5 text-slate-300"
              >
                <BadgeCheckIcon className="text-emerald-400" />
                Payment Gateway Terverifikasi
              </Badge>
            </div>
          </div>

          <FooterColumn title="Eksplorasi Olahraga" items={sportLinks} />

          <FooterColumn
            title="Untuk Mitra & Pengelola Lapangan"
            items={partnerLinks}
          />

          <FooterColumn title="Perusahaan & Bantuan" items={companyLinks} />

          <div>
            <FooterHeading>Promo Mingguan</FooterHeading>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Promo & slot prime-time mingguan langsung ke email kamu.
            </p>
            <div className="mt-4">
              <FooterNewsletter />
            </div>

            <FooterHeading className="mt-8 ">Aplikasi Mobile</FooterHeading>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300">
                <AppleIcon className="text-emerald-400" />
                App Store
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300">
                <PlayIcon className="text-emerald-400" />
                Google Play
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="h-px w-full bg-[#1E293B]" />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">
            &copy;  2026 SportBook Technologies Indonesia. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <li key={method}>
                <Badge
                  variant="outline"
                  className="h-7 border-white/10 bg-white/5 px-3 text-slate-400"
                >
                  {method}
                </Badge>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Select items={languages} defaultValue="id">
              <SelectTrigger
                size="sm"
                aria-label="Pilih bahasa"
                className="h-9 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              >
                <GlobeIcon className="text-emerald-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>

            <Select items={currencies} defaultValue="IDR">
              <SelectTrigger
                size="sm"
                aria-label="Pilih mata uang"
                className="h-9 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              >
                <CreditCardIcon className="text-emerald-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR">IDR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </footer>
  );
}
