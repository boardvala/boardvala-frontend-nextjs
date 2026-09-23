import api from "./api";

// admin: नवीन featured product (FormData — images सह)
export async function createFeaturedProduct(data) {
  const response = await api.post("/featured-products", data);
  return response.data;
}

// list (category / activeOnly filter ऐच्छिक)
export async function getFeaturedProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/featured-products?${query}` : "/featured-products";
  const response = await api.get(url);
  return response.data;
}

// एक product
export async function getFeaturedProduct(id) {
  const response = await api.get(`/featured-products/${id}`);
  return response.data;
}

// admin: update (टप्पा १ — details + price, plain JSON)
export async function updateFeaturedProduct(id, data) {
  const response = await api.put(`/featured-products/${id}`, data);
  return response.data;
}

// admin: add images to existing featured product
export async function addFeaturedProductImages(id, files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post(
    `/featured-products/${id}/images`,
    formData
  );

  return response.data;
}

// admin: delete one image
export async function deleteFeaturedProductImage(id, imageId) {
  const response = await api.delete(
    `/featured-products/${id}/images/${imageId}`
  );

  return response.data;
}

// admin: delete
export async function deleteFeaturedProduct(id) {
  const response = await api.delete(`/featured-products/${id}`);
  return response.data;
}