"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  BadgeCheckIcon,
  ChevronDown,
  ChevronUp,
  CircleXIcon,
  Clock,
  GalleryVerticalEndIcon,
  GroupIcon,
  Package,
  PackageMinusIcon,
  RefreshCw,
  ReplaceIcon,
  SendToBackIcon,
  SettingsIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderItem as OrderItemTypes } from "../../payment/successful/payment-successful.types";
import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { ProveImages } from "./components/prove-images";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { USER_KEY } from "@/app/key/user-key";
import ImprovedLoadingPage from "@/app/(client)/loading";
import { ApiResponse } from "@/types/types";
import { NotData } from "@/components/global-components/no-data";
import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import { RequestHistoryContent } from "./components/request-history-content";
import { ReturnExchangeRequestStatusText } from "@/features/manager/report-orders/return-exchange/return-exchange-status/status";

// Define types based on the provided data structure
interface OrderItemDetail {
  id: string;
  productVariantId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  discountedPrice: number;
}

interface OrderItemReturnExchange {
  id: string;
  referenceId: string;
  name: string;
  image: string;
  customImages: string[] | null;
  itemType: "Single" | "Custom";
  quantity: number;
  unitPrice: number;
  percentage: number;
  discountPrice: number;
  orderItemDetails: OrderItemDetail[] | null;
  isCanFeedback: boolean;
}

export interface ReturnExchangeRequestItem {
  returnExchangeRequestItemId: string;
  orderItem: OrderItemReturnExchange;
  requestItemStatus: string;
  customerQuantity: number;
  customerImage: string;
  productStatus: string;
  receiveQuantity: number | null;
  receiveImage: string | null;
  note: string | null;
  acceptQuantity: number | null;
  refundAmount: number | null;
}

export interface ReturnExchangeRequest {
  id: string;
  orderId: string;
  requestType: string;
  requestStatus: string;
  reason: string;
  reasonReject: string | null;
  reasonCancel: string | null;
  linkDocument: string | null;
  requestDate: string;
  processedDate: string | null;
  returnExchangeRequestItems: ReturnExchangeRequestItem[];
}

const allowedStatuses = [
  ReturnExchangeRequestStatusText.Processing,
  ReturnExchangeRequestStatusText.Completed,
  ReturnExchangeRequestStatusText.Rejected,
  ReturnExchangeRequestStatusText.Approved,
];
const TABS = [
  {
    id: "all",
    label: "Tất cả",
    icon: GalleryVerticalEndIcon,
  },
  {
    id: "processing",
    label: "Đang xử lý",
    icon: SettingsIcon,
  },
  {
    id: "completed",
    label: "Đã duyệt",
    icon: BadgeCheckIcon,
  },
  {
    id: "rejected",
    label: "Bị từ chối",
    icon: CircleXIcon,
  },
];

// Status badge component

export default function ReturnRequestHistory() {
  const [activeTab, setActiveTab] = useState<string>("all");

  // State to track expanded items
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const requestHistory = useFetch<ApiResponse<ReturnExchangeRequest[]>>(
    "/Orders/user/request-exchange",
    [USER_KEY.REQUEST_ORDER_HISTORY]
  );

  // Group items by referenceId
  const groupItemsByReferenceId = (items: ReturnExchangeRequestItem[]) => {
    const groups: Record<string, ReturnExchangeRequestItem[]> = {};

    items.forEach((item) => {
      const referenceId = item.orderItem.referenceId;
      if (!groups[referenceId]) {
        groups[referenceId] = [];
      }
      groups[referenceId].push(item);
    });

    return groups;
  };

  // Toggle group expansion
  const toggleGroup = (referenceId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [referenceId]: !prev[referenceId],
    }));
  };

  // Toggle item details expansion
  const toggleItemDetails = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  if (requestHistory.isLoading) {
    return <ImprovedLoadingPage />;
  }

  if (requestHistory?.data?.value?.length === 0) {
    return (
      <NotData
        title="Có vẻ như bạn chưa có yêu cầu đổi trả đơn hàng nào"
        description="Bạn có thể theo dõi những đơn hàng bạn đã yêu cầu đổi trả tại đây!"
        className="min-w-full h-full"
        icons={[PackageMinusIcon, SendToBackIcon, GroupIcon, ReplaceIcon]}
      />
    );
  }

  const safeRequestHistory = requestHistory.data?.value ?? [];

  const filteredRequestHistory = safeRequestHistory.filter(
    (request: ReturnExchangeRequest) =>
      allowedStatuses.includes(
        request.requestStatus as ReturnExchangeRequestStatusText
      )
  );

  const filteredByTabRequestHistory = filteredRequestHistory.filter(
    (request: ReturnExchangeRequest) => {
      if (activeTab === "processing")
        return (
          request.requestStatus === ReturnExchangeRequestStatusText.Processing
        );
      if (activeTab === "completed")
        return (
          request.requestStatus === ReturnExchangeRequestStatusText.Completed
        );
      if (activeTab === "rejected")
        return (
          request.requestStatus === ReturnExchangeRequestStatusText.Rejected
        );
      if (activeTab === "approved")
        return (
          request.requestStatus === ReturnExchangeRequestStatusText.Approved
        );
      return true; // "all" thì không lọc thêm
    }
  );

  return (
    // <div className="container mx-auto py-6 px-4 max-w-5xl">
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-6">Lịch sử yêu cầu đổi/trả hàng</h1>

      <VercelTab
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"
      />

      {filteredByTabRequestHistory.length > 0 ? (
        <div className="space-y-6">
          {filteredByTabRequestHistory.map((request: ReturnExchangeRequest) => {
            const groupedItems = groupItemsByReferenceId(
              request.returnExchangeRequestItems
            );

            return (
              <RequestHistoryContent
                key={request.id}
                expandedGroups={expandedGroups}
                expandedItems={expandedItems}
                groupedItems={groupedItems}
                request={request}
                toggleGroup={toggleGroup}
                toggleItemDetails={toggleItemDetails}
              />
            );
          })}
        </div>
      ) : (
        <NotData
          title={
            activeTab === "processing"
              ? "Chưa có yêu cầu đang xử lý"
              : activeTab === "completed"
              ? "Chưa có yêu cầu đã hoàn tất"
              : activeTab === "rejected"
              ? "Chưa có yêu cầu bị từ chối"
              : activeTab === "approved"
              ? "Chưa có yêu cầu đã duyệt"
              : "Chưa có yêu cầu đổi/trả nào"
          }
          description="Bạn có thể theo dõi những đơn hàng bạn đã yêu cầu đổi trả tại đây!"
          className="min-w-full h-full motion-preset-bounce"
          icons={[PackageMinusIcon, SendToBackIcon, GroupIcon, ReplaceIcon]}
        />
      )}

      {/* {activeTab === "all" ? (
        <div className="space-y-6">
          {safeRequestHistory.map((request) => {
            const groupedItems = groupItemsByReferenceId(
              request.returnExchangeRequestItems
            );

            return (
              <RequestHistoryContent
                key={request.id}
                expandedGroups={expandedGroups}
                expandedItems={expandedItems}
                groupedItems={groupedItems}
                request={request}
                toggleGroup={toggleGroup}
                toggleItemDetails={toggleItemDetails}
              />
            );
          })}
        </div>
      ) : activeTab === "processing" ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Không có yêu cầu đang xử lý</p>
        </Card>
      ) : activeTab === "approved" ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Không có yêu cầu đã duyệt</p>
        </Card>
      ) : (
        activeTab === "rejected" && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Không có yêu cầu đã từ chối</p>
          </Card>
        )
      )} */}
    </div>
  );
}
