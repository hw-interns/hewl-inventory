"use client";

import React, { useState } from "react";
import InventoryService from "@/services/InventoryServices"; // Adjust the import path as necessary

const TestInventoryAPI = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(false);

  const testAPIHandler = async () => {
    try {
      const response = await InventoryService.testAPI();
      console.log("Test API Response:", response.data);
    } catch (error) {
      console.error("Test API Error:", error);
    }
  };

  const fetchSuppliesHandler = async () => {
    setLoading(true);
    try {
      const data = await InventoryService.getSupplies();
      setSupplies(data.data);
      console.log(data.data); // For debugging
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addSupplyHandler = async () => {
    const formData = new FormData();
    // Assume we're adding a supply item. Adjust with actual data fields
    formData.append("name", "New Supply");
    formData.append("quantity", "100");
    // Add other fields as necessary

    try {
      const response = await InventoryService.addSupply(formData);
      console.log(response.data); // For debugging
      fetchSuppliesHandler(); // Refresh the supplies list
    } catch (error) {
      console.error(error);
    }
  };

  const updateSupplyHandler = async () => {
    const id = 1; // Assuming an ID of a supply to update
    const quantityChange = 5; // Example change
    const user = "Test User"; // Example user

    try {
      const response = await InventoryService.updateSupply(
        id,
        quantityChange,
        user
      );
      console.log(response.data); // For debugging
      fetchSuppliesHandler(); // Refresh the supplies list
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSupplyHandler = async () => {
    const id = 1; // Assuming an ID of a supply to delete

    try {
      const response = await InventoryService.deleteSupply(id);
      console.log(response.data); // For debugging
      fetchSuppliesHandler(); // Refresh the supplies list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={fetchSuppliesHandler} disabled={loading}>
        {loading ? "Loading..." : "Fetch Supplies"}
      </button>
      <button onClick={testAPIHandler}>Test API</button>
      <button onClick={addSupplyHandler}>Add Supply</button>
      <button onClick={updateSupplyHandler}>Update Supply</button>
      <button onClick={deleteSupplyHandler}>Delete Supply</button>

      <div>
        {supplies.map((supply: any, index) => (
          <div key={index}>
            <p>
              {supply.name}: {supply.quantity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestInventoryAPI;
