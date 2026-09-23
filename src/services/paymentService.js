import api from "./api";

export async function createPaymentOrder(payload) {
  const response = await api.post("/payment/create-order", payload);
  return response.data;
}

export async function verifyPayment(paymentData) {
  const response = await api.post(
    "/payment/verify",
    paymentData
  );

  return response.data;
}