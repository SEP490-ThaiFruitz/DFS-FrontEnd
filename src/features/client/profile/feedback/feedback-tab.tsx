"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import { ApiResponse, PageResult } from "@/types/types";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { Button } from "@/components/ui/button";
import { Images, Pencil } from "lucide-react";
import { FeedbackDialog } from "@/components/custom/_custom-dialog/feedback-dialog";
import ImagePreview from "@/components/custom/_custom-image/image-preview";
import Image from "next/image";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import Link from "next/link";

interface ProductVariant {
  packagingType: string;
  netWeight: number;
  image: string;
}

interface Feedback {
  id: string;
  orderItemId: string;
  productId: string;
  productName: string;
  productImage: string;
  type: string;
  productVariant: ProductVariant;
  quantity: number;
  content: string;
  rating: number;
  images: string[];
  createdOnUtc: string;
}

const FeedbackTab = () => {
  const { data: feedbacks, isPending } = useFetch<
    ApiResponse<PageResult<Feedback>>
  >("/Feedbacks/user?pageIndex=1&pageSize=100", ["feedbacks", "user"]);
  const [feedback, setFeedback] = useState<Feedback | undefined>(undefined);
  return (
    <>
      {isPending ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index + 1}
            className="p-4 flex justify-between items-center gap-6 motion-preset-slide-right motion-duration-500"
          >
            <Skeleton className="h-32 w-32 bg-white animate-pulse shadow-md" />
            <Skeleton className="h-10 w-80 bg-white animate-pulse shadow-md" />
            <Skeleton className="h-10 w-40 bg-white animate-pulse shadow-md" />
            <Skeleton className="h-10 w-40 bg-white animate-pulse shadow-md" />
          </div>
        ))
      ) : (
        <div className="space-y-2 motion-preset-slide-right motion-duration-500">
          <div className="hidden p-4 sm:grid grid-cols-1 md:grid-cols-6 lg:grid-cols-7 items-center gap-4 bg-white">
            <div>Ảnh sản phẩm</div>
            <div>Tên sản phẩm</div>
            <div className="lg:col-span-2">Nội dung</div>
            <div className="text-center">Số sao</div>
            <div className="text-center">Thời gian</div>
            <div></div>
          </div>

          {feedbacks?.value?.items?.map((feedback: Feedback) => (
            <div
              key={feedback.id}
              className="p-4 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-7 items-center gap-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <Link
                href={`/product-detail/${feedback.productId}`}
                className="mx-auto md:ml-0"
              >
                <Image
                  src={feedback.productImage || "/images/dried-fruit.webp"}
                  height={1000}
                  width={1000}
                  alt={feedback.productName}
                  className="h-26 w-26 object-fill hover:cursor-pointer rounded-3xl"
                />
              </Link>
              <p className="font-bold text-center md:text-left">
                {`${feedback.productName} 
                                ${feedback.productVariant.packagingType} 
                                (số lượng ${feedback.quantity})`}
              </p>
              <p className="md:col-span-2">{feedback.content}</p>
              <p className="text-center">
                {feedback.rating} <span className="text-yellow-500">⭐</span>
              </p>
              <p className="text-center">
                {formatTimeVietNam(new Date(feedback.createdOnUtc), true)}
              </p>
              <p className="space-x-4 mx-auto">
                {feedback.images && (
                  <ImagePreview
                    iconButton={<Images />}
                    images={feedback.images}
                    className="h-26 w-26 object-fill hover:cursor-pointer rounded-3xl"
                  />
                )}
                <Button
                  variant="outline"
                  className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                  onClick={() => setFeedback(feedback)}
                >
                  <Pencil />
                </Button>
              </p>
            </div>
          ))}
        </div>
      )}
      {feedback && (
        <FeedbackDialog
          content={feedback.content}
          stars={feedback.rating}
          refreshKey={["feedbacks", "user"]}
          orderItemId={feedback.orderItemId}
          isUpdateFeedback={true}
          isOpen={feedback !== undefined}
          onClose={() => setFeedback(undefined)}
        />
      )}
    </>
  );
};

export default FeedbackTab;
