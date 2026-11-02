"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format-rupiah";
import {
  Lock,
  Zap,
  Wallet,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Check,
} from "lucide-react";

// Memperkaya tipe global: setelah script Midtrans dimuat, window.snap tersedia di browser
declare global {
  interface Window {
    snap?: { pay: (token: string, opts?: object) => void };
  }
}

interface PaymentMethodCardProps {
  venueName?: string;
  grandTotal?: number;
  bookingId: string;
}

export function PaymentMethodCard({
  venueName = "Gelora Padel",
  grandTotal = 495000,
  bookingId,
}: PaymentMethodCardProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("qris");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  // status "sedang memproses" supaya tombol tidak bisa bisa di-double-click
  const [paying, setPaying] = useState<boolean>(false);
  // // Fungsi saat Pay Now diklik
  // const handlePayNow = () => {
  //   const orderId = `SPB-${Date.now().toString().slice(-6)}`;
  //   const query = new URLSearchParams(searchParams.toString());
  //   query.set("order_id", orderId);
  //   query.set("method", selectedMethod);

  //   // Pindah ke halaman checkout success
  //   router.push(`/checkout/success?${query.toString()}`);
  // };

  const handlePayNow = async () => {
    try {
      setPaying(true); // nyalakan loading
      //1.Panggil endpoint server kita
      const res = await fetch(`/bookings/${bookingId}/pay`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      //2. ambil json dari response
      const json = (await res.json()) as {
        data?: { paymentId: string; token: string };
        error?: string;
      };
      
        // Kalau gagal → tampilkan error dari server
      if (!res.ok || !json.data?.token) {
        alert(json.error ?? "Gagal memulai pembayaran");
        return;
      }

      //4. Ambil fungsi snap.pay dari objek global (script dimuat di checkout/page.tsx)
      // Buka popup Midtrans Snap
      const snapPay = window.snap?.pay;
      if (typeof snapPay !== "function") {
        alert("Halaman pembayaran belum siap, coba lagi");
        return;
      }
      snapPay.call(window.snap, json.data.token, {
        onSuccess: (result: unknown) => {
          console.log("Pembayaran sukses", result);
          // Redirect ke success page dengan paymentId
          router.push(`/checkout/success?paymentId=${json.data!.paymentId}`);
        },
        onPending: (result: unknown) => {
          console.log("Menunggu pembayaran", result);
          router.push(`/checkout/success?paymentId=${json.data!.paymentId}`);
        },
        onError: (error: unknown) => {
          console.error("Pembayaran error", error);
        },
      });
    } finally {
      setPaying(false); // matikan loading lagi (di kasus popup, popup tetap terbuka)
    }
  };
  return (
    <div className="flex flex-col gap-6">
      {/* KARTU 1: SELECT PAYMENT METHOD */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        {/* Header: Step 2 & Instant Confirmation */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
              2
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Select Payment Method
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Instant Confirmation
          </span>
        </div>

        {/* Daftar Metode Pembayaran */}
        <div className="mt-5 space-y-3">
          {/* OPTION 1: QRIS Instant (Selected & Expanded by default) */}
          <div
            onClick={() => setSelectedMethod("qris")}
            className={`rounded-2xl border p-4 transition-all cursor-pointer ${
              selectedMethod === "qris"
                ? "border-sky-200 bg-sky-50/30"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Radio Button */}
                <div className="mt-0.5 shrink-0">
                  {selectedMethod === "qris" ? (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-600 bg-white">
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      QRIS Instant
                    </span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                      ZERO FEE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    GoPay, OVO, Dana, BCA Mobile, ShopeePay & any banking app
                  </p>
                </div>
              </div>

              {/* Right Badges */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  QRIS
                </span>
                <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200/60">
                  LIVE
                </span>
              </div>
            </div>

            {/* EXPANDED PREVIEW KETIKA QRIS DIPILIH */}
            {selectedMethod === "qris" && (
              <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* QR Box */}
                  <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 shrink-0">
                    <svg
                      className="h-20 w-20 text-slate-900"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                    >
                      {/* Corner Outer Box 1 */}
                      <rect
                        x="5"
                        y="5"
                        width="28"
                        height="28"
                        rx="4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                      />
                      <rect
                        x="13"
                        y="13"
                        width="12"
                        height="12"
                        rx="2"
                        fill="currentColor"
                      />
                      {/* Corner Outer Box 2 */}
                      <rect
                        x="67"
                        y="5"
                        width="28"
                        height="28"
                        rx="4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                      />
                      <rect
                        x="75"
                        y="13"
                        width="12"
                        height="12"
                        rx="2"
                        fill="currentColor"
                      />
                      {/* Corner Outer Box 3 */}
                      <rect
                        x="5"
                        y="67"
                        width="28"
                        height="28"
                        rx="4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                      />
                      <rect
                        x="13"
                        y="75"
                        width="12"
                        height="12"
                        rx="2"
                        fill="currentColor"
                      />
                      {/* Center & Accent Pattern Bits */}
                      <rect
                        x="42"
                        y="10"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="42"
                        y="24"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="54"
                        y="17"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="10"
                        y="42"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="24"
                        y="42"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="17"
                        y="54"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="42"
                        y="42"
                        width="16"
                        height="16"
                        rx="2"
                        fill="currentColor"
                      />
                      <rect
                        x="67"
                        y="42"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="82"
                        y="42"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="42"
                        y="67"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="42"
                        y="82"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="67"
                        y="67"
                        width="24"
                        height="24"
                        rx="3"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-[10px] font-medium text-slate-400 mt-1">
                      Scan to preview
                    </span>
                  </div>

                  {/* QR Explanation & Apps */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Zap className="h-3.5 w-3.5 fill-teal-500 text-teal-600" />
                      <span>Dynamic QR generated on checkout</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      The high-definition transaction QR will update with your
                      order total and court slot lock. Auto-detects payment in 3
                      seconds.
                    </p>

                    {/* Supported Apps Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {["GoPay", "OVO", "Dana", "BCA Mobile"].map((app) => (
                        <span
                          key={app}
                          className="rounded-md border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OPTION 2: Virtual Account (Bank Transfer) */}
          <div
            onClick={() => setSelectedMethod("va")}
            className={`flex items-center justify-between rounded-xl border p-4 transition-all cursor-pointer ${
              selectedMethod === "va"
                ? "border-sky-200 bg-sky-50/30"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {selectedMethod === "va" ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-600 bg-white">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900">
                  Virtual Account (Bank Transfer)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instant auto-check: BCA, Mandiri, BNI, BRI, Permata
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="rounded bg-sky-50 border border-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                BCA
              </span>
              <span className="rounded bg-sky-50 border border-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                BNI
              </span>
              <span className="rounded bg-sky-50 border border-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                MANDIRI
              </span>
            </div>
          </div>

          {/* OPTION 3: Direct E-Wallet */}
          <div
            onClick={() => setSelectedMethod("ewallet")}
            className={`flex items-center justify-between rounded-xl border p-4 transition-all cursor-pointer ${
              selectedMethod === "ewallet"
                ? "border-sky-200 bg-sky-50/30"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {selectedMethod === "ewallet" ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-600 bg-white">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900">
                  Direct E-Wallet
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  ShopeePay, OVO Quick Checkout, GoPay Token
                </p>
              </div>
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500">
              <Wallet className="h-4 w-4" />
            </div>
          </div>

          {/* OPTION 4: Credit / Debit Card */}
          <div
            onClick={() => setSelectedMethod("card")}
            className={`flex items-center justify-between rounded-xl border p-4 transition-all cursor-pointer ${
              selectedMethod === "card"
                ? "border-sky-200 bg-sky-50/30"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {selectedMethod === "card" ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-600 bg-white">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900">
                  Credit / Debit Card
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visa, Mastercard, JCB with 3D Secure Verification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="rounded bg-sky-50 border border-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                VISA
              </span>
              <span className="rounded bg-sky-50 border border-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                MC
              </span>
            </div>
          </div>

          {/* OPTION 5: Manual Bank Transfer */}
          <div
            onClick={() => setSelectedMethod("manual")}
            className={`flex items-center justify-between rounded-xl border p-4 transition-all cursor-pointer ${
              selectedMethod === "manual"
                ? "border-sky-200 bg-sky-50/30"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {selectedMethod === "manual" ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-600 bg-white">
                    <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900">
                  Manual Bank Transfer
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receipt upload required, verified within 15 minutes
                </p>
              </div>
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Card>

      {/* KARTU 2: TERMS, PAY BUTTON & TRUST BADGES */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        {/* Checkbox Terms of Service */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setAgreeTerms(!agreeTerms)}
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer ${
              agreeTerms
                ? "bg-emerald-700 border-emerald-700 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {agreeTerms && <Check className="h-3 w-3 stroke-[3]" />}
          </button>
          <p className="text-xs text-slate-600 leading-relaxed">
            I agree to the{" "}
            <a
              href="#"
              className="font-semibold text-emerald-700 hover:underline"
            >
              SportBook Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-semibold text-emerald-700 hover:underline"
            >
              {venueName} venue rules
            </a>{" "}
            (free cancellation with full refund up to 12h before match start).
          </p>
        </div>

        {/* Big Pay Now Button */}
        <button
          type="button"
          disabled={paying || !agreeTerms}
          onClick={handlePayNow}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-[#03624c] hover:bg-[#02523f] active:scale-[0.99] py-3.5 px-6 text-base font-bold text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Lock className="h-4 w-4" />
          <span>
            {paying
              ? "Menyiapkan pembayaran..."
              : `Pay Now • ${formatRupiah(grandTotal)}`}
          </span>
        </button>

        {/* Trust Badges Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Bank Indonesia Licensed</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
            <span>Instant Refund Guarantee</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
