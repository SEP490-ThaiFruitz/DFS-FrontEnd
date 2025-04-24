"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { CarouselCustomized } from "@/components/custom/carousel-customized";
import { CarouselItem } from "@/components/ui/carousel";
import { Category } from "@/features/category/list-category";
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
                className="group flex flex-col items-center justify-center border rounded-2xl bg-white p-3 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
              >
                <div className="w-[150px] h-[120px] overflow-hidden rounded-lg aspect-[4/3]">
                  <Image
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    src={category.thumbnail ?? "/images/third-background.png"}
                    alt={category.name}
                    width={150}
                    height={120}
                    quality={80}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
                <h1 className="mt-2 text-xl  font-bold text-slate-700 text-center">
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
