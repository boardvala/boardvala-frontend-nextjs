import api from "./api";

export async function createCustomDesignOrder(payload) {
  const response = await api.post("/customDesign", payload);
  return response.data;
}

export async function getCustomDesignOrders() {
  const response = await api.get("/customDesign");

  return response.data;
}

export async function getCustomDesignOrder(id) {
  const response = await api.get(`/customDesign/${id}`);

  return response.data;
}

export async function updateCustomDesignStatus(id, status) {
  const response = await api.put(
    `/customDesign/${id}`,
    { status }
  );

  return response.data;
}

export async function getMyCustomDesignOrders() {
  const response = await api.get("/customDesign/my-orders");

  return response.data;
}

export async function getMyCustomDesignOrderById(id) {
  const response = await api.get(`/customDesign/my-orders/${id}`);

  return response.data;
}

//envia service api
export async function updateOrderShipping(id, data) {
  const res = await api.put(`/customDesign/${id}/shipping`, data);
  return res.data;
}

export async function trackOrderShipment(id) {
  const res = await api.get(`/customDesign/${id}/track`);
  return res.data;
}

//shiprockert service api
// export async function getOrderTracking(id) {
//   const res = await api.get(`/customDesign/${id}/tracking`);
//   return res.data;
// }

// export async function getAdminOrderTracking(id) {
//   const res = await api.get(`/customDesign/${id}/admin-tracking`);
//   return res.data;
// }