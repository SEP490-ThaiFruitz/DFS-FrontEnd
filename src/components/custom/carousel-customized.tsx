"use client";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import AutoPlay from "embla-carousel-autoplay";

interface CarouselCustomizedProps {
  children?: React.ReactNode;
  title?: string;

  delay?: number;

  stopOnInteraction?: boolean;

  className?: string;

  classNameContent?: string;
}

export const CarouselCustomized = ({
  children,
  title,

  delay = 2500,

  stopOnInteraction = true,
  classNameContent,

  className,
}: CarouselCustomizedProps) => {
  return (
    <>
      {title && (
        <h1 className="my-14 text-center text-4xl font-bold ">{title}</h1>
      )}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          AutoPlay({ delay: delay, stopOnInteraction: stopOnInteraction }),
        ]}
        className={cn("rounded-xl mx-10", className)}
      >
        <CarouselContent className={cn("-ml-4 ", classNameContent)}>
          {children}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};
