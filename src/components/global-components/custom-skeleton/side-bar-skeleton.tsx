"use client";

import { useEffect, useState } from "react";
import AnimatedLoadingSkeleton from "./animated-loading-skeleton";

export default function ProductSkeletonWithSidebar() {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-4 p-4 bg-gray-50">
      {/* Sidebar skeleton - now with rounded-3xl */}
      <div className="w-full md:w-64 bg-white rounded-3xl shadow-sm p-5 h-fit">
        {/* Logo and search */}
        <div className="mb-6">
          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse mb-4"></div>
          <div className="relative">
            <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse"></div>
            <div className="absolute left-3 top-3 h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Filter sections */}
        <div className="mb-6">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-5 ml-auto bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            ))}
        </div>

        <div className="mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {Array(6)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="h-7 w-20 bg-gray-200 rounded-full animate-pulse"
                ></div>
              ))}
          </div>
        </div>

        {/* Checkbox filters like in the image */}
        <div className="mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 border border-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
        </div>

        {/* Tags section */}
        <div className="mb-6">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="h-7 px-3 bg-gray-200 rounded-full animate-pulse"
                ></div>
              ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
          {Array(5)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 border border-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Discount badge */}
                  <div className="relative">
                    <div className="absolute top-2 right-2">
                      <div className="h-6 w-16 bg-pink-200 rounded-md animate-pulse"></div>
                    </div>

                    {/* Product image */}
                    <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
                  </div>

                  {/* Product info */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>

                    {/* Category */}
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Loại:</div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Description */}
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Gói:</div>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Weight */}
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Trọng lượng:</div>
                      <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Short description */}
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>

                    {/* Price and add to cart */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-10 w-10 bg-green-100 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
        {/* <div className="text-center py-10"> */}
        <AnimatedLoadingSkeleton className="min-w-full" />
        {/* </div> */}
      </div>
    </div>
  );
}
