import api from "./api";

export async function createGalleryDesign(data) {
  const response = await api.post("/gallery", data);

  return response.data;
}

export async function getGalleryDesigns(category) {
  const url = category
    ? `/gallery?category=${category}`
    : "/gallery";

  const response = await api.get(url);

  return response.data;
}

export async function getGalleryDesign(id) {
  const response = await api.get(`/gallery/${id}`);

  return response.data;
}

export async function deleteGalleryDesign(id) {
  const response = await api.delete(`/gallery/${id}`);

  return response.data;
}

export async function getSimilarGalleryDesigns(id) {
  const response = await api.get(`/gallery/${id}/similar`);

  return response.data;
}


export async function updateGalleryDesign(id, data) {
  const response = await api.put(`/gallery/${id}`, data);

  return response.data;
}

export async function addGalleryDesignImages(id, files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post(`/gallery/${id}/images`, formData);

  return response.data;
}

export async function deleteGalleryDesignImage(id, imageId) {
  const response = await api.delete(
    `/gallery/${id}/images/${imageId}`,
  );

  return response.data;
}