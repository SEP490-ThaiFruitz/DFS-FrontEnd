import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";

import AutoPlay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { CarouselCustomized } from "@/components/custom/carousel-customized";

interface CustomSlideProps<T> {
  mobile: number;
  tablet: number;
  pc: number;
  children: (item: T) => React.ReactNode;
  classNameSlide?: string;
  classNameSub: string;
  data: T[];
}

function CustomSlide<T>({
  mobile,
  tablet,
  pc,
  children,
  classNameSlide,
  data,
  classNameSub,
}: Readonly<CustomSlideProps<T>>) {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        setColumns(pc);
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setColumns(tablet);
      } else {
        setColumns(mobile);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [mobile, tablet, pc]);

  return (
    // <Carousel
    //   className={cn("w-fit group", classNameSlide)}
    //   opts={{
    //     align: "start",
    //     loop: true,
    //   }}
    //   plugins={[AutoPlay({ delay: 2500, stopOnInteraction: false })]}
    // >
    //   <CarouselContent>
    //     {data
    //       ?.reduce((acc: T[][], item: T, index: number) => {
    //         if (index % columns === 0) acc.push([]);
    //         acc[acc.length - 1].push(item);
    //         return acc;
    //       }, [])
    //       .map((group: T[], groupIndex: number) => (
    //         <CarouselItem className="hover:cursor-pointer" key={groupIndex + 1}>
    //           <div className={classNameSub}>
    //             {group.map((item) => children(item))}
    //           </div>
    //         </CarouselItem>
    //       ))}
    //   </CarouselContent>

    //   {/* <CarouselPrevious /> */}
    //   {/* <CarouselNext /> */}
    //   <CarouselPrevious className="hidden group-hover:block" />
    //   <CarouselNext className="hidden group-hover:block" />
    // </Carousel>

    <CarouselCustomized title="Sự kiện giảm giá">
      {data.map((item: any) => {
        return (
          <CarouselItem className="hover:cursor-pointer" key={item?.id}>
            <div>{children(item)}</div>
          </CarouselItem>
        );
      })}
    </CarouselCustomized>
  );
}

export default CustomSlide;
