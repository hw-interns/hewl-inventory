import React, { useState } from "react";
import { useSession } from "next-auth/react";
import InventoryService from "@/services/InventoryServices";
import ItemProps from "@/data/item-props";

const EditItemForm = ({
  item,
  onClose,
  onItemUpdated,
  allTags,
}: {
  item: ItemProps;
  onClose: () => void;
  onItemUpdated: () => void;
  allTags: string[];
}) => {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(item.quantity);
  const [minQuantity, setMinQuantity] = useState(item.min_quantity);
  const [location, setLocation] = useState(item.location);
  const [tags, setTags] = useState(item.tags);
  const initialTagsArray =
    typeof item.tags === "string"
      ? item.tags.split(";")
      : Array.isArray(item.tags)
      ? item.tags
      : [];
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTagsArray);
  const [newTag, setNewTag] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (quantity < minQuantity) {
      const confirmUpdate = window.confirm(
        `Updating the quantity to ${quantity} will fall below the minimum quantity of ${minQuantity}. Do you want to proceed and trigger an email notification?`
      );
      if (!confirmUpdate) {
        return;
      }
    }

    try {
      await InventoryService.updateSupply(
        Number(item.id),
        quantity,
        minQuantity,
        location,
        tags,
        session?.user?.name as string
      );
      onClose();
      onItemUpdated();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const addNewTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
    }
    setNewTag("");
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{item.name}</h2>
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
            className="my-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
    </>
  );
};

export default EditItemForm;
