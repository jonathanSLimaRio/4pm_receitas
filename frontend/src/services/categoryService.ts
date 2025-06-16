import axios from "axios";

// const API_URL = `${process.env.VITE_API_URL}`;
const API_URL = "http://localhost:3000/categories";


function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAllCategories() {
  return (await axios.get(API_URL, { headers: getAuthHeaders() })).data;
}

export async function getCategoryById(id: number) {
  return (await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() }))
    .data;
}

export async function createCategory(data: { name: string }) {
  return (await axios.post(API_URL, data, { headers: getAuthHeaders() })).data;
}

export async function updateCategory(id: number, data: { name: string }) {
  return (
    await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() })
  ).data;
}

export async function deleteCategory(id: number) {
  return await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
}
