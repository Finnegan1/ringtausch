"use client";

import Image from "next/image";

import type { MyLendings } from "@/components/specific/LendingRequestsTable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { StatusBadge } from "../general/StatusBadge";

interface LendingDetailsSheetProps {
  loan: MyLendings;
  isOpen: boolean;
  onClose: () => void;
}

export function LendingDetailsSheet({ loan, isOpen, onClose }: LendingDetailsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-gray-100">Verleihdetails</SheetTitle>
          <SheetDescription className="text-gray-700 dark:text-gray-300">
            Hier sind die Details des ausgewählten Verleihvorgangs.
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
                isBorrowerConfirmed={loan.isBorrowerConfirmed}
              />
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />
          <div className="grid grid-cols-2 gap-y-3">
            <span className="font-medium text-gray-700 dark:text-gray-300">Ausleihender:</span>
            <span className="text-gray-600 dark:text-gray-200">{loan.borrower.firstName}</span>

            <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
            <span className="text-gray-600 dark:text-gray-200">{loan.borrower.email}</span>
          </div>

          {loan.isApproved && loan.isInContact && !loan.isBorrowed && !loan.isFinished && (
            <>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {loan.isOwnerConfirmed && !loan.isBorrowerConfirmed
                    ? "Du hast die Übergabe bereits bestätigt. Warte auf die Bestätigung des Ausleihenden."
                    : !loan.isOwnerConfirmed && loan.isBorrowerConfirmed
                      ? 'Der Ausleihende hat die Übergabe bereits bestätigt. Bitte bestätige die Übergabe mit dem Button "Ausleihe bestätigen".'
                      : !loan.isOwnerConfirmed && !loan.isBorrowerConfirmed
                        ? "Du hast die Kontaktdaten freigegeben. Warte nun, bis die ausleihende Person die Übergabe bestätigt hat."
                        : "Fehler: Unerwarteter Status."}
                </p>
              </div>
            </>
          )}

          {loan.borrowerMessage && (
            <>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="space-y-1">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  Nachricht des Ausleihenden:
                </h3>
                <Textarea
                  readOnly
                  value={loan.borrowerMessage}
                  className="cursor-default select-none resize-none bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  rows={3}
                />
              </div>
            </>
          )}

          {loan.borrowerSatisfactionMessage && (
            <>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="space-y-1">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  Bewertung des Ausleihenden:
                </h3>
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
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
