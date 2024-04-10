import axios from "axios";
import ItemProps from "@/data/item-props";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSupplies = async () => {
  try {
    const response = await axios.get(`${API_URL}/supplies`);
    const suppliesWithTags = response.data.map(
      (item: ItemProps & { tags?: string[] }) => ({
        ...item,
        tags: item.tags || [],
      })
    );
    console.log(suppliesWithTags);
    return suppliesWithTags;
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
  quantity: number,
  min_quantity: number,
  location: string
) => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("quantity", quantity.toString());
  formData.append("min_quantity", min_quantity.toString());
  formData.append("location", location);

  try {
    const response = await axios.post(`${API_URL}/update`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update supply:", error);
    throw error;
  }
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
