import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const ProductOfferBanner = () => {
  return (
    <div
      className="text-white py-4 px-4 md:px-8"
      style={{ background: "linear-gradient(to right, #81991f, #6fa31e)" }} // Optional second shade for gradient effect
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded">
            EXCLUSIVE OFFER
          </span>
          <p className="font-medium">
            Get Fresh Products everyday only on{" "}
            <span className="font-bold">CALCUTTA FRESH FOODS</span>
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-white hover:text-[#81991f] transition-colors"
        >
          Shop Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
