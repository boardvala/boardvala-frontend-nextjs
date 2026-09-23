import api from "./api";

// CREATE PRODUCT
export const createProduct = async (formData) => {
  const response = await api.post(
    "/admin/products",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// GET SINGLE PRODUCT
export const getProduct = async (id) => {
  const response = await api.get(
    `/admin/products/${id}`
  );

  return response.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id, formData) => {
  const response = await api.put(
    `/admin/products/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const response = await api.delete(
    `/admin/products/${id}`
  );

  return response.data;
};