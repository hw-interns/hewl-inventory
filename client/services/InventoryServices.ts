import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSupplies = async () => {
  try {
    const response = await axios.get(`${API_URL}/supplies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching supplies:", error);
    throw error;
  }
};

const testAPI = async () => {
  return axios.get(`${API_URL}/test`);
};

const getSupplies = async () => {
  return axios.get(`${API_URL}/supplies`);
};

const addSupply = async (formData: FormData) => {
  return axios.post(`${API_URL}/add`, formData);
};

const updateSupply = async (
  id: number,
  quantityChange: number,
  user: string
) => {
  return axios.post(`${API_URL}/update`, {
    id,
    quantity_change: quantityChange,
    user,
  });
};

const deleteSupply = async (id: number) => {
  return axios.post(`${API_URL}/delete`, { id });
};

const clearTable = async () => {
  return axios.delete(`${API_URL}/clear`);
};

const InventoryService = {
  getSupplies,
  addSupply,
  updateSupply,
  deleteSupply,
  clearTable,
  testAPI,
};

export default InventoryService;
