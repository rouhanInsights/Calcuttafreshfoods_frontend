"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type Slot = {
  slot_id: number;
  slot_details: string;
};

type Props = {
  date: string;
  slot: number | null;
  onDateChange: (val: string) => void;
  onSlotChange: (slotId: number) => void;
};

export default function CheckoutForm({
  date,
  slot,
  onDateChange,
  onSlotChange,
}: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/slots")
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => {
        console.error("Failed to load slots", err);
        setSlots([]);
      });
  }, []);

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Delivery Date
        </label>
        <Input
          type="date"
          value={date}
          min={today}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Delivery Time Slot
        </label>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((s) => (
            <button
              key={s.slot_id}
              type="button"
              onClick={() => onSlotChange(s.slot_id)}
              className={`border px-4 py-2 rounded text-sm text-center ${
                slot === s.slot_id
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white hover:bg-gray-50 border-gray-300"
              }`}
            >
              {s.slot_details}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
