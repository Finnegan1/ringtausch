"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { LendingRequestsTable, MyLendings } from "@/components/specific/LendingRequestsTable";
import { Messages } from "@/constants/messages";

export default function MeineVerleihungen() {
  const [activeTab, setActiveTab] = useQueryState<"pending" | "inProcess" | "finished">("tab", {
    defaultValue: "pending",
    parse: (value) => value as "pending" | "inProcess" | "finished",
  });
  const [data, setData] = useState<MyLendings[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/my-lendings/get-my-lendings?filter=${activeTab}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(Messages.ERROR_FETCH_DATA);
      }
      const json = await response.json();
      setData(json);
    } catch {
      setError(Messages.ERROR_TRY_AGAIN_LATER);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="mx-10 mt-6">
      <h1 className="mb-4 text-2xl font-bold">Meine Verleihungen</h1>
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`rounded px-4 py-2 ${
            activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          disabled={activeTab === "pending" || loading}
        >
          Anfragen
        </button>
        <button
          onClick={() => setActiveTab("inProcess")}
          className={`rounded px-4 py-2 ${
            activeTab === "inProcess" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          disabled={activeTab === "inProcess" || loading}
        >
          Verliehen
        </button>
        <button
          onClick={() => setActiveTab("finished")}
          className={`rounded px-4 py-2 ${
            activeTab === "finished" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          disabled={activeTab === "finished" || loading}
        >
          Abgeschlossen
        </button>
      </div>

      {loading && <div>Warte auf Antwort...</div>}
      {error && <div className="text-red-500">Fehler: {error}</div>}
      {data && <LendingRequestsTable data={data} refreshData={fetchData} />}
    </div>
  );
}
