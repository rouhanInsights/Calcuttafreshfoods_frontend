"use client";

import { Clock, Truck, ShieldCheck, Phone } from "lucide-react";

const links = [
  {
    icon: Clock,
    title: "Today's Deals",
    description: "Limited-time offers",
    link: "#",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Fast and reliable",
    link: "#",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Guaranteed freshness",
    link: "#",
  },
  {
    icon: Phone,
    title: "Customer Support",
    description: "24/7 assistance",
    link: "#",
  },
];

export const QuickLinks = () => {
  return (
    <section className="bg-[#006b3d] text-white py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="overflow-x-auto sm:overflow-visible scrollbar-hide"> */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.link}
                aria-label={link.title}
                className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-start gap-2 sm:gap-3 p-4 sm:p-5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <link.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold leading-snug">
                    {link.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80">
                    {link.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      {/* </div> */}
    </section>
  );
};
