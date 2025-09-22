"use client";
import React from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#F3F4EB] text-[#0C2D48] pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
            <Image
                src="/logo.png"
                width={300}
                height={200}
                priority={false}
                alt="Picture of the author"
                />
            </div>
            <p className="text-[#0C2D48] text-b mb-4">
              Premium quality fresh meat and seafood delivered to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#050A30] hover:text-[#009E5A]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#050A30] hover:text-[#009E5A]">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#050A30] hover:text-[#009E5A]">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#050A30] hover:text-[#009E5A]">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/category/2" className="text-[#002d1a] hover:text-[#006037]">Fish & Seafood</Link ></li>
              <li><Link href="/category/4" className="text-[#002d1a] hover:text-[#006037]">Poultry</Link></li>
              <li><Link href="/category/3" className="text-[#002d1a] hover:text-[#006037]">Mutton</Link></li>
              <li><Link href="/category/5" className="text-[#002d1a] hover:text-[#006037]">Steak & Fillets</Link></li>
              <li><Link href="/category/1" className="text-[#002d1a] hover:text-[#006037]">Exclusive Fish & Meat</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#002d1a] hover:text-[#006037]">About Us</a></li>
              <li><a href="#" className="text-[#002d1a] hover:text-[#006037]">Contact Us</a></li>
              <li><a href="/TermsandCondition" className="text-[#002d1a] hover:text-[#006037]">Terms & Conditions</a></li>
              <li><a href="/PrivacyPolicy" className="text-[#002d1a] hover:text-[#006037]">Privacy Policy</a></li>
              <li><a href="#" className="text-[#002d1a] hover:text-[#006037]">Return Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            {/* <p className="text-[#002d1a] hover:text-[#006037] mb-2">
              Kolkata, West Bengal, India, 700000
            </p> */}
            <p className="text-[#002d1a] hover:text-[#006037] mb-2">
              Phone: +91 9123929282
            </p>
            <p className="text-[#002d1a] hover:text-[#006037] mb-2">
              Email: calcuttafreshfoods1@gmail.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-[#002d1a] text-sm md:text-base ">
          <p>&copy; {new Date().getFullYear()} calcuttafreshfoods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};