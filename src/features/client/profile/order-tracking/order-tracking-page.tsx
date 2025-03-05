"use client";

import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderHeader } from "./order-header";
import { ProductList } from "./product-list";
import { ShippingInfo } from "./shipping-info";
import { OrderSummary } from "./order-summary";
import { Policies } from "./policy";
import { ArrowLeft, Columns4, DollarSign, Download, FileBox, FileText, MessageSquareQuote, PackageCheck, PackagePlus, PackageX, Search, Star, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Timeline, { TimelineEvent } from "@/components/global-components/timeline/timeline";

const MotionCard = motion.div;

export const OrderTrackingPage = () => {
  const status = [
    { value: "all", label: "Tất cả", icon: Columns4 },
    { value: "waiting", label: "Chờ xác nhận", icon: FileBox },
    { value: "packing", label: "Đang đóng gói", icon: PackagePlus },
    { value: "delivering", label: "Đang vận chuyển", icon: Truck },
    { value: "delivered", label: "Đã giao hàng", icon: PackageCheck },
    { value: "feedbacked", label: "Đã đánh giá", icon: MessageSquareQuote },
    { value: "canceled", label: "Đã hủy", icon: PackageX },
  ];

  const [activeStatus, setActiveStatus] = useState("all");
  const isOrder = true;
  const steps: TimelineEvent[] = [
    {
      icon: FileText,
      title: "Đơn Hàng Đã Đặt",
      date: "19:47 23-02-2025",
      completed: true,
      subEvents: [
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }
      ]
    },
    {
      icon: DollarSign,
      title: "Đã Xác Nhận Thông Tin Thanh Toán",
      date: "20:18 23-02-2025",
      completed: true,
    },
    {
      icon: Truck,
      title: "Đã Giao Cho ĐVVC",
      date: "10:24 24-02-2025",
      completed: true,
    },
    {
      icon: Download,
      title: "Đã Nhận Được Hàng",
      date: "12:06 25-02-2025",
      completed: true,
    },
    {
      icon: Star,
      title: "Đơn Hàng Đã Được Đánh Giá",
      date: "18:57 05-03-2025",
      completed: true,
    },
  ]
  return (
    isOrder ? <div>
      <div className="bg-white">
        <div className="flex items-center bg-white">
          <button className="h-fit  py-3 px-2 rounded-md flex items-center gap-2 hover:bg-slate-50">
            <ArrowLeft />
            <p className="w-fit text-nowrap">Quay lại</p>
          </button>
          <p className="w-full text-center font-bold text-xl">Order OD CXVADAS1231231231445</p>
        </div>
        <div className="my-20">
          <Timeline events={steps} orientation="Vertical" showIcon={true} />
        </div>
      </div>
    </div> : <>
      <div className="grid w-full grid-cols-7 h-auto py-4 mb-4 bg-white rounded-md px-5">
        {status.map((trigger) => (
          <button
            key={trigger.value}
            className={`flex items-center justify-center gap-2 py-3 transition-all duration-200 ease-in-out font-bold rounded-sm ${activeStatus === trigger.value
              ? "bg-slate-100 text-slate-700"
              : "hover:bg-gray-100"
              }`}
            onClick={() => setActiveStatus(trigger.value)}
          >
            <trigger.icon className="h-5 w-5" />
            <span className="hidden lg:inline">{trigger.label}</span>
          </button>
        ))}
      </div>
      <div className="py-2 flex items-center space-x-2 mb-4 w-full">
        <div className="relative w-full">
          <Input
            placeholder="Tìm kiếm đơn hàng"
            className="h-14 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button className="h-14 px-6 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200">
          Tìm kiếm
        </Button>
      </div>
      <div className="min-h-screen grid lg:grid-cols-2 gap-10">
        {/* <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center"> */}
        {[...Array(4)].map((index: number) => (
          <MotionCard
            key={index + 1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white/60 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-200 shadow-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <OrderHeader />
            <CardContent className="p-6 space-y-6">
              <ScrollArea className="h-[220px] -mx-6 px-6">
                <ProductList />
              </ScrollArea>
              <div className="grid gap-6 sm:grid-cols-2">
                <ShippingInfo />
                <OrderSummary />
              </div>
              <Policies />
            </CardContent>
          </MotionCard>
        ))}
      </div>
    </>
  );
};
