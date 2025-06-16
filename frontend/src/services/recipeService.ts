import axios from "axios";

const API_URL = "http://localhost:3000/recipes";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAllRecipes() {
  return (await axios.get(API_URL, { headers: getAuthHeaders() })).data;
}

export async function createRecipe(data: any) {
  return (await axios.post(API_URL, data, { headers: getAuthHeaders() })).data;
}

export async function updateRecipe(data: any) {
  return (await axios.put(`${API_URL}/${data.id}`, data, { headers: getAuthHeaders() })).data;
}

export async function deleteRecipeById(id: number) {
  return await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
}
