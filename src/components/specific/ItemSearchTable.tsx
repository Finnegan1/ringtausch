"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";

import { DataTableColumnHeader } from "@/components/ui/data-table";

import { FullDataTable } from "../general/full-data-table";
import { ItemDetailsSheet } from "./ItemDetailsSheet";
import { ItemRequestSheet } from "./ItemRequestSheet";
import { SearchItemProps } from "./ItemsView";

export const getColumns = () // openRatingPopup: (loanId: number) => void,
// handleDelete: (loanId: number, event: React.MouseEvent) => void,
// handleUserCheck: (loanId: number, event: React.MouseEvent) => void
: ColumnDef<SearchItemProps>[] => [
  {
    accessorFn: (row) => row.pictures,
    id: "Bild",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bild" />,
    cell: ({ row }) => {
      const pictureUrl = (row.getValue("Bild") as string)[0];
      return pictureUrl ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_MINIO_URL}/public-item-images/${pictureUrl}`}
          alt="Item Picture"
          width={50}
          height={50}
        />
      ) : (
        <div>Kein Bild</div>
      );
    },
  },
  {
    accessorFn: (row) => row.name,
    id: "Name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorFn: (row) => row.owner.postalCode,
    id: "PLZ",
    header: ({ column }) => <DataTableColumnHeader column={column} title="PLZ" />,
  },
];

export function ItemSearchTable({ data: data }: { data: SearchItemProps[] }) {
  const [selectedItem, setSelectedItem] = useState<SearchItemProps | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [isRequestSheetOpen, setIsRequestSheetOpen] = useState(false);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [result, setBlockedDates] = useState<Date[]>([]);

  const handleRowClick = (row: Row<SearchItemProps>) => {
    setSelectedItem(row.original);

    fetch(`/api/avg-rating/${row.original.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAvgRating(data.avgRating);
      })
      .catch((error) => {
        console.error("Error fetching average rating:", error);
      });

    setIsDetailsSheetOpen(true);
  };

  const handleOpenRequestSheet = () => {
    setIsDetailsSheetOpen(false);
    fetch(`/api/blocked-dates/${selectedItem!.id}`)
      .then((res) => res.json())
      .then((data) => {
        const result = data.blockedDates.map((date: string) => new Date(date));
        setBlockedDates(result);
        setIsRequestSheetOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching blocked dates:", error);
      });
  };

  return (
    <div className="mt-6">
      <FullDataTable
        columns={getColumns()}
        data={data}
        key={data.map((item) => item.id).join(",")}
        onRowClick={handleRowClick}
      />
      {selectedItem && (
        <ItemDetailsSheet
          avgRating={avgRating}
          item={selectedItem}
          isOpen={isDetailsSheetOpen}
          onOpenRequestSheet={handleOpenRequestSheet}
          onClose={() => setIsDetailsSheetOpen(false)}
        />
      )}
      {selectedItem && (
        <ItemRequestSheet
          item={selectedItem}
          blockedDates={result}
          isOpen={isRequestSheetOpen}
          onClose={() => setIsRequestSheetOpen(false)}
        />
      )}
    </div>
  );
}
