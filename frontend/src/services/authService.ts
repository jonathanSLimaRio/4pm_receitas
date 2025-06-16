import axios from "axios";

const API_URL = "http://localhost:3000";

export function loginUser(data: { login: string; password: string }) {
  return axios.post(`${API_URL}/login`, data);
}

export function registerUser(data: { name: string; login: string; password: string }) {
  return axios.post(`${API_URL}/register`, data);
}
