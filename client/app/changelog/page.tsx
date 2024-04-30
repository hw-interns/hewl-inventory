"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Login from "@/components/Login";
import { fetchChangeLog } from "@/services/InventoryServices";
import Link from "next/link";

const ChangeLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChangeLog = async () => {
      try {
        const data = await fetchChangeLog();
        setLogs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching changelog:", err);
        setLoading(false);
      }
    };

    getChangeLog();
  }, []);

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
            Change Log
          </h1>
          <div className="flex-grow"></div>
          <div className="shrink-0">
            <Login />
          </div>
        </div>
      </header>
      <div className="my-6 mx-auto px-4 max-w-4xl">
        <Link href="/">
          <button className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Inventory Page
          </button>
        </Link>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-green-500 border-opacity-50"></div>
          </div>
        ) : (
          <ul className="list-disc pl-5 space-y-3 bg-white shadow overflow-hidden rounded-lg p-4">
            {logs.map((log: any) => (
              <li key={log.id} className="text-gray-700">
                <strong>{log.user || "Unknown"}</strong> {log.action}
                {/* {new Date(log.timestamp).toLocaleString()} */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ChangeLog;
