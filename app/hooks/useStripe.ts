import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

export function useStripe() {
    const [stripe, setStripe] = useState<Stripe | null>(null);

    useEffect(() => {
        async function loadStripeAsync() {
            const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
            setStripe(stripeInstance);
        }

        loadStripeAsync();
    },[]);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function createPaymentStripCheckout( checkoutData: any) {
        if (!stripe) {
            throw new Error("Stripe not loaded");
        }

        try {
            const response = await fetch("/api/stripe/create-payment-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            });

            const data = await response.json();

            await stripe.redirectToCheckout({sessionId: data.id});

        } catch (error) {
            console.error("Error creating checkout session:", error);
        }
    }

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function createSubscriptionStripCheckout( checkoutData: any) {
        if (!stripe) {
            throw new Error("Stripe not loaded");
        }

        try {
            const response = await fetch("/api/stripe/create-subscription-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            });

            const data = await response.json();

            await stripe.redirectToCheckout({sessionId: data.id});

        } catch (error) {
            console.error("Error creating checkout session:", error);
        }
    }

    async function handleCreateStripPortalSession() {
        if (!stripe) {
            throw new Error("Stripe not loaded");
        }

        try {
            const response = await fetch("/api/stripe/create-portal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            window.location.href = data.url;

        } catch (error) {
            console.error("Error creating portal session:", error);
        }
    }

    return {
        createPaymentStripCheckout,
        createSubscriptionStripCheckout,
        handleCreateStripPortalSession
    }
}