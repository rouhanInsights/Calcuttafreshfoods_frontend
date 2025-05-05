"use client";

import { Clock, Truck, ShieldCheck, Phone } from "lucide-react";

const links = [
  {
    icon: Clock,
    title: "Today's Deals",
    description: "Limited-time offers",
    link: "#"
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Fast and reliable",
    link: "#"
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Guaranteed freshness",
    link: "#"
  },
  {
    icon: Phone,
    title: "Customer Support",
    description: "24/7 assistance",
    link: "#"
  }
];

export const QuickLinks = () => {
  return (
    <section  style={{ backgroundColor: "#81991f", color: "#ffffff" }} className="py-8 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
          {links.map((link, index) => (
            <a 
              key={index}
              href={link.link}
              aria-label={link.title}
              className={`flex items-center gap-3 p-6 hover:bg-trendy-600 transition-transform transform hover:scale-105
                ${index !== links.length - 1 ? "border-r border-white/70" : ""}
              `}
            >
              <link.icon className="h-8 w-8 text-white" />
              <div>
                <h3 className="font-medium">{link.title}</h3>
                <p className="text-white/80 text-sm">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
