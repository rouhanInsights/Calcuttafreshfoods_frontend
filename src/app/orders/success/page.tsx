import { Suspense } from "react";
import OrderSuccessClient from "@/components/Orders/OrderSuccessClient";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading order info...</div>}>
      <OrderSuccessClient />
    </Suspense>
  );
}