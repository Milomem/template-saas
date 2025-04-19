import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export function handleMercadoPagoPayment(paymentData: PaymentResponse) {
    const metadata = paymentData.metadata
    const userEmail = metadata?.user_email
    const testeId = metadata?.teste_id
}