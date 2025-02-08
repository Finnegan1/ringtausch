"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { de } from "date-fns/locale";
import { Star, StarHalf, Trash, UserCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { confirmBorrow, deleteBorrowRequest } from "@/actions/loans";
import { ConfirmationPopup } from "@/components/general/ConfirmationPopup";
import { RatingPopup } from "@/components/general/RatingPopup";
import { FullDataTable } from "@/components/general/full-data-table";
import { LoanDetailsSheet } from "@/components/specific/LoanDetailsSheet";
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
    owner?: {
      email: string;
      firstName: string;
    };
  };
};

export const getColumns = (
  openRatingPopup: (loanId: number) => void,
  handleDelete: (loanId: number, event: React.MouseEvent) => void,
  handleUserCheck: (loanId: number, event: React.MouseEvent) => void
): ColumnDef<MyBorrows>[] => [
  {
    accessorFn: (row) => row.item.picture,
    id: "Bild",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bild" />,
    cell: ({ row }) => {
      const pictureUrl = (row.getValue("Bild") as string).split(",")[0];
      return pictureUrl ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_MINIO_URL}/public-item-images
/${pictureUrl}`}
          alt="Item Picture"
          width={50}
          height={50}
        />
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
        badgeClass = "bg-green-200 hover:bg-green-200 text-green-800";
      } else if (isBorrowed) {
        status = "Ausgeliehen";
        badgeClass = "bg-yellow-200 hover:bg-yellow-200 text-yellow-800";
      } else if (isApproved) {
        status = "Angenommen";
        badgeClass = "bg-blue-200 hover:bg-blue-200 text-blue-800";
      } else if (isInContact) {
        status = "In Kontakt";
        badgeClass = "bg-purple-200 hover:bg-purple-200 text-purple-800";
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
        isApproved,
        isInContact,
        isBorrowed,
        isFinished,
        borrowerSatisfaction,
        borrowerSatisfactionMessage,
      } = row.original;

      if (isApproved && isInContact && !isBorrowed && !isFinished) {
        return (
          <button
            onClick={(event) => handleUserCheck(loanId, event)}
            className="flex items-center space-x-2 text-green-500"
          >
            <UserCheck />
          </button>
        );
      }
      if (isBorrowed && !isFinished) {
        return <div />;
      }
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
      return (
        <button
          onClick={(event) => handleDelete(loanId, event)}
          className="flex items-center space-x-2 text-red-500"
        >
          <Trash />
        </button>
      );
    },
  },
];

interface TableSectionProps {
  data: MyBorrows[];
  refreshData: () => void;
}

export function BorrowRequestsTable({ data, refreshData }: TableSectionProps) {
  const [selectedLoan, setSelectedLoan] = useState<MyBorrows | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [loanToConfirm, setLoanToConfirm] = useState<number | null>(null);
  const [loanToDelete, setLoanToDelete] = useState<number | null>(null);

  const handleRowClick = (row: Row<MyBorrows>) => {
    setSelectedLoan(row.original);
    setIsSheetOpen(true);
  };

  const openRatingPopup = (loanId: number) => {
    setSelectedLoanId(loanId);
    setIsRatingPopupOpen(true);
  };

  const openConfirmPopup = (loanId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLoanToConfirm(loanId);
    setIsConfirmPopupOpen(true);
  };

  const openDeletePopup = (loanId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLoanToDelete(loanId);
    setIsDeletePopupOpen(true);
  };

  const handleDelete = async () => {
    if (loanToDelete) {
      await deleteBorrowRequest(loanToDelete);
      refreshData();
    }
    setIsDeletePopupOpen(false);
  };

  const handleUserCheck = async () => {
    if (loanToConfirm) {
      await confirmBorrow(loanToConfirm);
      refreshData();
    }
    setIsConfirmPopupOpen(false);
  };

  return (
    <div className="mt-6">
      <FullDataTable
        columns={getColumns(openRatingPopup, openDeletePopup, openConfirmPopup)}
        data={data}
        onRowClick={handleRowClick}
      />

      {selectedLoan && (
        <LoanDetailsSheet
          loan={selectedLoan}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      )}

      <RatingPopup
        isOpen={isRatingPopupOpen}
        onClose={() => {
          setIsRatingPopupOpen(false);
          refreshData();
        }}
        loanId={selectedLoanId ?? 0}
      />

      <ConfirmationPopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        message="Bist du sicher, dass du diese Ausleihe bestätigen möchtest?"
        onConfirm={handleUserCheck}
      />

      <ConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        message="Bist du sicher, dass du diese Leihanfrage löschen möchtest?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
