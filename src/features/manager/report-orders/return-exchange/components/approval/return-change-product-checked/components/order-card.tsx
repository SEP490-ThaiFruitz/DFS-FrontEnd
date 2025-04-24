"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Captions,
  ChartNoAxesGanttIcon,
  PackageIcon,
  RefreshCw,
} from "lucide-react";
import OrderHeader from "./order-header";
import ItemsTabContent from "../tabs/item-tab-content";
import StatusTabContent from "../tabs/status-tab-content";
import TimelineTabContent from "../tabs/time-line-tab-content";
import { GroupedOrder } from "../types/return-exchange";
import { useState } from "react";
import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
import { ReturnExchangeOrders } from "../../../../return-exchange-columns";

interface OrderCardProps {
  group: GroupedOrder;
  isExpanded: boolean;
  onToggleExpand: () => void;

  requestStatus: string;

  rowOriginal: ReturnExchangeOrders;
}

const TABS = [
  {
    id: "items",
    label: "Sản phẩm",
    icon: PackageIcon,
  },
  {
    id: "status",
    label: "Trạng thái",
    icon: Captions,
  },
  {
    id: "timeline",
    label: "Tiến trình",
    icon: ChartNoAxesGanttIcon,
  },
];

export default function OrderCard({
  group,
  isExpanded,
  onToggleExpand,
  requestStatus,
  rowOriginal,
}: OrderCardProps) {
  const [activeTab, setActiveTab] = useState("items");

  return (
    <Card className="overflow-hidden cardStyle duration-200">
      <OrderHeader
        orderInfo={group.orderInfo}
        itemCount={group.items.length}
        requestStatus={group.items[0].requestItemStatus}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        requestDate={rowOriginal.requestDate}
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-4">
              <VercelTab
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {activeTab === "items" ? (
                <ItemsTabContent items={group.items} />
              ) : activeTab === "status" ? (
                <StatusTabContent items={group.items} />
              ) : (
                activeTab === "timeline" && (
                  <TimelineTabContent
                    createdAt={rowOriginal.requestDate}
                    status={requestStatus}
                  />
                )
              )}

              {/* <Tabs defaultValue="items" className="w-full">
                <TabsList className="mb-4 bg-slate-100 p-1">
                  <TabsTrigger
                    value="items"
                    className="data-[state=active]:bg-white"
                  >
                    Sản phẩm
                  </TabsTrigger>
                  <TabsTrigger
                    value="status"
                    className="data-[state=active]:bg-white"
                  >
                    Trạng thái
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-white"
                  >
                    Tiến trình
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="items">
                  <ItemsTabContent items={group.items} />
                </TabsContent>

                <TabsContent value="status">
                  <StatusTabContent items={group.items} />
                </TabsContent>

                <TabsContent value="timeline">
                  <TimelineTabContent createdAt={group.orderInfo.createdAt} />
                </TabsContent>
              </Tabs> */}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
