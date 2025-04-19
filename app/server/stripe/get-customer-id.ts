import { db } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";
import "server-only"

export async function getOrCreateCustomer(userId: string, userEmail: string) {
    try {
        const useRef = db.collection("users").doc(userId);
        const userDoc = await useRef.get();

        if (!userDoc.exists) {
            throw new Error("User not found");
        }

        const stripeCustomerId = userDoc.data()?.stripeCustomerId;

        if (stripeCustomerId) {
            return stripeCustomerId;
        }

        const userName = userDoc.data()?.name;

        const stripeCustomer = await stripe.customers.create({
            email: userEmail,
            ...(userName && { name: userName }),
            metadata: {
                userId,
            },
        })

        await useRef.update({
            stripeCustomerId: stripeCustomer.id,
        })

        return stripeCustomer.id;

    } catch (error) {
        console.error("Error getting user document:", error);
        throw new Error("Internal server error");
    }
}