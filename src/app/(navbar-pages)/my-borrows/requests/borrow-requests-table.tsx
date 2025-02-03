"use client";

import { Row } from "@tanstack/react-table";
import { useState } from "react";

import { ConfirmationPopup } from "@/components/ConfirmationPopup";
import { LoanDetailsSheet } from "@/components/LoanDetailsSheet";
import { RatingPopup } from "@/components/RatingPopup";
import { FullDataTable } from "@/components/general/full-data-table";

import { confirmBorrow } from "../actions/confirm-borrow";
import { deleteBorrowRequest } from "../actions/delete-borrow-request";
import type { MyBorrows } from "./columns";
import { getColumns } from "./columns";

interface TableSectionProps {
  data: MyBorrows[];
  refreshData: () => void; // Function to refresh data
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
      console.log("Deleted loan:", loanToDelete);
      refreshData(); // Refresh data after delete
    }
    setIsDeletePopupOpen(false);
  };

  const handleUserCheck = async () => {
    if (loanToConfirm) {
      await confirmBorrow(loanToConfirm);
      console.log("Confirmed borrow:", loanToConfirm);
      refreshData(); // Refresh data after confirm
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
          refreshData(); // Refresh after rating
        }}
        apiUrl="/api/my-borrows/rate"
        loanId={selectedLoanId ?? 0}
      />

      {/* Confirm Borrow Popup */}
      <ConfirmationPopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        message="Bist du sicher, dass du diese Ausleihe bestätigen möchtest?"
        onConfirm={handleUserCheck}
      />

      {/* Delete Borrow Request Popup */}
      <ConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        message="Bist du sicher, dass du diese Leihanfrage löschen möchtest?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
