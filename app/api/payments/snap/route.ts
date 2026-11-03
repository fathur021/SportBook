//route untuk midtrans snap
import { requireUser } from "@/modules/auth/auth.guard";
export async function POST(request:Request):Promise<Response>{
    try {
        const authorization = await requireUser(request);
        if(!authorization.ok){
            return Response.json({error:authorization.error},{status:authorization.status})
        }
        // 1. Baca body (boleh gagal/null — tidak masalah untuk test)
        const body = (await request.json().catch(()=> null)) as {amount?:number,} | null;
        // 2. Jumlah tagihan dari body, minimal 1000 (syarat Midtrans)
        const amount = Math.max(Number(body?.amount) || 10000, 1000);
        // 3. order ID harus unik - pakai timestamp agari tidak bentrok
        const orderId = `order-${Date.now()}`;

        // 4. minta token snap ke api midtrans
        const midtransResponse = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions",{
            method:"POST",
            headers:{
                Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
                "content-type":"application/json",
            },
            body: JSON.stringify({
                transaction_details:{
                    order_id:orderId,
                    gross_amount:amount,
                }
            })
        })
        // 5. Kalau Midtrans menolak (401/400), teruskan isi errornya biar gampang debug
        if(!midtransResponse.ok){
            const text = await midtransResponse.text();
            return Response.json({ error: text }, { status: midtransResponse.status });
        }
        //6 Ambil token & Redirect url ke response client
        const snap = (await midtransResponse.json()) as {token:string,redirect_url:string};
        //7 Kirim token ke frontend - ini di pakai di windows snap.pay(token)
        return Response.json(
            {data:{token:snap.token, redirectUrl:snap.redirect_url}},
            {status:201}
        )
    } catch (error) {
        console.error("Gagal membuat transaksi snap:", error);
        return Response.json(
            { error: "Gagal membuat transaksi snap" },
            { status: 500 },
        );
    }
}