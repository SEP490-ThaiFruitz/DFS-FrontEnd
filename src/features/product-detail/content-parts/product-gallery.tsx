"use client";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Certificate } from "../product-detail.types";
import { Promotion } from "@/hooks/use-cart-store";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  tags: string[];
  promotion: Promotion | null;
  handleToggleWishlist: () => void;
  handleShare: () => void;
  isInWishlist: boolean;
  productCertification: Certificate[];
}

export default function ProductGallery({
  images,
  productName,
  currentImageIndex,
  setCurrentImageIndex,
  tags,
  promotion,
  handleToggleWishlist,
  handleShare,
  isInWishlist,
  productCertification,
}: ProductGalleryProps) {
  const handlePrevImage = () => {
    setCurrentImageIndex((prev: number) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev: number) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };
  return (
    // <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
    <div className="p-6 lg:p-8 ">
      <div className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <div
              className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer group"
              style={{ display: "block" }}
            >
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={productName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={90}
                className="object-cover rounded-3xl transition-all duration-300 group-hover:scale-105 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md"
                priority
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              {tags.includes("Organic") && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  Organic
                </div>
              )}
              {promotion && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  -{promotion.percentage}%
                </div>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết ảnh</DialogTitle>
              <DialogDescription>
                Bạn có thể xem ảnh chi tiết sản phẩm tại đây.
              </DialogDescription>
            </DialogHeader>

            <div
              className="relative aspect-square rounded-3xl "
              style={{ display: "block" }}
            >
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={productName}
                fill
                sizes="(max-width: 1200px) 100vw, 80vw"
                loading="lazy"
                className="object-cover rounded-3xl transition-all duration-300"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Thumbnails */}
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x scrollbar-hide mt-2 p-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden snap-start transition-all duration-200 ${
                currentImageIndex === index
                  ? "ring-2 ring-sky-500 shadow-md scale-105"
                  : "border border-gray-200 hover:border-sky-200 hover:shadow-sm"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${productName} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover "
                sizes="80px"
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3C/svg%3E"
              />
            </button>
          ))}
        </div>

        {/* Product Actions - Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleWishlist}
            className={
              isInWishlist ? "text-rose-500 border-rose-200 bg-rose-50" : ""
            }
          >
            <Heart
              className={`h-5 w-5 ${isInWishlist ? "fill-rose-500" : ""}`}
            />
            <span className="sr-only">
              {isInWishlist
                ? "Xóa khỏi danh sách yêu thích"
                : "Thêm vào danh sách yêu thích"}
            </span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Chia sẻ sản phẩm</span>
          </Button>
        </div>

        {/* Certification badges - Mobile */}
        <div className="flex flex-wrap gap-2 lg:hidden">
          {productCertification.slice(0, 3).map((cert) => (
            <TooltipProvider key={cert.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gray-100 p-2 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{cert.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
