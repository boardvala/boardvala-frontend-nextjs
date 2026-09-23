import api from "./api";


export async function getAdminDashboardStat() {
  const response = await api.get("/admin/dashboard-stats");

  return response.data;
}

export async function getRegisteredUsers() {
  const response = await api.get("/admin/Registered-users");

  return response.data;
}