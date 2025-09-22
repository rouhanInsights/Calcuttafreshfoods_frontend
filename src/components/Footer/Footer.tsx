"use client";
import React from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
            <Image
                src="/images/logo.png"
                width={300}
                height={200}
                alt="Picture of the author"
                />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Premium quality fresh meat and seafood delivered to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/category/2" className="text-gray-400 hover:text-white">Fish & Seafood</Link ></li>
              <li><Link href="/category/4" className="text-gray-400 hover:text-white">Poultry</Link></li>
              <li><Link href="/category/3" className="text-gray-400 hover:text-white">Mutton</Link></li>
              <li><Link href="/category/5" className="text-gray-400 hover:text-white">Steak & Fillets</Link></li>
              <li><Link href="/category/1" className="text-gray-400 hover:text-white">Exclusive Fish & Meat</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="/TermsandCondition" className="text-gray-400 hover:text-white">Terms & Conditions</a></li>
              <li><a href="/PrivacyPolicy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Return Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            {/* <p className="text-gray-400 mb-2">
              Kolkata, West Bengal, India, 700000
            </p> */}
            <p className="text-gray-400 mb-2">
              Phone: +91 9123929282
            </p>
            <p className="text-gray-400 mb-2">
              Email: calcuttafreshfoods1@gmail.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} calcuttafreshfoods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};