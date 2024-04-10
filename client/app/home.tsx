"use client";

import Image from "next/image";
import InventoryItem from "@/components/InventoryItem";
import Modal from "@/components/Modal";
import InventoryForm from "@/components/InventoryForm";
import EditItemForm from "@/components/UpdateInventoryForm";
import { fetchSupplies } from "@/services/InventoryServices";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ItemProps from "@/data/item-props";
import Login from "@/components/Login";

const Home = () => {
  const [inventoryItems, setInventoryItems] = useState<ItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ItemProps>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("alphabetical");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data: session } = useSession();
  const allowedDomains = ["ucsb.edu", "sa.ucsb.edu", "umail.ucsb.edu"];

  useEffect(() => {
    const loadSupplies = async () => {
      try {
        setIsLoading(true);
        const supplies = await fetchSupplies();
        setInventoryItems(supplies);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupplies();
  }, []);

  const loadSupplies = async () => {
    try {
      const supplies = await fetchSupplies();
      setInventoryItems(supplies);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleItemAdded = () => {
    loadSupplies();
  };

  const handleEditItem = (item: ItemProps) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((currentTags) => {
      const isTagSelected = currentTags.includes(tag);
      if (isTagSelected) {
        return currentTags.filter((t) => t !== tag);
      } else {
        return [...currentTags, tag];
      }
    });
  };

  const allTags = inventoryItems.reduce<string[]>((acc, item) => {
    if (item.tags.length > 0) {
      const tagList = item.tags.split(";");
      tagList.forEach((tag: string) => {
        if (!acc.includes(tag.trim())) {
          acc.push(tag.trim());
        }
      });
    }
    return acc;
  }, []);

  const filteredItems = inventoryItems.filter((item) => {
    const itemTags = typeof item.tags === "string" ? item.tags.split(";") : [];
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedTags.length === 0 ||
        selectedTags.every((tag) => itemTags.includes(tag)))
    );
  });

  let sortedAndFilteredItems = [...filteredItems];

  if (filter === "alphabetical") {
    sortedAndFilteredItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filter === "location") {
    sortedAndFilteredItems.sort((a, b) => a.location.localeCompare(b.location));
  } else if (filter === "quantity") {
    sortedAndFilteredItems.sort((a, b) => a.quantity - b.quantity);
  }

  return (
    <>
      <header className="bg-gray-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
          <div className="shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={200}
              priority
            />
          </div>

          <div className="flex-grow"></div>

          <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
            Inventory Tracker
          </h1>

          <div className="flex-grow"></div>

          <div className="shrink-0">
            <Login />
          </div>
        </div>
      </header>
      <div className="flex justify-center my-6">
        <input
          className="border p-4 w-1/2 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex justify-center mt-12">
        <button
          onClick={handleAddItem}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Item
        </button>
      </div>
      <div className="flex justify-center my-4">
        <div className="border p-2 rounded-md">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="alphabetical">Alphabetical</option>
            <option value="quantity">Quantity</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 p-4">
        {allTags.map((tag, index) => (
          <span
            key={index}
            onClick={() => handleTagClick(tag)}
            className={`cursor-pointer ${
              selectedTags.includes(tag)
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-800"
            } text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}
          >
            {tag} ×
          </span>
        ))}
      </div>

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        {editItem ? (
          <EditItemForm
            item={editItem}
            onClose={handleCloseModal}
            onItemUpdated={handleItemAdded}
          />
        ) : (
          <InventoryForm
            onClose={handleCloseModal}
            onItemAdded={handleItemAdded}
          />
        )}
      </Modal>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-green-500 border-opacity-50"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sortedAndFilteredItems.map((item) => {
              const userDomain = session?.user?.email?.split("@")[1] ?? "";
              const canEdit = allowedDomains.includes(userDomain);
              return (
                <InventoryItem
                  key={item.id}
                  item={item}
                  onEdit={() => handleEditItem(item)}
                  onTagClick={handleTagClick}
                  canEdit={canEdit}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
