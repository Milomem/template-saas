import mpClient from "@/app/lib/mercado-pago";
import { Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");
    const testerId = searchParams.get("external_reference");

    if (!paymentId || !testerId) {
        return new Response("Missing payment_id or external_reference", { status: 400 });
    }

    const payment = new Payment(mpClient)

    const paymentData = await payment.get({ id: paymentId});

    if (paymentData.status === "approved" || paymentData.status !== null ) {
        return NextResponse.redirect(new URL(`success`, req.url));
    }

    return NextResponse.redirect(new URL(`/`, req.url));

}