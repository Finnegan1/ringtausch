"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { BorrowRequestsTable, MyBorrows } from "../../../components/specific/BorrowRequestsTable";

export default function MyBorrowRequests() {
  const [activeTab, setActiveTab] = useQueryState<"pending" | "inProcess" | "finished">("tab", {
    defaultValue: "pending",
    parse: (value) => value as "pending" | "inProcess" | "finished",
  });
  const [data, setData] = useState<MyBorrows[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/my-borrows/get-my-borrows?filter=${activeTab}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await response.json();
      setData(json);
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="mx-10 mt-6">
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`rounded px-4 py-2 ${
            activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          disabled={activeTab === "pending" || loading}
        >
          Angefragt
        </button>
        <button
          onClick={() => setActiveTab("inProcess")}
          className={`rounded px-4 py-2 ${
            activeTab === "inProcess" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          disabled={activeTab === "inProcess" || loading}
        >
          Ausgeliehen
        </button>
        <button
          onClick={() => setActiveTab("finished")}
          className={`rounded px-4 py-2 ${
            activeTab === "finished" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          disabled={activeTab === "finished" || loading}
        >
          Zurückgegeben
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <BorrowRequestsTable data={data} refreshData={fetchData} />}
    </div>
  );
}
