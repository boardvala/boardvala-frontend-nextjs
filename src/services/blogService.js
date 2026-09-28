import api from "./api";

export async function getPublishedBlogs() {
  const res = await api.get("/blogs/published");
  return res.data;
}

export async function getBlogBySlug(slug) {
  const res = await api.get(`/blogs/slug/${slug}`);
  return res.data;
}

// Admin
export async function getAllBlogs() {
  const res = await api.get("/blogs");
  return res.data;
}

export async function getBlogById(id) {
  const res = await api.get(`/blogs/${id}`);
  return res.data;
}

export async function createBlog(data) {
  const res = await api.post("/blogs", data);
  return res.data;
}

export async function updateBlog(id, data) {
  const res = await api.put(`/blogs/${id}`, data);
  return res.data;
}

export async function deleteBlog(id) {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
}

export async function toggleBlogPublish(id) {
  const res = await api.patch(`/blogs/${id}/toggle-publish`);
  return res.data;
}