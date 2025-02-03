"use client";

import { Row } from "@tanstack/react-table";
import { useState } from "react";

import { LoanDetailsSheet } from "@/components/LoanDetailsSheet";
import { RatingPopup } from "@/components/RatingPopup";
import { FullDataTable } from "@/components/general/full-data-table";

import { confirmBorrow } from "../actions/confirm-borrow";
import { deleteBorrowRequest } from "../actions/delete-borrow-request";
import type { MyBorrows } from "./columns";
import { getColumns } from "./columns";

interface TableSectionProps {
  data: MyBorrows[];
}

export function BorrowRequestsTable({ data }: TableSectionProps) {
  const [selectedLoan, setSelectedLoan] = useState<MyBorrows | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);

  const handleRowClick = (row: Row<MyBorrows>) => {
    setSelectedLoan(row.original);
    setIsSheetOpen(true);
  };

  const openRatingPopup = (loanId: number) => {
    setSelectedLoanId(loanId);
    setIsRatingPopupOpen(true);
  };

  const handleDelete = async (loanId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteBorrowRequest(loanId);
    console.log("Deleting loan:", loanId);
  };

  const handleUserCheck = async (loanId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    confirmBorrow(loanId);
    console.log("Confirming borrow:", loanId);
  };

  return (
    <div className="mt-6">
      <FullDataTable
        columns={getColumns(openRatingPopup, handleDelete, handleUserCheck)}
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
        onClose={() => setIsRatingPopupOpen(false)}
        apiUrl="/api/my-borrows/rate"
        loanId={selectedLoanId ?? 0}
      />
    </div>
  );
}
