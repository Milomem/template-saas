import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth()
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }

    try {
        const useRef = db.collection("users").doc(userId);
        const userDoc = await useRef.get();

        if(!userDoc.exists) {
            return NextResponse.json("User not found", { status: 404 });
        }

        const customerId = userDoc.data()?.stripeCustomerId;

        if (!customerId) {
            return NextResponse.json("Customer not found", { status: 404 });
        }

        console.log("Customer ID:", customerId);

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.headers.get("origin")}/dashboard`,
        });


        if (!portalSession.url) {
            return NextResponse.json("Session not created", { status: 500 });
        }

        return NextResponse.json({ url: portalSession.url }, { status: 200 });
    }
    catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}