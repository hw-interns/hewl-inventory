"use client";

import Image from "next/image";
import InventoryItem from "@/components/InventoryItem";
import Modal from "@/components/Modal";
import InventoryForm from "@/components/InventoryForm";
import EditItemForm from "@/components/UpdateInventoryForm";
import { fetchSupplies } from "@/services/InventoryServices";
import { useState, useEffect } from "react";
import ItemProps from "@/data/item-props";
import Login from "@/components/Login";

const Home = () => {
  const [inventoryItems, setInventoryItems] = useState<ItemProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ItemProps>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("alphabetical");

  let sortedItems = [...inventoryItems];

  useEffect(() => {
    const loadSupplies = async () => {
      try {
        const supplies = await fetchSupplies();
        setInventoryItems(supplies);
      } catch (error) {
        console.error(error);
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

  const filteredItems = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let sortedAndFilteredItems = [...filteredItems];

  if (filter === "alphabetical") {
    sortedAndFilteredItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filter === "location") {
    sortedAndFilteredItems.sort((a, b) => a.location.localeCompare(b.location));
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
      <div className="flex justify-center mt-12">
        <button
          onClick={handleAddItem}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Item
        </button>
      </div>
      <div className="flex justify-center my-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="alphabetical">Alphabetical</option>
          <option value="location">Location</option>
        </select>
      </div>
      <div className="flex justify-center my-6">
        <input
          className="border p-4 w-1/2 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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

      <div className="container mx-auto px-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedAndFilteredItems.map((item) => (
            <InventoryItem
              key={item.id}
              item={item}
              onEdit={() => handleEditItem(item)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
