import { useRouter } from "next/navigation";

export default function useMercadoPago() {

    const router = useRouter()
    
    async function createMercadoPagoCheckout({
        testeId,
        userEmail,
    }: {
        testeId: string;
        userEmail: string;
    }) {
        try {
            const response = await fetch('/api/mercado-pago/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testeId,
                    userEmail,
                }),
            })

            const data = await response.json()

            router.push(data.init_point)


        } catch (error) {
            console.error('Error creating Mercado Pago Checkout:', error);
        }
       
        
    }

    return {createMercadoPagoCheckout};
}