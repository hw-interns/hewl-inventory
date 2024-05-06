import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import InventoryService from "@/services/InventoryServices";

interface InventoryFormProps {
  onClose: () => void;
  onItemAdded: () => void;
}

const InventoryForm = ({ onClose, onItemAdded }: InventoryFormProps) => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [minQuantity, setMinQuantity] = useState<number>(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("department", department);
    formData.append("quantity", quantity.toString());
    formData.append("min_quantity", minQuantity.toString());
    formData.append("user", session?.user?.name as string);

    try {
      const response = await InventoryService.addSupply(formData);
      console.log("Supply added:", response.data);
      onClose();
      onItemAdded();
    } catch (error) {
      console.error("Error adding supply:", error);
    }
  };
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Add Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="itemName"
            className="block text-sm font-medium text-gray-700"
          >
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item Name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label
            htmlFor="itemLocation"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="itemLocation"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label
            htmlFor="itemDepartment"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <input
            type="text"
            id="itemDepartment"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="itemQuantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label
            htmlFor="min_quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Minimum Quantity
          </label>
          <input
            type="number"
            id="min_quantity"
            name="min_quantity"
            value={minQuantity}
            onChange={(e) => setMinQuantity(Number(e.target.value))}
            placeholder="Minimum Quantity"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default InventoryForm;
