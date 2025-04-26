"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberWithUnit } from "@/lib/format-currency";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { ApiResponse, PageResult } from "@/types/types";
import React from "react";

interface Point {
  id: string;
  point: number;
  content: string;
  createdOnUtc: string;
}

const PointTab = () => {
  const { isPending, data: pointsHistory } = useFetch<
    ApiResponse<PageResult<Point>>
  >("/PointHistories", ["PointHistories"]);
  console.log(pointsHistory);
  return isPending ? (
    Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index + 1}
        className="p-4 grid grid-cols-3 items-center gap-6 bg-white motion-preset-slide-right motion-duration-500"
      >
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))
  ) : (
    <div className="space-y-2 motion-preset-slide-right motion-duration-500">
      <div className="p-4 grid grid-cols-3 items-center gap-6 bg-white">
        <div className="text-center">Nội dung</div>
        <div className="text-center">Số điểm</div>
        <div className="text-center">Thời gian</div>
      </div>

      {pointsHistory?.value?.items.map((point: Point) => (
        <div
          key={point.id}
          className="p-4 grid grid-cols-3 items-center gap-6 hover:cursor-pointer hover:bg-slate-50 bg-white mb-2 border-t-2 transition-colors"
        >
          <p className="text-center md:text-left">{point.content}</p>
          <p
            className={`text-xl font-bold text-center ${
              point.point > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {point.point > 0
              ? `+${formatNumberWithUnit(point.point, "điểm")}`
              : `${formatNumberWithUnit(point.point, "điểm")}`}
          </p>
          <p className="text-center">
            {formatTimeVietNam(new Date(point.createdOnUtc), true)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PointTab;
