"use client";

import { useState } from "react";

import { RatingPopup } from "@/components/RatingPopup";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSubmit = (rating: number, message: string) => {
    console.log(`Rating: ${rating}, Message: ${message}`);
    // Here you would typically send this data to your backend
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Button onClick={() => setIsPopupOpen(true)}>Open Rating Popup</Button>
      <RatingPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
