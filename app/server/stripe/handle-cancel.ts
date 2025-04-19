import { db } from "@/app/lib/firebase";
import "server-only"
import Stripe from "stripe";

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
    const metadata = event.data.object.metadata;
            const userId = metadata?.userId;
    
            if(!userId) {
                console.error("User ID not found in metadata");
                return;
            }
    
            await db.collection("users").doc(userId).update({
                subscription: "inactive",
            })

}