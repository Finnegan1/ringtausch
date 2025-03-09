"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { de } from "date-fns/locale";
import { Star, Trash, UserCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { confirmBorrow, deleteBorrowRequest } from "@/actions/loans";
import { ConfirmationPopup } from "@/components/general/ConfirmationPopup";
import { RatingPopup } from "@/components/general/RatingPopup";
import { StatusBadge } from "@/components/general/StatusBadge";
import { FullDataTable } from "@/components/general/full-data-table";
import { LoanDetailsSheet } from "@/components/specific/LoanDetailsSheet";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Time } from "@/components/ui/time";

export type MyBorrows = {
  id: number;
  createdAt: Date;
  startAt: Date;
  endAt: Date;
  isApproved: boolean;
  isInContact: boolean;
  isBorrowed: boolean;
  isFinished: boolean;
  isOwnerConfirmed?: boolean;
  isBorrowerConfirmed?: boolean;
  borrowerSatisfaction: number | null | undefined;
  borrowerSatisfactionMessage?: string | null | undefined;
  borrowerMessage?: string | null | undefined;
  item: {
    name: string;
    pictures: string[] | null | undefined;
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
    accessorFn: (row) => row.item.pictures,
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
      return (
        <StatusBadge
          isFinished={row.original.isFinished}
          isBorrowed={row.original.isBorrowed}
          isApproved={row.original.isApproved}
          isInContact={row.original.isInContact}
          isBorrowerConfirmed={row.original.isBorrowerConfirmed}
        />
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
          <Button
            onClick={(event) => handleUserCheck(loanId, event)}
            size="sm"
            variant="outline"
            className="text-blue-500"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Übergabe bestätigen
          </Button>
        );
      }
      if (isBorrowed && !isFinished) {
        return (
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-500">Warte auf Rückgabebestätigung</span>
          </div>
        );
      }
      if (isFinished && borrowerSatisfaction === null && borrowerSatisfactionMessage === null) {
        return (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              openRatingPopup(loanId);
            }}
            size="sm"
            variant="outline"
            className="text-amber-500"
          >
            <Star className="mr-2 h-4 w-4" />
            Bewerten
          </Button>
        );
      }
      if (isFinished && (borrowerSatisfaction != null || borrowerSatisfactionMessage != null)) {
        return <span className="text-xs text-gray-500">Bewertung abgegeben</span>;
      }
      return (
        <Button
          onClick={(event) => handleDelete(loanId, event)}
          size="sm"
          variant="outline"
          className="text-red-500"
        >
          <Trash className="mr-2 h-4 w-4" />
          Löschen
        </Button>
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
        onConfirm={handleUserCheck}
        title="Übergabe bestätigen"
        description="Bestätigst du, dass du den Gegenstand erhalten hast und die Ausleihe beginnt?"
        confirmText="Bestätigen"
        cancelText="Abbrechen"
      />

      <ConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={handleDelete}
        title="Anfrage löschen"
        description="Möchtest du diese Ausleihanfrage wirklich löschen?"
        confirmText="Löschen"
        cancelText="Abbrechen"
        confirmButtonVariant="destructive"
      />
    </div>
  );
}
