"use client";

import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { SearchItemProps } from "./ItemsView";

interface ItemDetailsSheetProps {
  item: SearchItemProps;
  avgRating: number | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRequestSheet: () => void;
}

export function ItemDetailsSheet({
  item,
  avgRating,
  isOpen,
  onOpenRequestSheet,
  onClose,
}: ItemDetailsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-gray-100">{item.name}</SheetTitle>
          <SheetDescription className="text-gray-700 dark:text-gray-300">
            Hier sind die Details des ausgewählten Gegenstands.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 p-6">
          <div className="flex flex-col items-center space-y-3">
            {item.pictures?.length || 0 > 0 ? (
              <Image
                width={128}
                height={128}
                src={`${process.env.NEXT_PUBLIC_MINIO_URL}/public-item-images/${item.pictures![0]}`}
                alt="Artikelbild"
                className="h-32 w-32 rounded-md object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-md bg-gray-100 shadow-lg dark:bg-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Kein Bild</span>
              </div>
            )}
            <h2 className="text-center text-xl font-bold text-gray-900 dark:text-gray-100">
              {item.name}
            </h2>
            {item.description && (
              <p className="text-center text-base text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            )}
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />
          <div className="space-y-1">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              Durchschnittliche Bewertung:
            </h3>
            <span
              className="flex items-center space-x-1 text-gray-500 dark:text-gray-200"
              style={avgRating === null ? { display: "none" } : {}}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < (avgRating || 0)
                      ? "text-yyellow-400 fill-yellow-400"
                      : "fill-gray-300 dark:fill-gray-500"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.416 8.257L12 18.896l-7.416 4.958L6 15.597 0 9.75l8.332-1.732L12 .587z" />
                </svg>
              ))}
              &nbsp; &nbsp; (⌀ {avgRating?.toFixed(1)})
            </span>
            <span
              className="text-gray-500 dark:text-gray-200"
              style={avgRating !== null ? { display: "none" } : {}}
            >
              Noch keine Bewertungen vorhanden
            </span>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />
          <Button onClick={onOpenRequestSheet}>Zur Anfrage</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
