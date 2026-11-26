import Link from "next/link";
import { ArrowRight, CircleCheck, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

const benefits = [
  "Zero Setup Fees",
  "Auto WhatsApp Reminders",
  "Real-time Financial Payouts",
];

export function OwnerCta() {
  return (
    <section className="py-10">
      <Container>
        <div className="flex flex-col gap-8 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white shadow-lg sm:p-8 md:flex-row md:items-center md:justify-between md:p-10">
          {/* Kiri: teks */}
          <div className="flex max-w-2xl flex-col items-start gap-4">
            <span className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
              <Store className="size-3.5" />
              SportBook Venue Operating System
            </span>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Are you a sports venue owner?
              </h2>
              <p className="text-sm text-slate-300">
                Digitize your courts, eliminate painful double bookings,
                automate slot payments, and grow facility occupancy rates with
                SportBook Manager.
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs">
                  <CircleCheck className="size-4 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Kanan: tombol */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              nativeButton={false}
              render={
                <Link href="/owner/register">
                  List Your Venue
                  <ArrowRight className="size-4" />
                </Link>
              }
              className="w-full bg-emerald-700 hover:bg-emerald-600 sm:w-auto"
            />
            <Button
              nativeButton={false}
              variant="ghost"
              render={<Link href="/owner/demo">Schedule Demo</Link>}
              className="w-full bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
