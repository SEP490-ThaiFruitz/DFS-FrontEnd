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
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Briefcase,
  MapPinned,
} from "lucide-react";
import { motion } from "framer-motion";
import { OrderTrackingPage } from "./order-tracking/order-tracking-page";
import AddressPage from "./address/address-page";
import { useSearchParams } from "next/navigation";
import ProfileAvatar from "./avatar";
import ProfilePassword from "./password";
import InformationPersonal from "./information-personal";


const TAB_TRIGGER = [
  { value: "profile", label: "Thông tin cá nhân", icon: User },
  { value: "order-tracking", label: "Theo dõi đơn hàng", icon: MapPin },
  { value: "address", label: "Địa chỉ", icon: MapPinned },
  { value: "statistic", label: "Thống kê", icon: Briefcase },
];

const TAB_CONTENT: { value: string; component: JSX.Element }[] = [
  { value: "profile", component: <div>Profile</div> },
  { value: "order-tracking", component: <OrderTrackingPage /> },
  { value: "address", component: <AddressPage /> },
  { value: "statistic", component: <div>Statistic</div> },
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

        <TabsContent value="profile" className=" p-4">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <CardHeader className="space-y-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="text-3xl font-bold">
                Thông tin cá nhân của bạn
              </CardTitle>
              <CardDescription className="text-purple-100">
                Hãy điền thông tin cá nhân của bạn để chúng tôi có thể phục vụ
                bạn tốt hơn.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 bg-slate-100/90">
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[600px] rounded-lg border bg-card"
              >
                <ResizablePanel defaultSize={40} minSize={30} className="p-4">
                  <div className="flex flex-col gap-6">
                    <ProfileAvatar />
                    <Separator className="bg-purple-200" />
                    <ProfilePassword />
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-purple-200" />

                <ResizablePanel defaultSize={60} minSize={40} className="p-4">
                  <InformationPersonal />
                </ResizablePanel>
              </ResizablePanelGroup>
            </CardContent>
          </MotionCard>
        </TabsContent>

        {TAB_CONTENT.map(
          (content) =>
            content.value !== "profile" && (
              <TabsContent key={content.value} value={content.value}>
                {content.component}
              </TabsContent>
            )
        )}
      </Tabs>
    </div>
  );
};
