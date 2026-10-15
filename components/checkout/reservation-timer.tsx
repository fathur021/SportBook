"use client";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DEFAULT_TOTAL_MS = 10 * 60 * 1000;
const formatClock = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const second = String(total % 60).padStart(2, "0");
  return `${minutes}:${second}`;
};

type ReservationTimerProps = {
  expiresAt: number;
  totalMs?: number;
  onExpire?: () => void;
};

export function ReservationTimer({
  expiresAt,
  totalMs = DEFAULT_TOTAL_MS,
  onExpire,
}: ReservationTimerProps) {
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    hasExpiredRef.current = false;
    let timer: number;

    const tick = () => {
      const next = Math.max(0, expiresAt - Date.now());
      setRemainingMs(next);

      if (next > 0) {
        timer = window.setTimeout(tick, 1000);
      } else if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire?.(); //
      }
    };
    tick();
    const onVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [expiresAt, onExpire]);

  const isExpired = remainingMs <= 0;
  const isUrgent = remainingMs <= 2 * 60 * 1000;
  const isAlert = isExpired || isUrgent;
  const progress = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));

  return (
    <div
      className={`rounded-xl border p-4 ${
        isAlert ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={`flex items-center gap-2 text-sm font-semibold ${
            isAlert ? "text-red-700" : "text-emerald-800"
          }`}
        >
          <Clock className="size-4" />
          {isExpired ? "Waktu Habis" : "Slot ditahan untuk kamu"}
        </span>
        <span
          className={`font-mono text-lg font-bold ${
            isAlert ? "text-red-600" : "text-emerald-800"
          }`}
        >
          {formatClock(remainingMs)}
        </span>
      </div>
      <div
        className={`mt-2 h-1.5 w-full overflow-hidden rounded-full ${
          isAlert ? "bg-red-100" : "bg-emerald-100"
        }`}
      >
        <div
          className={`h-full transition-all ${
            isAlert ? "bg-red-500" : "bg-emerald-700"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p
        className={`mt-2 text-xs ${
          isAlert ? "text-red-700" : "text-emerald-700"
        }`}
      >
        Selesaikan pembayaran sebelum waktu habis, kalau tidak slot otomatis
        dilepas.
      </p>
    </div>
  );
}
