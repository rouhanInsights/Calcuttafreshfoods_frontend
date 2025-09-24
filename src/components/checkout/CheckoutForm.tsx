"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";

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

function getNextThreeValidDates(): Date[] {
  const validDates: Date[] = [];
  const today = new Date();

  // ✅ Include today if it's not Monday
  if (today.getDay() !== 1) {
    validDates.push(new Date(today));
  }

  const dateCursor = new Date(today);
  while (validDates.length < 4) {
    dateCursor.setDate(dateCursor.getDate() + 1);
    const next = new Date(dateCursor);
    if (next.getDay() !== 1) {
      validDates.push(new Date(next));
    }
  }

  return validDates;
}

export default function CheckoutForm({
  date,
  slot,
  onDateChange,
  onSlotChange,
}: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [allowedDates, setAllowedDates] = useState<Date[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/slots`)
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => {
        console.error("Failed to load slots", err);
        setSlots([]);
      });

    setAllowedDates(getNextThreeValidDates());
  }, []);

  // 🧠 Smart logic for slot disabling
  const now = new Date();
  const selectedDateObj = date ? parseISO(date) : null;
  const isSameDay =
    selectedDateObj && now.toDateString() === selectedDateObj.toDateString();
  const isAfter6AM = now.getHours() >= 6;
  const isAfter9AM = now.getHours() >= 9;

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Delivery Date
        </label>
        <div className="w-full">
          <DatePicker
            selected={date ? parseISO(date) : null}
            onChange={(val: Date | null) => {
              if (val) {
                const localDate = new Date(
                  val.getFullYear(),
                  val.getMonth(),
                  val.getDate()
                );
                onDateChange(format(localDate, "yyyy-MM-dd"));
              }
            }}
            includeDates={allowedDates}
            placeholderText="Choose a valid date 🗓️"
            className="w-full border font-bold text-black rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none cursor-pointer"
            dateFormat="MMMM do, yyyy"
            dayClassName={(d) =>
              d.getDay() === 1
                ? "text-red-500 bg-red-50 pointer-events-none"
                : ""
            }
            renderDayContents={(day, d) =>
              d.getDay() === 1 ? (
                <span title="Closed on Mondays">{day}</span>
              ) : (
                <span>{day}</span>
              )
            }
            calendarClassName="border rounded-lg shadow-lg"
            wrapperClassName="w-full"
          />
        </div>
        <p className="text-sm text-red-500 mt-1">
          * Only next 3 delivery days from today are available (Mondays are
          closed)
        </p>
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Delivery Time Slot
        </label>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((s) => {
            const isSlot1 = s.slot_id === 1;
            const isSlot2 = s.slot_id === 2;
            const disableSlot = Boolean(
              (isSameDay && isAfter6AM && isSlot1) || (isSameDay && isAfter9AM && isSlot2)
            );

            return (
              <button
                key={s.slot_id}
                type="button"
                onClick={() => !disableSlot && onSlotChange(s.slot_id)}
                disabled={disableSlot}
                className={`border px-4 py-2 rounded text-sm text-center transition ${
                  slot === s.slot_id
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white hover:bg-gray-50 border-gray-300"
                } ${disableSlot ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {s.slot_details}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
