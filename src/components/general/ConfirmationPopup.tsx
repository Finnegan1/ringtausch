"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  message?: string; // For backward compatibility
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  title = "Bestätigung",
  description,
  message,
  confirmText = "Bestätigen",
  cancelText = "Abbrechen",
  confirmButtonVariant = "default",
}: ConfirmationPopupProps) {
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
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {message && !description && <p className="text-gray-700 dark:text-gray-300">{message}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} disabled={loading} variant={confirmButtonVariant}>
            {loading ? "Bitte warten..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
