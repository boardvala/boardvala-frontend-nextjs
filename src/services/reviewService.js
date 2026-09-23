import api from "./api";

// Create Review
export async function createReview(data) {
  const response = await api.post("/reviews", data);

  return response.data;
}

// Get Product Reviews
export async function getProductReviews(productId) {
  const response = await api.get(`/reviews/product/${productId}`);

  return response.data;
}

// Get Gallery Reviews
export async function getGalleryReviews(galleryId) {
  const response = await api.get(`/reviews/gallery/${galleryId}`);

  return response.data;
}

export async function getFeaturedProductReviews(featuredProductId) {
  const response = await api.get(
    `/reviews/featured-product/${featuredProductId}`,
  );

  return response.data;
}

// Delete Review (Admin)
export async function deleteReview(id) {
  const response = await api.delete(`/reviews/${id}`);

  return response.data;
}
