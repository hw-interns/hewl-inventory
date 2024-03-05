import React, { useState } from "react";
import InventoryService from "@/services/InventoryServices";
import ItemProps from "@/data/item-props";

interface UpdateInventoryFormProps {
  item: ItemProps;
  onClose: () => void;
  onItemUpdated: () => void;
  user: string; // You'll need to pass the user information to this form
}

const UpdateInventoryForm = ({
  item,
  onClose,
  onItemUpdated,
  user,
}: UpdateInventoryFormProps) => {
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Calculate the change in quantity
    const quantityChange = quantity - item.quantity;

    try {
      const response = await InventoryService.updateSupply(
        item.id,
        quantityChange,
        user
      );
      console.log("Supply updated:", response.data);
      onClose();
      onItemUpdated();
    } catch (error) {
      console.error("Error updating supply:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... other form fields ... */}

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

      <div className="text-right">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default UpdateInventoryForm;
