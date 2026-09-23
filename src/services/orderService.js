import api from "./api";

export async function createOrder(data) {
  const response = await api.post(
    "/orders",
    data
  );

  return response.data;
}

export async function getOrders() {
  const response = await api.get(
    "/orders"
  );

  return response.data;
}

export async function getOrder(id) {
  const response = await api.get(
    `/orders/${id}`
  );

  return response.data;
}