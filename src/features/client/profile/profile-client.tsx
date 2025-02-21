"use client";

import React, { type JSX } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";

const TAB_TRIGGER = [
  { value: "profile", label: "Thông tin cá nhân", icon: User },
  { value: "order-tracking", label: "Theo dõi đơn hàng", icon: MapPin },
  { value: "statistic", label: "Thống kê", icon: Briefcase },
];

const TAB_CONTENT: { value: string; component: JSX.Element }[] = [
  { value: "profile", component: <div>Profile</div> },
  { value: "order-tracking", component: <div>Order Tracking</div> },
  { value: "statistic", component: <div>Statistic</div> },
];

const MotionCard = motion(Card);

export const ProfileClientPage = () => {
  const [tab, setTab] = React.useState("profile");

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

        <TabsContent value="profile">
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

            <CardContent className="p-6">
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
                        John Doe
                      </h3>
                      <p className="text-muted-foreground">
                        john.doe@example.com
                      </p>
                    </div>

                    <Separator className="bg-purple-200" />

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-700">
                        <Lock className="h-5 w-5" /> Change Password
                      </h4>
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-purple-200" />

                <ResizablePanel defaultSize={60} minSize={40} className="p-4">
                  <h4 className="text-xl font-semibold mb-6 text-purple-700">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-purple-700">
                        Full Name
                      </Label>
                      <Input
                        id="full-name"
                        placeholder="John Doe"
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
                        placeholder="john.doe@example.com"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-purple-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-purple-700">
                        Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-purple-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-purple-700">
                        Country
                      </Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <Button className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Save Changes <ChevronRight className="ml-2 h-4 w-4" />
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
