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
      <Modal show={isModalOpen} onClose={handleCloseModal}>
        {editItem ? (
          <EditItemForm
            item={editItem}
            onClose={() => {
              setEditItem(undefined);
              handleCloseModal();
            }}
            onItemUpdated={() => {
              setEditItem(undefined);
              handleItemAdded();
            }}
          />
        ) : (
          <InventoryForm
            onClose={handleCloseModal}
            onItemAdded={handleItemAdded}
          />
        )}
      </Modal>
      ;
      <div className="flex justify-center my-6">
        <input className="border p-4 w-1/2" placeholder="Search" />
      </div>
      <div className="container mx-auto px-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {inventoryItems.map((item) => (
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
