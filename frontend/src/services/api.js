import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function fetchProducts(params) {
  const res = await api.get("/api/products", { params });
  return res.data;
}

export async function createProduct(formData) {
  const res = await api.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

