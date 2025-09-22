"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isValidPhone = (value: string) =>
    /^\d{10}$/.test(value.trim());

  const isValidEmail = (value: string) =>
    /^\S+@\S+\.\S+$/.test(value.trim());

  const handleSendOtp = async () => {
    setSending(true);
    setError("");

    const input = identifier.trim();
    const isPhone = isValidPhone(input);
    const isEmail = isValidEmail(input);

    if (!isPhone && !isEmail) {
      setError("Please enter a valid 10-digit phone number or email.");
      setSending(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isPhone ? { phone: input } : { email: input }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("temp_user", input);
        router.push("/otp");
      } else {
        setError(data.error || "Failed to send OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f8ed] to-[#ecf4e2] flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md space-y-5 border border-[#e5eed6]">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          🔐 Login with OTP
        </h2>

        <Input
          type="text"
          placeholder="Phone or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8BAD2B] bg-white/80 placeholder-gray-500 text-sm"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          onClick={handleSendOtp}
          disabled={sending || !identifier}
          className="w-full bg-[#046B3B] hover:bg-[#18A558] text-white py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send OTP"}
        </Button>
      </div>
    </div>
  );
}
