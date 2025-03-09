"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { de } from "date-fns/locale";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  acceptLendingRequest,
  confirmBorrowing,
  confirmReturn,
  rejectLendingRequest,
} from "@/actions/lendings";
import { ConfirmationPopup } from "@/components/general/ConfirmationPopup";
import { StatusBadge } from "@/components/general/StatusBadge";
import { FullDataTable } from "@/components/general/full-data-table";
import { LendingDetailsSheet } from "@/components/specific/LendingDetailsSheet";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Time } from "@/components/ui/time";
import { Messages } from "@/constants/messages";
import { toast } from "@/hooks/use-toast";

export type MyLendings = {
  id: number;
  createdAt: Date;
  startAt: Date;
  endAt: Date;
  isApproved: boolean;
  isInContact: boolean;
  isOwnerConfirmed: boolean;
  isBorrowerConfirmed: boolean;
  isBorrowed: boolean;
  isFinished: boolean;
  borrowerSatisfaction: number | null | undefined;
  borrowerSatisfactionMessage?: string | null | undefined;
  borrowerMessage?: string | null | undefined;
  borrower: {
    email: string;
    firstName: string;
  };
  item: {
    id: number;
    name: string;
    pictures: string[] | null | undefined;
    description: string | null | undefined;
  };
};

