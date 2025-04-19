import mpClient, { validatedMercadoPagoWebhook } from "@/app/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";
import { Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        validatedMercadoPagoWebhook(req);

        const body = await req.json();

        const { type, data } = body;

        //webhook event types

        switch (type) {
            case "payment":
            const payment = new Payment(mpClient)
            const paymentData = await payment.get({ id: data.id });

            if(paymentData.status === "approved" || paymentData.status !== null){
                await handleMercadoPagoPayment(paymentData);
            }
            break;
            case "subscription_preapproval":
                break
            default:
                console.log("Unknown event type:", type);
                break;
        }

        return NextResponse.json({
            received: true,
        },
        {status: 200
        });
    } catch (error) {
        console.error("Error in Mercado Pago webhook:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}