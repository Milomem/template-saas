import { auth } from "@/app/lib/auth";
import stripe from "@/app/lib/stripe";
import { getOrCreateCustomer } from "@/app/server/stripe/get-customer-id";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { testeId } = await req.json();

    const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

    if(!price) {
        return NextResponse.json("Price ID not found", { status: 500 });
    }

    const session = await auth()
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId || !userEmail) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }

    const customerId = await getOrCreateCustomer(userId, userEmail);

    const metadata = {
        testeId,
        price
    }

    try {
        const session = await stripe.checkout.sessions.create({
            metadata,
            mode: "subscription",
            line_items: [
                {
                    price,
                    quantity: 1,
                },
            ],
            payment_method_types: ["card"],
            success_url: `${req.headers.get("origin")}/success`,
            cancel_url: `${req.headers.get("origin")}/`,
            customer: customerId,
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