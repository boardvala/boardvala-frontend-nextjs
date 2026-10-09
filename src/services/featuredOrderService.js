import api from "./api";

// user: featured product order तयार करा
export async function createFeaturedOrder(data) {
  const response = await api.post("/featured-orders", data);
  return response.data;
}

// admin: सगळ्या featured orders
export async function getAllFeaturedOrders() {
  const response = await api.get("/featured-orders");
  return response.data;
}

// admin: एक order
export async function getFeaturedOrderById(id) {
  const response = await api.get(`/featured-orders/${id}`);
  return response.data;
}

// admin: status बदला
export async function updateFeaturedOrderStatus(id, status) {
  const response = await api.put(`/featured-orders/${id}/status`, { status });
  return response.data;
}


// user: माझे सगळे featured orders
export async function getMyFeaturedOrders() {
  const response = await api.get("/featured-orders/my/orders");
  return response.data;
}

// user: माझा एक featured order
export async function getMyFeaturedOrderById(id) {
  const response = await api.get(`/featured-orders/my/orders/${id}`);
  return response.data;
}

//order tracking
// export async function getFeaturedOrderTracking(id) {
//   const res = await api.get(`/featured-orders/${id}/tracking`);
//   return res.data;
// }

// export async function getAdminFeaturedOrderTracking(id) {
//   const res = await api.get(`/featured-orders/${id}/admin-tracking`);
//   return res.data;
// }

// Admin — update envia shipping
export async function updateFeaturedOrderShipping(id, data) {
  const res = await api.put(`/featured-orders/${id}/shipping`, data);
  return res.data;
}

// Track shipment (Envia)
export async function trackFeaturedOrder(id) {
  const res = await api.get(`/featured-orders/${id}/track`);
  return res.data;
}