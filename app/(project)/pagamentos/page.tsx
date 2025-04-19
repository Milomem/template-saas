"use client"

import useMercadoPago from "@/app/hooks/useMercadoPago"
import { useStripe } from "@/app/hooks/useStripe"

export default function Pagamentos() {
    const { 
        createPaymentStripCheckout, 
        createSubscriptionStripCheckout, 
        handleCreateStripPortalSession
    } = useStripe()

    const { createMercadoPagoCheckout } = useMercadoPago()

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Pagamentos</h1>
            <button onClick={() => createPaymentStripCheckout({
                testeId:'123'
            })} className="bg-blue-500 text-white px-4 py-2 rounded">
                Criar Checkout
            </button>
            <button onClick={() => createSubscriptionStripCheckout({
                testeId:'123'
            })} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                Criar Checkout Subscription
            </button>
            <button onClick={handleCreateStripPortalSession} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">
                Criar Portal
            </button>
            <button onClick={() => createMercadoPagoCheckout({ testeId:'123', userEmail: "teste@teste.com"})} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">
                Criar pagamento mercado pago
            </button>
        </div>
    )
}