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

const updateItemDetails = async (
  id: number,
  {
    quantity,
    minQuantity,
    location,
  }: { quantity: number; minQuantity: number; location: string }
) => {
  return axios.post(`${API_URL}/update`, {
    id,
    quantity,
    min_quantity: minQuantity,
    location,
  });
};

const updateSupply = async (
  id: number,
  quantity: number,
  min_quantity: number,
  location: string
) => {
  return axios.post(`${API_URL}/update`, {
    id,
    quantity: quantity,
    min_quantity: min_quantity,
    location,
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
  updateItemDetails,
  updateSupply,
  deleteSupply,
  clearTable,
  testAPI,
};

export default InventoryService;
