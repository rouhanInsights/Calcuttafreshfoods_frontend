"use client";

import React from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircle } from "lucide-react";
type Props = {
  selected: string;
  onChange: (value: string) => void;
};

const paymentOptions = [
  { value: "COD", label: "Cash on Delivery" },
  { value: "UPI", label: "UPI / Google Pay / PhonePe" },
  { value: "NETBANKING", label: "Net Banking" },
  { value: "CARD", label: "Credit / Debit Card" },
];

export default function PaymentOption({ selected, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 mb-2">Select Payment Method</h3>

      <RadioGroup value={selected} onChange={onChange} className="grid gap-3">
        {paymentOptions.map((option) => (
          <RadioGroup.Option
  key={option.value}
  value={option.value}
  className={({ checked }) =>
    `border rounded p-3 cursor-pointer ${
      checked ? "border-green-600 bg-green-100" : "border-gray-300"
    }`
  }
>
  {({ checked }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-black">{option.label}</span>
      {checked && (
        <CheckCircle className="text-green-600" size={18} />
      )}
    </div>
  )}
</RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}