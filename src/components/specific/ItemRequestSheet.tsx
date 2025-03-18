"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { SearchItemProps } from "./ItemsView";

interface ItemRequestSheetProps {
  item: SearchItemProps;
  isOpen: boolean;
  blockedDates: Date[];
  onClose: () => void;
}

export function ItemRequestSheet({ blockedDates, item, isOpen, onClose }: ItemRequestSheetProps) {
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [endAt, setEndAt] = useState<Date | null>(null);
  const [message, setMessage] = useState<string>("");
  const { toast } = useToast();

  const setDate = (date: Date) => {
    if (blockedDates.some((blockedDate) => blockedDate.toDateString() === date.toDateString())) {
      toast({
        title: "Ausleihe nicht möglich",
        description: "An diesem Tag ist die Ausleihe nicht möglich. Bitte wähle einen anderen Tag.",
        variant: "destructive",
      });
      return;
    }

    if (!startAt) {
      setStartAt(date);
    } else if (!endAt) {
      if (date < startAt) {
        setStartAt(date);
        setEndAt(null);
      } else {
        setEndAt(date);
      }
    }
  };

  const resetDates = () => {
    setStartAt(null);
    setEndAt(null);
  };

  const resetAll = () => {
    resetDates();
    setMessage("");
  };

  const sendRequest = () => {
    if (startAt && endAt) {
      fetch("/api/request-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          message,
        }),
      })
        .then((response) => {
          if (response.ok) {
            resetAll();
            onClose();
          }
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Fehler",
            description: "Fehler beim Senden der Anfrage. Bitte versuche es später erneut.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Bitte wähle einen Zeitraum",
        description: "Nutze den Kalender, um einen Zeitraum für die Ausleihe auszuwählen.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        resetAll();
        onClose();
      }}
    >
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-gray-100">Ausleihe anfragen</SheetTitle>
          <SheetDescription className="text-gray-700 dark:text-gray-300">
            Hier kannst du eine Anfrage für den ausgewählten Gegenstand stellen und die
            Verfügbarkeit prüfen. An den rot markierten Tagen ist die Ausleihe nicht möglich.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 p-6">
          <Calendar
            modifiers={{ blockedDates }}
            modifiersClassNames={{ blockedDates: "bg-red-300 dark:bg-red-500" }}
            onDayClick={(day) => setDate(day)}
          />
        </div>
        <Label htmlFor="startAt">
          Beginn der Ausleihe
          {startAt === null ? " (Auswahl im Kalender oben)" : ""}:
        </Label>
        <Input
          id="startAt"
          name="startAt"
          contentEditable={false}
          readOnly={true}
          type="text"
          className="my-4"
          value={
            startAt
              ? `${startAt.toLocaleDateString("de-DE", { month: "long", day: "numeric" })}`
              : ""
          }
        />
        <Label htmlFor="endAt">
          Ende der Ausleihe
          {endAt === null && startAt !== null ? " (Auswahl im Kalender oben)" : ""}:
        </Label>
        <Input
          id="endAt"
          name="endAt"
          contentEditable={false}
          className="my-4"
          readOnly={true}
          type="text"
          value={
            endAt ? `${endAt.toLocaleDateString("de-DE", { month: "long", day: "numeric" })}` : ""
          }
        />
        <br />
        <Label htmlFor="message">Nachricht:</Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          className="mb-8 mt-4"
          placeholder="Hier kannst du eine Nachricht an den Besitzer des Gegenstands schreiben."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Button variant={"secondary"} onClick={resetDates}>
          Zurücksetzen
        </Button>
        <Button onClick={sendRequest} className="ml-4">
          Anfrage senden
        </Button>
        <br />
      </SheetContent>
    </Sheet>
  );
}
