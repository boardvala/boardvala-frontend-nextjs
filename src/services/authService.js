import api from "./api";

export async function loginUser(data){

    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;

}

export async function registerUser(data){

    const response = await api.post(
        "/users/register",
        data
    );

    return response.data;

}

export async function changePassword(data) {
  const response = await api.put(
    "/auth/change-password", // ← तुमच्या route नुसार बदला
    data, // { oldPassword, newPassword }
  );
 
  return response.data;
}

export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}
 
export async function resetPassword(token, newPassword) {
  const response = await api.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
}