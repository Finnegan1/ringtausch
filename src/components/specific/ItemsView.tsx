import { ItemSearchTable } from "./ItemSearchTable";

export interface ItemsViewProps {
  data: ItemAPIResponse;
  refreshData: () => void;
}

export interface ItemAPIResponse {
  items: SearchItemProps[];
  postalCodes: string[];
}

export interface SearchItemProps {
  id: number;
  name: string;
  description: string;
  pictures: string[];
  owner: {
    postalCode: string;
  };
}

export function SearchItemsView({ data }: ItemsViewProps) {
  return (
    <div className="mt-16">
      <hr />
      <h1 className="mb-10 mt-16 font-bold">
        Suchergebnisse
        {data.postalCodes.length > 1 && (
          <span className="font-normal">
            {" "}
            &middot; Erweiterte Nachbarschaft ({data.postalCodes.join(", ")})
          </span>
        )}
        {data.postalCodes.length === 1 && (
          <span className="font-normal">
            {" "}
            &middot; Unmittelbare Nachbarschaft ({data.postalCodes[0]})
          </span>
        )}
      </h1>
      {data.items.length > 0 && <ItemSearchTable data={data.items} />}
      {data.items.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          Es wurden keine Gegenstände gefunden, die deiner Suche entsprechen.
        </p>
      )}
    </div>
  );
}
