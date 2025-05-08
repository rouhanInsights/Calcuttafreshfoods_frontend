"use client";
import React from "react";
import Image from "next/image";
export const MobileApp = () => {
  return (
    <section className="py-12 bg-green-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Section */}
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Download Our Mobile App for a Better Experience
            </h2>
            <p className="text-gray-600 mb-6">
              Order fresh meat and seafood on the go with our easy-to-use mobile
              app. Get exclusive app-only offers and track your delivery in
              real-time!
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="bg-gray-900 hover:bg-gray-800 p-2 rounded-lg flex items-center"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
                  alt="Get it on Google Play"
                  className="h-10"
                  width={150}
                  height={45}
                />
              </a>
              <a
                href="#"
                className="bg-gray-900 hover:bg-gray-800 p-2 rounded-lg flex items-center"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1200px-Download_on_the_App_Store_Badge.svg.png"
                  alt="Download on App Store"
                  className="h-10"
                  width={150}
                  height={45}
                />
              </a>
            </div>
          </div>

          {/* Mobile App Screenshot Section */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="bg-gray-200 rounded-lg h-80 w-60 flex items-center justify-center">
              <p className="text-gray-500 text-center px-4">
                Mobile App Screenshot
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
