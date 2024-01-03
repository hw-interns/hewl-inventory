import React from "react";
import { useState } from "react";
import InventoryService from "@/services/InventoryServices";

interface InventoryFormProps {
  onClose: () => void;
}

const InventoryForm = ({ onClose }: InventoryFormProps) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("department", department);
    formData.append("quantity", quantity.toString());
    formData.append("minQuantity", minQuantity.toString());
    formData.append("file", file);

    try {
      const response = await InventoryService.addSupply(formData);
      console.log("Supply added:", response.data);
      onClose();
    } catch (error) {
      console.error("Error adding supply:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Item Name Input */}
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

      {/* Other input fields for location, department, quantity, minQuantity */}
      {/* Location Input */}
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

      {/* Department Input */}
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

      {/* Quantity Input */}
      <div>
        <label
          htmlFor="itemQuantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <input
          type="number"
          id="itemQuantity"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Quantity"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>

      {/* Minimum Quantity Input */}
      <div>
        <label
          htmlFor="minQuantity"
          className="block text-sm font-medium text-gray-700"
        >
          Minimum Quantity
        </label>
        <input
          type="number"
          id="minQuantity"
          name="minQuantity"
          value={minQuantity}
          onChange={(e) => setMinQuantity(Number(e.target.value))}
          placeholder="Minimum Quantity"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>

      {/* Image Upload Input */}
      <div>
        <label
          htmlFor="fileUpload"
          className="block text-sm font-medium text-gray-700"
        >
          Image Upload
        </label>
        <input
          type="file"
          id="fileUpload"
          name="file"
          onChange={handleFileChange}
          className="mt-1 block w-full"
          required
        />
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
