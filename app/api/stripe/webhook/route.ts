import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    try {
        
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get("Stripe-Signature");

    if( !secret || !signature) {
        return new Response("Webhook secret or signature not found", { status: 400 });
    }

       const event = stripe.webhooks.constructEvent(body, signature, secret);

       switch (event.type) {
           case "checkout.session.completed":
                const metadata = event.data.object.metadata;
                if(metadata?.price === process.env.STRIPE_PRICE_ID) {
                    await handleStripePayment(event)
                }

                if(metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
                    await handleStripeSubscription(event)
                }

               break;
            case "checkout.session.expired":
                console.log("Session expired");
               break;
            case "checkout.session.async_payment_succeeded":
                console.log("Payment succeeded");
                break;
            case "checkout.session.async_payment_failed":
                console.log("Payment failed");
                break;
            case "customer.subscription.created":
                console.log("Subscription created");
                break;
           case "customer.subscription.updated":
                console.log("Subscription updated");
                break;
           case "customer.subscription.deleted":
                await handleStripeCancelSubscription(event);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
            break;
       }
         return new Response("Webhook received", { status: 200 });
    } catch (error) {
        console.error("Error in webhook:", error);
    }
    
}