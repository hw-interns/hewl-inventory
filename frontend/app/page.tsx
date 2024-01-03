"use client";

import Image from "next/image";
import InventoryItem from "@/components/InventoryItem";
import Modal from "@/components/Modal";
import InventoryForm from "@/components/InventoryForm";
import axios from "axios";
import { useState, useEffect, ReactEventHandler } from "react";
import ItemProps from "@/data/item-props";

const Home = () => {
  const [inventoryItems, setInventoryItems] = useState<ItemProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/supplies");
        console.log("response:", response);
        setInventoryItems(response.data);
      } catch (error) {
        console.error("Error fetching supplies:", error);
      }
    };

    fetchSupplies();
  }, []);

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="bg-white py-12 px-12 flex justify-between items-center">
        <div className="m-6 h-6">
          <Image
            src="/logo.png"
            alt="Health & Wellness Inventory Tracker"
            width={200}
            height={200}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
        <h1 className="font-bold text-lg md:text-2xl">
          Health & Wellness Inventory Tracker
        </h1>
        <button className="bg-blue-500 text-white py-2 px-4 rounded">
          Sign In
        </button>
      </header>
      <div className="flex justify-center my-6">
        <button
          onClick={handleAddItem}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Item
        </button>
      </div>
      <Modal show={isModalOpen} onClose={handleCloseModal}>
        <InventoryForm onClose={handleCloseModal} />
      </Modal>
      <div className="flex justify-center my-6">
        <input className="border p-4 w-1/2" placeholder="Search" />
      </div>
      <main className="container mx-auto px-8 mb-4">
        {inventoryItems.map((item) => (
          <InventoryItem key={item.id} item={item} />
        ))}
      </main>
    </>
  );
};

export default Home;
