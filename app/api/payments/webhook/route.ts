import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Midtrans kirim POST ke URL ini setiap kali status pembayaran berubah
export async function POST(request: Request): Promise<Response> {
  try {
    // 1. Ambil body dari Midtrans
    //    Midtrans mengirim JSON berisi info transaksi
    const body = (await request.json()) as {
      order_id: string;
      status_code: string;
      gross_amount: string;
      signature_key: string;
      transaction_status: string;
      fraud_status?: string;
      payment_type?: string;
    };

    // 2. Verifikasi signature — pastikan request benar dari Midtrans
    //    Rumus: SHA512(order_id + status_code + gross_amount + serverKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(body.order_id + body.status_code + body.gross_amount + serverKey)
      .digest("hex");

    if (body.signature_key !== expectedSignature) {
      console.error("Webhook signature tidak cocok!");
      return Response.json({ error: "Invalid signature" }, { status: 403 });
    }

    // 3. Cari Payment berdasarkan orderCode
    //    orderCode di DB = order_id yang kita kirim ke Midtrans waktu create snap
    const payment = await prisma.payment.findUnique({
      where: { orderCode: body.order_id },
    });

    if (!payment) {
      // Payment tidak ditemukan — mungkin order_id salah atau sudah dihapus
      console.error("Payment tidak ditemukan:", body.order_id);
      return Response.json({ error: "Payment not found" }, { status: 404 });
    }

    const grossAmount = Number(body.gross_amount);
    if (Number.isNaN(grossAmount) || grossAmount !== payment.amount) {
      console.error(
        "Nominal tidak cocok!",
        body.order_id,
        "midtrans:",
        body.gross_amount,
        "db:",
        payment.amount,
      );
      return Response.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // 4. Kalau sudah PAID, jangan proses ulang
    if (payment.status === "PAID") {
      return Response.json({ message: "Already paid" });
    }

    // 5. Tentukan status berdasarkan transaction_status dari Midtrans
    //    Referensi: https://docs.midtrans.com/docs/https-notification-webhooks
    //
    //    "capture"  → pembayaran kartu kredit berhasil (cek fraud_status)
    //    "settlement" → pembayaran non-CC berhasil (QRIS, VA, e-wallet)
    //    "pending"  → menunggu pembayaran
    //    "deny"     → ditolak
    //    "expire"   → kadaluarsa
    //    "cancel"   → dibatalkan
    const txStatus = body.transaction_status;

    if (
      txStatus === "settlement" ||
      (txStatus === "capture" && body.fraud_status === "accept")
    ) {
      //  PEMBAYARAN BERHASIL → update Payment + Booking
      await prisma.$transaction([
        // Update Payment: status → PAID, catat waktu bayar & metode
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            method: body.payment_type ?? null,
            paidAt: new Date(),
          },
        }),
        // Update Booking: status → CONFIRMED
        prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: "CONFIRMED" },
        }),
      ]);

      console.log(" Payment berhasil:", body.order_id);
    } else if (
      txStatus === "expire" ||
      txStatus === "cancel" ||
      txStatus === "deny"
    ) {
      //  PEMBAYARAN GAGAL/EXPIRED → update Payment saja
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: txStatus.toUpperCase(), // "EXPIRE", "CANCEL", atau "DENY"
        },
      });

      console.log(" Payment gagal/expired:", body.order_id, txStatus);
    }
    // Kalau "pending" → biarkan, tidak perlu update apa-apa

    // 6. WAJIB balas 200 OK ke Midtrans
    //    Kalau tidak, Midtrans akan retry kirim notifikasi terus-terusan
    return Response.json({ message: "OK" });
  } catch (error) {
    console.error("Webhook error:", error);
    // Tetap balas 200 supaya Midtrans tidak retry terus
    // (error di sisi kita, bukan salah Midtrans)
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
