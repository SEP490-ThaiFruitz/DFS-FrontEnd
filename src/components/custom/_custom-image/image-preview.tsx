"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  images: string[];
  initialWidth?: number;
  initialHeight?: number;
  className?: string;
  iconButton?: React.ReactNode;
  iconClassName?: string;
  alt?: string;
}

export default function ImagePreview({
  images = [
    "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2834219/pexels-photo-2834219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ],
  initialWidth = 400,
  initialHeight = 400,
  iconButton,
  iconClassName = "h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white ",
  className = "cursor-pointer  hover:opacity-90 transition-opacity rounded-3xl",

  alt,
}: Readonly<ImagePreviewProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      {iconButton ? (
        <Button
          variant={"outline"}
          size={"sm"}
          className={iconClassName}
          onClick={() => setIsOpen(true)}
        >
          {iconButton}
        </Button>
      ) : (
        <Image
          src={images[0]}
          alt={alt || "Image-of-preview"}
          width={initialWidth}
          height={initialHeight}
          className={className}
          onClick={() => setIsOpen(true)}
        />
      )}

      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed z-50 inset-0 bg-black/50 backdrop-blur-sm" />
          <DialogPrimitive.Content className="fixed z-50 w-full left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-transparent border-0">
            <div className="h-full w-full relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/75 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative w-full min-h-screen flex items-center justify-center">
                {images.length > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/75 focus:outline-none"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}
                <DialogPrimitive.Title></DialogPrimitive.Title>
                {/* <Image
                  src={images[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  width={1000}
                  height={1000}
                  className="object-cover max-h-screen py-16 rounded-3xl"
                /> */}

                <div className="relative w-[800px] h-[800px] py-16">
                  <Image
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    fill
                    className="object-cover rounded-3xl"
                    priority
                  />
                </div>

                {images.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/75 focus:outline-none"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
