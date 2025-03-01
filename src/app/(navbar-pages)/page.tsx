"use client";

import { useState } from "react";

import { ItemAPIResponse, ItemsView } from "@/components/specific/ItemsView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Messages } from "@/constants/messages";

interface SearchFilters {
  name: string;
  neighborhood: "direct" | "extended";
}

export default function MyHomePage() {
  const [data, setData] = useState<ItemAPIResponse>({ items: [], postalCodes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterInput, setFilterInput] = useState<string>("");
  const [extendedSearch, setExtendedSearch] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchFilters: SearchFilters = {
        name: filterInput,
        neighborhood: extendedSearch ? "extended" : "direct",
      };
      const urlParams = new URLSearchParams(searchFilters as unknown as Record<string, string>);
      const response = await fetch(`/api/search-items?${urlParams.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await response.json();
      setData(json);
    } catch {
      setError(Messages.ERROR_TRY_AGAIN_LATER);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-10 mt-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="mb-8 mt-4">
        Suche nach Gegenständen, die du ausleihen kannst und frage deine Nachbarn, ob die
        Leihgegenstände verfügbar sind.
      </p>
      <div className="mb-4 flex space-x-4">
        <Input
          placeholder="Suchbegriff..."
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          className="max-w-sm"
        />
        <div className="mb-4 flex space-x-4">
          <Button onClick={() => fetchData()} disabled={loading}>
            Suchen
          </Button>
        </div>
        <Toggle
          variant="outline"
          pressed={extendedSearch}
          onPressedChange={(value) => setExtendedSearch(value)}
        >
          {extendedSearch ? "✓ " : "✕ "}
          Suche ausweiten
        </Toggle>
      </div>

      {loading && <div>Warte auf Antwort...</div>}
      {error && <div className="text-red-500">Fehler: {error}</div>}
      {data && <ItemsView data={data} refreshData={fetchData} />}
    </div>
  );
}
