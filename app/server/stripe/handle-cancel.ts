import { db } from "@/app/lib/firebase";
import "server-only"
import Stripe from "stripe";

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
    const customerId = event.data.object.customer;

    const user = await db.collection("users").where("stripeCustomerId", "==", customerId).get();

    if (user.empty) {
        console.error("User not found");
        return;
    }

    const userId = user.docs[0].id;

    await db.collection("users").doc(userId).update({
        subscription: "inactive",
    });

}