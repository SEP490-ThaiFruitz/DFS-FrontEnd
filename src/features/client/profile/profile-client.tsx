"use client";

import React, { useMemo, type JSX } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  MapPin,
  MapPinned,
  Flame,
  Ticket,
  ChartPie,
  MessageSquareDiff,
} from "lucide-react";
import { motion } from "framer-motion";
import { OrderTrackingPage } from "./order-tracking/order-tracking-page";
import { useSearchParams } from "next/navigation";
import InformationTab from "./information/information";
import AddressTab from "./address/address-tab";
import PointTab from "./point/point-tab";
import VoucherTab from "./voucher/voucher-tab";
import FeedbackTab from "./feedback/feedback-tab";


const TAB_TRIGGER = [
  { value: "profile", label: "Thông tin cá nhân", icon: User },
  { value: "order-tracking", label: "Theo dõi đơn hàng", icon: MapPin },
  { value: "address", label: "Địa chỉ", icon: MapPinned },
  { value: "point", label: "Tích lũy điểm", icon: Flame },
  { value: "voucher", label: "Mã giảm giá", icon: Ticket },
  { value: "statistic", label: "Thống kê", icon: ChartPie },
  { value: "feedback", label: "Đánh giá", icon: MessageSquareDiff },
];

const TAB_CONTENT: { value: string; component: JSX.Element, title: string, description: string }[] = [
  { value: "profile", component: <InformationTab />, title: "Thông tin cá nhân của bạn", description: "Hãy điền thông tin cá nhân của bạn để chúng tôi có thể phục vụ bạn tốt hơn." },
  { value: "order-tracking", component: <OrderTrackingPage />, title: "Đơn hàng của bạn", description: "Theo dõi đơn đặt hàng và quản lý mua sắm hiệu quả hơn!" },
  { value: "address", component: <AddressTab />, title: "Địa chỉ giao hàng của bạn", description: " Cung cấp thông tin địa chị giao hàng thuận tiện cho việc mua hàng sau này!" },
  { value: "point", component: <PointTab />, title: "Lịch sử tích lũy điểm", description: "Theo dõi số điểm đã tích lũy và đổi thưởng một cách dễ dàng!" },
  { value: "voucher", component: <VoucherTab />, title: " Mã giảm giá của bạn", description: "Xem và sử dụng mã giảm giá để tiết kiệm khi mua hàng!." },
  { value: "statistic", component: <div>Statistic</div>, title: "Báo cáo chi tiêu", description: "Theo dõi tổng số tiền bạn đã chi tiêu để quản lý tài chính hiệu quả hơn." },
  { value: "feedback", component: <FeedbackTab />, title: "Phản hồi & Đánh giá", description: "Xem và quản lý phản hồi của bạn để cải thiện trải nghiệm sử dụng." }
];

export const MotionCard = motion(Card);

export const ProfileClientPage = () => {
  const searchParams = useSearchParams();
  const activeTab = useMemo(() => searchParams.get("tab"), [searchParams]);
  const [tab, setTab] = React.useState(activeTab ?? "profile");

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Tabs value={tab} onValueChange={setTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted rounded-xl shadow-md">
          {TAB_TRIGGER.map((trigger) => (
            <TabsTrigger
              key={trigger.value}
              value={trigger.value}
              className="flex items-center gap-2 py-3 transition-all duration-200 ease-in-out"
            >
              <trigger.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{trigger.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TAB_CONTENT.map(
          (content) =>
          (
            <TabsContent key={content.value} value={content.value}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <CardHeader className="space-y-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="text-3xl font-bold">
                    {content.title}
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    {content.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-slate-100/90">
                  {content.component}
                </CardContent>
              </MotionCard>
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
};
