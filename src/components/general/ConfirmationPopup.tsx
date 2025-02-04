"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
}

export function ConfirmationPopup({ isOpen, onClose, message, onConfirm }: ConfirmationPopupProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(); // Execute the provided function
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error executing function:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bestätigung</DialogTitle>
        </DialogHeader>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Abbrechen
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Bitte warten..." : "Bestätigen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
