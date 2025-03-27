"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { CarouselCustomized } from "@/components/custom/carousel-customized";
import { CarouselItem } from "@/components/ui/carousel";
import { Category } from "@/features/admin/category/column";
import { ApiResponse } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategorySlide = () => {
  const { data: categories } = useFetch<ApiResponse<Category[]>>(
    "/Categories/get-all-non-paging",
    ["Categories", "Home"]
  );

  return (
    <div className="p-10 sm:p-20">
      <CarouselCustomized
        title="Các loại sản phẩm"
        className="mx-4"
        delay={2800}
      >
        {categories?.value?.map((category: Category) => {
          return (
            <CarouselItem
              key={category.id}
              className="md:basis-1/2 lg:basis-1/3 pl-4 p-4 "
            >
              <Link
                href={`/find?category=${category.name}`}
                key={category.id}
                className="flex flex-col items-center justify-center border text-center p-1 shadow-sm hover:cursor-pointer animate-out hoverAnimate rounded-lg cardStyle"
              >
                <div>
                  <Image
                    className="object-cover"
                    src={category.thumbnail ?? "/images/third-background.png"}
                    alt={category.name}
                    height={200}
                    width={200}
                  />
                </div>
                <h1 className="font-bold text-slate-700 font-7xl">
                  {category.name}
                </h1>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselCustomized>
    </div>
  );
};

export default CategorySlide;
