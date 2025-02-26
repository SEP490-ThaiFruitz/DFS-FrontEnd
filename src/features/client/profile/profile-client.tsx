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
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  User,
  Lock,
  MapPin,
  Briefcase,
  ChevronRight,
  MapPinned,
} from "lucide-react";
import { motion } from "framer-motion";
import { OrderTrackingClientPage } from "./order-tracking/order-tracking-client";
import { OrderTrackingPage } from "./order-tracking/order-tracking-page";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import AddressPage from "./address/address-page";
import { useSearchParams } from "next/navigation";


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
  const [tab, setTab] = React.useState(activeTab?? "profile");

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
                    <div className="text-center">
                      <div className="relative w-40 h-40 mx-auto mb-4">
                        <Image
                          src="https://res.cloudinary.com/deojypwtl/image/upload/v1740025338/%C4%90%E1%BB%A9c%20L%C3%AAn%20fs/8edbaec6ea96436e97e56d24d0d7d61a_t1tsw3.png"
                          alt="profile"
                          fill
                          sizes="160px"
                          className="rounded-full object-cover border-4 border-purple-200"
                        />
                        <div className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-2 cursor-pointer hover:bg-purple-600 transition-colors">
                          <Camera className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-1 text-purple-700">
                        Hữu Phúc
                      </h3>
                      <p className="text-muted-foreground">phucdh@gmail.com</p>
                    </div>

                    <Separator className="bg-purple-200" />

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-700">
                        <Lock className="h-5 w-5" /> Thay đổi mật khẩu
                      </h4>
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Mật khẩu hiện tại
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <Input
                          id="new-password"
                          type="password"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Xác nhận mật khẩu
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>

                      <ButtonCustomized
                        label="Cập nhật mật khẩu"
                        className="w-full"
                      />
                      {/* <Button className="w-full bg-purple-500 hover:bg-purple-600">
                          
                      </Button> */}
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-purple-200" />

                <ResizablePanel defaultSize={60} minSize={40} className="p-4">
                  <h4 className="text-xl font-semibold mb-6 text-purple-700">
                    Thông tin cá nhân
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-purple-700">
                        Tên của bạn
                      </Label>
                      <Input
                        id="full-name"
                        placeholder="Nguyễn Văn A"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-purple-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="phucdh@gmail.com"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-purple-700">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+84 123 456 789"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-purple-700">
                        Địa chỉ
                      </Label>
                      <Input
                        id="address"
                        placeholder="FPT University, HCMC"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-purple-700">
                        Thành phố
                      </Label>
                      <Input
                        id="city"
                        placeholder="HCMC"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-purple-700">
                        Country
                      </Label>
                      <Input
                        id="country"
                        placeholder="Việt Nam"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <Button className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Lưu thay đổi <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
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
