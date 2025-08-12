"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeedbackModalButton({
  token,
  orderId,
}: {
  token: string;
  orderId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [ratingProduct, setRatingProduct] = useState(0); // starts at 0
  const [ratingDA, setRatingDA] = useState(0);           // starts at 0
  const [commentProduct, setCommentProduct] = useState("");
  const [commentDA, setCommentDA] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!commentProduct || !commentDA) {
      alert("Please provide comments for both product and delivery.");
      return;
    }

    if (ratingProduct === 0 || ratingDA === 0) {
      alert("Please give a rating for both product and delivery.");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        rating_product: ratingProduct,
        comment_product: commentProduct,
        rating_da: ratingDA,
        comment_da: commentDA,
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => setIsOpen(false), 1500);
    } else {
      alert("Failed to submit feedback");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-[#8BAD2B] text-[#8BAD2B] hover:bg-[#f5fdec]"
        onClick={() => setIsOpen(true)}
      >
        Leave Feedback
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <DialogPanel className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4">
            <DialogTitle className="text-lg font-bold text-gray-800">Feedback</DialogTitle>

            {submitted ? (
              <p className="text-green-600 text-sm">✅ Feedback submitted successfully!</p>
            ) : (
              <>
                {/* Product Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <Star
                        key={val}
                        className={`w-6 h-6 cursor-pointer ${
                          val <= ratingProduct ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill={val <= ratingProduct ? "#facc15" : "none"}
                        onClick={() => setRatingProduct(val)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="mt-2 w-full border rounded p-2 text-sm"
                    placeholder="Describe your experience with the product"
                    value={commentProduct}
                    onChange={(e) => setCommentProduct(e.target.value)}
                    required
                  />
                </div>

                {/* Delivery Agent Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Agent Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <Star
                        key={val}
                        className={`w-6 h-6 cursor-pointer ${
                          val <= ratingDA ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill={val <= ratingDA ? "#facc15" : "none"}
                        onClick={() => setRatingDA(val)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="mt-2 w-full border rounded p-2 text-sm"
                    placeholder="Describe your experience with the delivery agent"
                    value={commentDA}
                    onChange={(e) => setCommentDA(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="mt-4 w-full bg-[#8BAD2B] text-white py-2 rounded hover:bg-[#7b9c24]"
                  onClick={handleSubmit}
                >
                  Submit Feedback
                </button>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}