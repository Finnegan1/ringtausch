"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Calendar } from "../ui/calendar";
import { SearchItemProps } from "./ItemsView";

interface ItemRequestSheetProps {
  item: SearchItemProps;
  isOpen: boolean;
  blockedDates: Date[];
  onClose: () => void;
}

export function ItemRequestSheet({ blockedDates, isOpen, onClose }: ItemRequestSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-gray-100">Ausleihe anfragen</SheetTitle>
          <SheetDescription className="text-gray-700 dark:text-gray-300">
            Hier kannst du eine Anfrage für den ausgewählten Gegenstand stellen.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 p-6">
          <Calendar
            modifiers={{ blockedDates }}
            modifiersClassNames={{ blockedDates: "bg-red-300 dark:bg-red-600" }}
          />
        </div>
        <p>An den rot markierten Tagen ist die Ausleihe nicht möglich.</p>
      </SheetContent>
    </Sheet>
  );
}
