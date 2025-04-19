import mpClient from "@/app/lib/mercado-pago";
import { Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const { testeId, userEmail } = await req.json();

    try {
    const preference = new Preference(mpClient);

    const createPreference = await preference.create({
        body:{
            external_reference: testeId,
            metadata:{
                testeId
            },
            items: [
                {
                    id: testeId,
                    title: "Test Item",
                    description: "Description of the test item",
                    quantity: 1,
                    currency_id: "BRL",
                    unit_price: 1,
                },
            ],

            payment_methods: {
                installments: 12,
                excluded_payment_methods: [
                    {
                        id: "bolbradesco",
                    },
                    {
                        id: "ticket",
                    },
                ]
            },
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercado-pago/pending`,
                failure: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercado-pago/pending`,
                pending: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercado-pago/pending`,
            },
            auto_return: "approved",

            ...(userEmail && {
                payer: {
                    email: userEmail,
                },
            }),
        }
    })

    if (!createPreference.id) {
        return new Response("Failed to create preference", { status: 500 });
    }
    
    return NextResponse.json({
        preferenceId: createPreference.id,
        initPoint: createPreference.init_point,
    })

    } catch (error) {
        console.error("Error creating Mercado Pago preference:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}