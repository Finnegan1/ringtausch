import { ColumnDef } from "@tanstack/react-table";
import { de } from "date-fns/locale";
import { Star, StarHalf } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Time } from "@/components/ui/time";

export type MyBorrows = {
  id: number;
  createdAt: Date;
  startAt: Date;
  endAt: Date;
  isApproved: boolean;
  isInContact: boolean;
  isBorrowed?: boolean;
  isFinished?: boolean;
  borrowerSatisfaction: number | null | undefined;
  borrowerSatisfactionMessage?: string | null | undefined;
  borrowerMessage?: string | null | undefined;
  item: {
    name: string;
    picture: string | null | undefined;
    description: string | null | undefined;
  };
};

export const getColumns = (openRatingPopup: (loanId: number) => void): ColumnDef<MyBorrows>[] => [
  {
    accessorFn: (row) => row.item.picture,
    id: "Bild",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bild" />,
    cell: ({ row }) => {
      const pictureUrl = row.getValue("Bild") as string | null | undefined;
      return pictureUrl ? (
        <Image src={pictureUrl} alt="Item Picture" width={50} height={50} />
      ) : (
        <div>No Image</div>
      );
    },
  },
  {
    accessorFn: (row) => row.item.name,
    id: "Name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "createdAt",
    id: "Erstellungsdatum",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Erstellungsdatum" />,
    cell: ({ row }) => {
      const createdAt = row.getValue("Erstellungsdatum") as Date;
      return (
        <div>
          <Time locale={de}>{createdAt}</Time>
        </div>
      );
    },
  },
  {
    accessorKey: "startAt",
    id: "Startdatum",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Startdatum" />,
    cell: ({ row }) => {
      const startAt = row.getValue("Startdatum") as Date;
      return (
        <div>
          <Time locale={de}>{startAt}</Time>
        </div>
      );
    },
  },
  {
    accessorKey: "endAt",
    id: "Enddatum",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Enddatum" />,
    cell: ({ row }) => {
      const endAt = row.getValue("Enddatum") as Date;
      return (
        <div>
          <Time locale={de}>{endAt}</Time>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    id: "Status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { isFinished, isBorrowed, isApproved, isInContact } = row.original;
      let status = "Angefragt";
      let badgeClass = "bg-gray-200 text-gray-800";

      if (isFinished) {
        status = "Zurückgegeben";
        badgeClass = "bg-green-200 text-green-800";
      } else if (isBorrowed) {
        status = "Ausgeliehen";
        badgeClass = "bg-yellow-200 text-yellow-800";
      } else if (isApproved) {
        status = "Angenommen";
        badgeClass = "bg-blue-200 text-blue-800";
      } else if (isInContact) {
        status = "In Kontakt";
        badgeClass = "bg-purple-200 text-purple-800";
      }

      return (
        <Badge className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "Aktionen",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Aktionen" />,
    cell: ({ row }) => {
      const {
        id: loanId,
        isFinished,
        borrowerSatisfaction,
        borrowerSatisfactionMessage,
      } = row.original;

      if (isFinished && borrowerSatisfaction === null && borrowerSatisfactionMessage === null) {
        return (
          <button
            onClick={(event) => {
              event.stopPropagation();
              openRatingPopup(loanId);
            }}
            className="flex items-center space-x-2 text-gray-500"
          >
            <Star />
            <Star />
            <StarHalf />
          </button>
        );
      }
      if (isFinished && (borrowerSatisfaction != null || borrowerSatisfactionMessage != null)) {
        return (
          <Badge className="rounded-full bg-green-200 px-2 py-1 text-xs font-semibold text-green-800">
            Bewertet 🎉
          </Badge>
        );
      }
      return null;
    },
  },
];
