import { requireUser } from "@/modules/auth/auth.guard";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { bookingId: string } },
): Promise<Response> {
  try {
    //1 wajib login
    const auth = await requireUser(request);
    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }
    const { bookingId } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: { select: { email: true } } },
    });

    if(!booking || booking.userId !== auth.user.id){
        return Response.json({ error: "Booking tidak bisa dibayar" }, { status: 409 });
    }
    // 6. Kalau pernah dibayar SUKSES, jangan boleh ikut transaksi lagi
    //    (unique bookingId = 1 payment per booking, tapi dapat saja di-retry)
    const existing = await prisma.payment.findUnique({where:{bookingId:booking.id}});
    if(existing?.status === "PAID"){
      return Response.json(
        {error: "Payment sudah ditemukan, buatkan booking dari baru"}
      );
    }
    //7 order midtrans
    const orderCode = `PAY-${booking.orderCode}-${Date.now()}`
    //8 Minta token snap ke midtrans
    const midtransRes = await  fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",{
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_details:{
            order_id:orderCode,
            gross_amount:booking.totalPrice
          },
          customer_details:{
            email:booking.user.email
          }
        })
      }
    )
    // 9. Midtrans menolak? (401 key salah / 400 body salah)
    //    PENTING: tidak membuat Payment record — karena token tidak dapat
    if (!midtransRes.ok) {
      const text = await midtransRes.text();
      console.error("Midtrans error:", text);
      return Response.json(
        { error: "Gagal membuat transaksi pembayaran" },
        { status: 502 },
      );
    }
    // 10. Ambil token & redirect_url
    const snap = (await midtransRes.json()) as { token: string; redirect_url: string };

     // 11. Simpan Payment ke database SEBELUM token dikirim ke user
    //     Kolom ini "anchor" webhook nanti: notifikasi cocok lewat orderCode
    //     upsert = kalau belum ada → create; sudah ada (retry yang lama) → update
    const payment = await prisma.payment.upsert({
       where: { bookingId: booking.id },
       create: {
        bookingId: booking.id,
        orderCode,
        amount: booking.totalPrice,
        snapToken: snap.token,
        snapUrl: snap.redirect_url,
       },
       update: {
        orderCode,
        amount: booking.totalPrice,
        snapToken: snap.token,
        snapUrl: snap.redirect_url,
       },
    })
     // 12. Kirim token ke frontend → yang akan dipanggil window.snap.pay(token)
    return Response.json(
      { data: { paymentId: payment.id, token: snap.token } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Gagal membuat payment:", error);
    return Response.json({ error: "Gagal membuat payment" }, { status: 500 });
  }
}
