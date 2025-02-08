"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { rate } from "@/actions/rate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: number;
}

export function RatingPopup({ isOpen, onClose, loanId }: RatingPopupProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents row click from triggering
    setLoading(true);
    setError("");
    try {
      await rate(loanId, rating, message);
      setRating(0);
      setMessage("");
      onClose();
    } catch {
      setError("something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose(); // Only close the popup without triggering the row click
        }
      }}
    >
      <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Star Rating Selection */}
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevents row click
                  setRating(star);
                }}
              />
            ))}
          </div>
          <Textarea
            placeholder="Leave your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevents row click
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
