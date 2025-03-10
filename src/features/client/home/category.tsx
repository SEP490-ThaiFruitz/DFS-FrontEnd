"use client";
import { CarouselCustomized } from "@/components/custom/carousel-customized";
import CustomSlide from "@/components/global-components/slide/custom-slide";
import { CarouselItem } from "@/components/ui/carousel";
import { Category as CategoryTest } from "@/features/admin/category/column";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Category = () => {
  const categories: CategoryTest[] = [
    {
      id: "1d2c3b7e-4a5f-49a6-9f7e-8d2b9a7e2c5f",
      name: "Trái cây hỗn hợp",
      description: "Trái cây sấy hỗn hợp, giữ nguyên hương vị tự nhiên.",
      thumbnail:
        "https://nuts.com/images/auto/228x152fill/assets/ae16c735a6a560b8.jpg",
    },
    {
      id: "2a5b9c7e-3d8f-49a6-9f7e-1d2c3b7e2a5f",
      name: "Dâu rừng",
      description: "Dâu rừng sấy khô, thơm ngon và bổ dưỡng.",
      thumbnail:
        "https://nuts.com/images/auto/228x152fill/assets/07eb1a837cffa52f.jpg",
    },
    {
      id: "2a5e7b3f-8d1c-49a8-9c7f-3e6d2f9b7e2c",
      name: "Mơ sấy",
      description: "Mơ sấy khô, có vị chua nhẹ và ngọt tự nhiên.",
      thumbnail:
        "https://nuts.com/images/auto/228x152fill/assets/4af094199b2e493a.jpg",
    },
    {
      id: "3b7e9a5c-2d8f-49a6-9c7f-1e2b3d7e2a5f",
      name: "Dứa sấy",
      description: "Dứa sấy khô, giữ được hương vị thơm ngon đặc trưng.",
      thumbnail:
        "https://nuts.com/images/auto/228x152fill/assets/1c33f0880c7183e2.jpg",
    },
    {
      id: "3e8f9a5c-2d7b-49a6-9f7e-1d2c3b7e2a5f",
      name: "Xoài sấy",
      description: "Xoài sấy dẻo, ngọt tự nhiên và giàu vitamin.",
      thumbnail:
        "https://nuts.com/images/auto/228x152fill/assets/e808889d81020418.jpg",
    },
  ];

  return (
    <div className="p-10 sm:p-20">
      {/* <div className="font-bold text-2xl">Danh sách loại sản phẩm</div> */}
      {/* <CustomSlide
        mobile={3}
        tablet={3}
        pc={6}
        data={categories}
        classNameSub="mt-10 p-2 grid grid-cols-2 md:grid-cols-3 gap-10"
      >
        {(category: CategoryTest) => (
          <Link
            href={`/find?category=${category.name}`}
            key={category.id}
            className="border text-center p-1 shadow-sm rounded-md hover:cursor-pointer animate-out hover:scale-105"
          >
            <div>
              <Image
                className="object-cover"
                src={category.thumbnail ?? "/images/third-background.png"}
                alt={category.name}
                height={300}
                width={300}
              />
            </div>
            <div className="font-bold">{category.name}</div>
          </Link>
        )}
      </CustomSlide> */}

      <CarouselCustomized
        title="Các loại sản phẩm"
        className="mx-4"
        delay={2800}
      >
        {categories.map((category: CategoryTest) => {
          return (
            <CarouselItem
              key={category.id}
              className="md:basis-1/2 lg:basis-1/3 pl-4 p-4"
            >
              <Link
                href={`/find?category=${category.name}`}
                key={category.id}
                className="flex flex-col items-center justify-center border text-center p-1 shadow-sm hover:cursor-pointer animate-out hoverAnimate rounded-lg"
                // className="border text-center p-1 shadow-sm rounded-md hover:cursor-pointer animate-out hover:scale-105"
              >
                <div>
                  <Image
                    className="object-cover"
                    src={category.thumbnail ?? "/images/third-background.png"}
                    alt={category.name}
                    height={300}
                    width={300}
                  />
                </div>
                <div className="font-bold">{category.name}</div>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselCustomized>
    </div>
  );
};

export default Category;
