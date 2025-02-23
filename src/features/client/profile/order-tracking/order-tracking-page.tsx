"use client";

import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderHeader } from "./order-header";
import { ProductList } from "./product-list";
import { ShippingInfo } from "./shipping-info";
import { OrderSummary } from "./order-summary";
import { Policies } from "./policy";

const MotionCard = motion.div;

export const OrderTrackingPage = () => {
  return (
    <div className="min-h-screen ">
      {/* <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center"> */}
      <MotionCard
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
    </div>
  );
};
