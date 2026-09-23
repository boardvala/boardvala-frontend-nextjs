import api from "./api";

export async function checkDeliveryByPincode(pincode) {
  const res = await api.get(`/delivery/check?pincode=${pincode}`);
  return res.data;
}