export const getColumns = (
  handleAccept: (loanId: number, event: React.MouseEvent) => void,
  handleReject: (loanId: number, event: React.MouseEvent) => void,
  handleConfirmBorrowing: (loanId: number, event: React.MouseEvent) => void,
  handleConfirmReturn: (loanId: number, event: React.MouseEvent) => void
): ColumnDef<MyLendings>[] => [
  {
    accessorFn: (row) => row.item.pictures,
    id: "Bild",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bild" />,
    cell: ({ row }) => {
      const pictures = row.getValue("Bild") as string[] | null | undefined;
      const pictureUrl = pictures && pictures.length > 0 ? pictures[0] : null;
      return pictureUrl ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_MINIO_URL}/public-item-images/${pictureUrl}`}
          alt="Item Picture"
          width={50}
          height={50}
          className="rounded-md object-cover"
        />
      ) : (
        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-gray-100">
          <span className="text-xs text-gray-500">Kein Bild</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.item.name,
    id: "Name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorFn: (row) => row.borrower.firstName,
    id: "Ausleihender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ausleihender" />,
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
      } = row.original;

      // Pending requests - show accept/reject buttons
      if (!isApproved && !isInContact && !isBorrowed && !isFinished) {
        return (
          <div className="flex space-x-2">
            <Button
              onClick={(event) => handleAccept(loanId, event)}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 text-green-500"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              onClick={(event) => handleReject(loanId, event)}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      // In contact but not yet borrowed - show status instead of confirmation button
      if (isApproved && isInContact && !isBorrowed && !isFinished) {
        return (
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-500">Warte auf Bestätigung des Ausleihenden</span>
          </div>
        );
      }

      // Currently borrowed - show confirm return button
      if (isApproved && isInContact && isBorrowed && !isFinished) {
        return (
          <Button
            onClick={(event) => handleConfirmReturn(loanId, event)}
            size="sm"
            variant="outline"
            className="text-blue-500"
          >
            Rückgabe bestätigen
          </Button>
        );
      }

      // Finished with rating
      if (isFinished && borrowerSatisfaction != null) {
        return <span className="text-xs text-gray-500">Ausleihe abgeschlossen</span>;
      }

      // Finished waiting for rating
      if (isFinished && borrowerSatisfaction == null) {
        return <span className="text-xs text-gray-500">Warte auf Bewertung</span>;
      }

      return null;
    },
  },
];

interface TableSectionProps {
  data: MyLendings[];
  refreshData: () => void;
}

export function LendingRequestsTable({ data, refreshData }: TableSectionProps) {
  const [selectedLoan, setSelectedLoan] = useState<MyLendings | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAcceptPopupOpen, setIsAcceptPopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isConfirmBorrowingPopupOpen, setIsConfirmBorrowingPopupOpen] = useState(false);
  const [isReturnPopupOpen, setIsReturnPopupOpen] = useState(false);
  const [loanToAccept, setLoanToAccept] = useState<number | null>(null);
  const [loanToReject, setLoanToReject] = useState<number | null>(null);
  const [loanToConfirmBorrowing, setLoanToConfirmBorrowing] = useState<number | null>(null);
  const [loanToReturn, setLoanToReturn] = useState<number | null>(null);

  const handleRowClick = (row: Row<MyLendings>) => {
    setSelectedLoan(row.original);
    setIsSheetOpen(true);
  };

  const openAcceptPopup = (loanId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLoanToAccept(loanId);
    setIsAcceptPopupOpen(true);
  };

  const openRejectPopup = (loanId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLoanToReject(loanId);
    setIsRejectPopupOpen(true);
  };

  const openConfirmBorrowingPopup = (loanId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLoanToConfirmBorrowing(loanId);
    setIsConfirmBorrowingPopupOpen(true);
  };

  const openReturnPopup = (loanId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLoanToReturn(loanId);
    setIsReturnPopupOpen(true);
  };

  const handleAccept = async () => {
    if (loanToAccept) {
      try {
        await acceptLendingRequest(loanToAccept);
        toast({
          title: "Anfrage angenommen",
          description: "Die Anfrage wurde erfolgreich angenommen.",
        });
        refreshData();
      } catch {
        toast({
          title: "Fehler",
          description: Messages.ERROR_TRY_AGAIN_LATER,
          variant: "destructive",
        });
      } finally {
        setIsAcceptPopupOpen(false);
      }
    }
  };

  const handleReject = async () => {
    if (loanToReject) {
      try {
        await rejectLendingRequest(loanToReject);
        toast({
          title: "Anfrage abgelehnt",
          description: "Die Anfrage wurde erfolgreich abgelehnt.",
        });
        refreshData();
      } catch {
        toast({
          title: "Fehler",
          description: Messages.ERROR_TRY_AGAIN_LATER,
          variant: "destructive",
        });
      } finally {
        setIsRejectPopupOpen(false);
      }
    }
  };

  const handleConfirmBorrowing = async () => {
    if (loanToConfirmBorrowing) {
      try {
        await confirmBorrowing(loanToConfirmBorrowing);
        toast({
          title: "Übergabe bestätigt",
          description: "Die Übergabe wurde erfolgreich bestätigt.",
        });
        refreshData();
      } catch {
        toast({
          title: "Fehler",
          description: Messages.ERROR_TRY_AGAIN_LATER,
          variant: "destructive",
        });
      } finally {
        setIsConfirmBorrowingPopupOpen(false);
      }
    }
  };

  const handleConfirmReturn = async () => {
    if (loanToReturn) {
      try {
        await confirmReturn(loanToReturn);
        toast({
          title: "Rückgabe bestätigt",
          description: "Die Rückgabe wurde erfolgreich bestätigt.",
        });
        refreshData();
      } catch {
        toast({
          title: "Fehler",
          description: Messages.ERROR_TRY_AGAIN_LATER,
          variant: "destructive",
        });
      } finally {
        setIsReturnPopupOpen(false);
      }
    }
  };

  return (
    <div className="mt-6">
      <FullDataTable
        columns={getColumns(
          openAcceptPopup,
          openRejectPopup,
          openConfirmBorrowingPopup,
          openReturnPopup
        )}
        data={data}
        onRowClick={handleRowClick}
      />

      {selectedLoan && (
        <LendingDetailsSheet
          loan={selectedLoan}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      )}

      <ConfirmationPopup
        isOpen={isAcceptPopupOpen}
        onClose={() => setIsAcceptPopupOpen(false)}
        onConfirm={handleAccept}
        title="Anfrage annehmen"
        description="Möchtest du diese Ausleihanfrage annehmen? Der Ausleihende wird deine Kontaktdaten erhalten."
        confirmText="Annehmen"
        cancelText="Abbrechen"
      />

      <ConfirmationPopup
        isOpen={isRejectPopupOpen}
        onClose={() => setIsRejectPopupOpen(false)}
        onConfirm={handleReject}
        title="Anfrage ablehnen"
        description="Möchtest du diese Ausleihanfrage ablehnen?"
        confirmText="Ablehnen"
        cancelText="Abbrechen"
        confirmButtonVariant="destructive"
      />

      <ConfirmationPopup
        isOpen={isConfirmBorrowingPopupOpen}
        onClose={() => setIsConfirmBorrowingPopupOpen(false)}
        onConfirm={handleConfirmBorrowing}
        title="Bereit zur Übergabe"
        description="Möchtest du bestätigen, dass der Gegenstand zur Abholung bereit ist? Der Ausleihende muss dann nur noch die Übergabe bestätigen."
        confirmText="Bestätigen"
        cancelText="Abbrechen"
      />

      <ConfirmationPopup
        isOpen={isReturnPopupOpen}
        onClose={() => setIsReturnPopupOpen(false)}
        onConfirm={handleConfirmReturn}
        title="Rückgabe bestätigen"
        description="Bestätigst du, dass der Gegenstand zurückgegeben wurde?"
        confirmText="Bestätigen"
        cancelText="Abbrechen"
      />
    </div>
  );
}
