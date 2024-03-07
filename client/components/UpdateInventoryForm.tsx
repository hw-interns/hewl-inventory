import React, { useState } from "react";
import InventoryService from "@/services/InventoryServices";
import ItemProps from "@/data/item-props";

const EditItemForm = ({
  item,
  onClose,
  onItemUpdated,
}: {
  item: ItemProps;
  onClose: () => void;
  onItemUpdated: () => void;
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [minQuantity, setMinQuantity] = useState(item.min_quantity);
  const [location, setLocation] = useState(item.location);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await InventoryService.updateItemDetails(Number(item.id), {
        quantity,
        minQuantity,
        location,
      });
      onClose();
      onItemUpdated();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity:
        </label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="minQuantity"
          className="block text-sm font-medium text-gray-700"
        >
          Minimum Quantity:
        </label>
        <input
          id="minQuantity"
          type="number"
          value={minQuantity}
          onChange={(e) => setMinQuantity(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location:
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Item
      </button>
    </form>
  );
};

export default EditItemForm;
