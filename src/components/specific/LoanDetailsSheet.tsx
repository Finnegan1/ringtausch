"use client";

import Image from "next/image";

import type { MyBorrows } from "@/components/specific/BorrowRequestsTable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { StatusBadge } from "../general/StatusBadge";

interface LoanDetailsSheetProps {
  loan: MyBorrows;
  isOpen: boolean;
  onClose: () => void;
}

export function LoanDetailsSheet({ loan, isOpen, onClose }: LoanDetailsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-gray-100">Ausleihdetails</SheetTitle>
          <SheetDescription className="text-gray-700 dark:text-gray-300">
            Hier sind die Details des ausgewählten Ausleihvorgangs.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 p-6">
          <div className="flex flex-col items-center space-y-3">
            {loan.item.pictures?.length || 0 > 0 ? (
              <Image
                width={128}
                height={128}
                src={`${process.env.NEXT_PUBLIC_MINIO_URL}/public-item-images/${loan.item.pictures![0]}`}
                alt="Artikelbild"
                className="h-32 w-32 rounded-md object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-md bg-gray-100 shadow-lg dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Kein Bild</span>
              </div>
            )}
            <h2 className="text-center text-xl font-bold text-gray-900 dark:text-gray-100">
              {loan.item.name}
            </h2>
            {loan.item.description && (
              <p className="text-center text-base text-gray-700 dark:text-gray-300">
                {loan.item.description}
              </p>
            )}
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-y-3">
            <span className="font-medium text-gray-700 dark:text-gray-300">Erstellt am:</span>
            <span className="text-gray-600 dark:text-gray-200">
              {new Date(loan.createdAt).toLocaleString("de-DE")}
            </span>

            <span className="font-medium text-gray-700 dark:text-gray-300">Beginn:</span>
            <span className="text-gray-600 dark:text-gray-200">
              {new Date(loan.startAt).toLocaleString("de-DE")}
            </span>

            <span className="font-medium text-gray-700 dark:text-gray-300">Ende:</span>
            <span className="text-gray-600 dark:text-gray-200">
              {new Date(loan.endAt).toLocaleString("de-DE")}
            </span>

            <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <div className="justify-self-start">
              <StatusBadge
                isFinished={loan.isFinished}
                isBorrowed={loan.isBorrowed}
                isApproved={loan.isApproved}
                isInContact={loan.isInContact}
              />
            </div>
          </div>

          {loan.isInContact && (
            <>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="grid grid-cols-2 gap-y-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Vorname:</span>
                <span className="text-gray-600 dark:text-gray-200">
                  {loan.item.owner?.firstName}
                </span>

                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-600 dark:text-gray-200">{loan.item.owner?.email}</span>
              </div>
            </>
          )}
          <hr className="border-gray-200 dark:border-gray-700" />
          {loan.borrowerMessage && (
            <div className="space-y-1">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Deine Nachricht:</h3>
              <Textarea
                readOnly
                value={loan.borrowerMessage}
                className="cursor-default select-none resize-none bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                rows={3}
              />
            </div>
          )}

          {loan.borrowerSatisfactionMessage && (
            <div className="space-y-1">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Deine Bewertung:</h3>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < (loan.borrowerSatisfaction ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-500"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.416 8.257L12 18.896l-7.416 4.958L6 15.597 0 9.75l8.332-1.732L12 .587z" />
                  </svg>
                ))}
              </div>
              <Textarea
                readOnly
                value={loan.borrowerSatisfactionMessage}
                className="cursor-default select-none resize-none bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                rows={3}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
