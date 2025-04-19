import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { testeId, userEmail } = await req.json();

    const price = process.env.STRIPE_PRICE_ID;

    if(!price) {
        return NextResponse.json("Price ID not found", { status: 500 });
    }

    const metadata = {
        testeId,
        price
    }

    try {
        const session = await stripe.checkout.sessions.create({
            metadata,
            mode: "payment",
            line_items: [
                {
                    price,
                    quantity: 1,
                },
            ],
            payment_method_types: ["card", "boleto"],
            success_url: `${req.headers.get("origin")}/success`,
            cancel_url: `${req.headers.get("origin")}/`,
            ...(userEmail && { customer_email: userEmail }),
        });

        if (!session.url) {
            return NextResponse.json("Session not created", { status: 500 });
        }

        return NextResponse.json({sessionId: session.id}, { status: 200 });
    }
    catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}