import api from "./api";

export async function createPricing(data) {
  const response = await api.post("/pricing", data);

  return response.data;
}

export async function getAllPricing() {
  const response = await api.get("/pricing");
  return response.data;
}

export async function getPricingByMaterial(material) {
  const response = await api.get(`/pricing/${material}`);
  return response.data;
}

export async function updatePricing(material, framePrices) {
  const response = await api.put(`/pricing/${material}`, {
    framePrices,
  });

  return response.data;
}

//new service for creating material and size
export async function createMaterial(material, pricingType = "fixed") {
  const response = await api.post("/pricing/material", { material, pricingType });
  return response.data;
}

export async function deleteMaterial(material) {
  const res = await api.delete(`/pricing/material/${material}`);

  return res.data;
}

export async function addFrameSize(material, data) {
  const res = await api.post(
    `/pricing/${material}/frame`,
    data
  );

  return res.data;
}

export async function deleteFrameSize(material, frameSize) {
  const res = await api.delete(
    `/pricing/${material}/frame/${encodeURIComponent(frameSize)}`
  );

  return res.data;
}

export async function updateFrameSize(
  material,
  frameSize,
  data
) {
  const response = await api.put(
    `/pricing/${material}/frame/${frameSize}`,
    data
  );

  return response.data;
}

export async function updateBannerSettings(material, settings) {
  const response = await api.put(
    `/pricing/${material}/banner-settings`,
    settings,
  );
  return response.data;
}