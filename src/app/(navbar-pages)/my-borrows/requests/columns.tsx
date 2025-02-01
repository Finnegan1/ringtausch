"use client";

import { ColumnDef } from "@tanstack/react-table";
import { de } from "date-fns/locale";
import { Star, StarHalf, Trash, UserCheck } from "lucide-react";
import Image from "next/image";

import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Time } from "@/components/ui/time";

/*
export type Requests = Omit<
  Prisma.LoanGetPayload<{
    include: {
      item: { select: { name: true } };
    };
  }>,
  "item"
> & {
  name: string;
};*/
export type Requests = {
  id: number;
  createdAt: Date;
  startAt: Date;
  endAt: Date;
  isApproved: boolean;
  isInContact: boolean;
  isBorrowed?: boolean;
  isFinished?: boolean;
  item: {
    name: string;
    picture: string | null | undefined;
  };
};

export const columns: ColumnDef<Requests>[] = [
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
      let status = "Pending";

      if (isFinished) {
        status = "Beendet";
      } else if (isBorrowed) {
        status = "In Durchführung";
      } else if (isApproved) {
        status = "Angenommen";
      } else if (isInContact) {
        status = "In Kontakt";
      }

      return <div>{status}</div>;
    },
  },
  {
    id: "Aktionen",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Aktionen" />,
    cell: ({ row }) => {
      const { id: loanId, isApproved, isInContact, isBorrowed, isFinished } = row.original;
      const handleDelete = async () => {
        try {
          const response = await fetch("/api/delete-borrow-request", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ loanId }),
          });
          if (!response.ok) {
            throw new Error("Failed to delete loan");
          }
          const data = await response.json();
          console.log(`Loan Request with ID: ${loanId} delete successfully.`, data);
        } catch (error) {
          console.error("Error deleting loan:", error);
        }
      };
      const handleUserCheck = async () => {
        console.log(`User check triggered for loan ID: ${loanId}`);
        // Call your user-check function here
      };
      //const handleReturn = async () => {
      //  console.log(`Return action triggered for loan ID: ${loanId}`);
      //  // Call your return action function here
      //};
      const handleRating = async () => {
        console.log(`Rating action triggered for loan ID: ${loanId}`);
        // Call your return action function here
      };
      if (isApproved && isInContact && !isBorrowed && !isFinished) {
        return (
          <button onClick={handleUserCheck} className="flex items-center space-x-2 text-green-500">
            <UserCheck />
          </button>
        );
      }
      if (isBorrowed && !isFinished) {
        return (
          <div />
          //<button onClick={handleReturn} className="flex items-center space-x-2 text-blue-500">
          //  <span>Return</span>
          //</button>
        );
      }
      if (isFinished) {
        return (
          <button onClick={handleRating} className="flex items-center space-x-2 text-gray-500">
            <Star />
            <Star />
            <StarHalf />
          </button>
        );
      }
      return (
        <button onClick={handleDelete} className="flex items-center space-x-2 text-red-500">
          <Trash />
        </button>
      );
    },
  },
];
