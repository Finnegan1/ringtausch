export interface ItemsViewProps {
  data: ItemAPIResponse;
  refreshData: () => void;
}

export interface ItemAPIResponse {
  items: ItemProps[];
  postalCodes: string[];
}

export interface ItemProps {
  id: number;
  name: string;
  description: string;
  pictures: string[];
  owner: {
    email: string;
    firstName: string;
  };
}

export function ItemsView({ data }: ItemsViewProps) {
  return (
    <div>
      <h1 className="mb-4 mt-4 font-bold">
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
      {data.items.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
