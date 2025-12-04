import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";
const API = `${API_BASE}/purchases`;

export default {
  getAll: async () => (await axios.get(API)).data,
  getById: async (id) => (await axios.get(`${API}/${id}`)).data,
  create: async (data) => (await axios.post(API, data)).data,
  update: async (id, data) => (await axios.put(`${API}/${id}`, data)).data,
  remove: async (id) => (await axios.delete(`${API}/${id}`)).data,
};
