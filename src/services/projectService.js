import api from "./api";

// Public — featured projects (home page)
export async function getFeaturedProjects() {
  const res = await api.get("/projects/featured");
  return res.data;
}

// Public — single project (details page)
export async function getProject(id) {
  const res = await api.get(`/projects/${id}`);
  return res.data;
}

// Admin — all projects
export async function getAllProjects() {
  const res = await api.get("/projects");
  return res.data;
}

// Admin — create project (FormData — images सह)
export async function createProject(formData) {
  const res = await api.post("/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Admin — update project (JSON — images नाही)
export async function updateProject(id, data) {
  const res = await api.put(`/projects/${id}`, data);
  return res.data;
}

// Admin — delete project
export async function deleteProject(id) {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
}