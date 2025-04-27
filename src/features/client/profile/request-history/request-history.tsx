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

// Sample data from the provided JSON
const sampleData: { value: ReturnExchangeRequest[] } = {
  value: [
    {
      id: "64ffab95-10df-482b-bb90-150baba940e1",
      orderId: "DRYFRUIT-20250425-00001",
      requestType: "Return",
      requestStatus: "Pending",
      reason: "Nhận sai sản phẩm",
      reasonReject: null,
      reasonCancel: null,
      linkDocument: null,
      requestDate: "2025-04-25T16:07:32.438871+00:00",
      processedDate: null,
      returnExchangeRequestItems: [
        {
          returnExchangeRequestItemId: "0fac613a-f106-4712-a03c-7c8124a233a1",
          orderItem: {
            id: "17a89730-f7f5-4c41-9cd0-5eddc55c39bb",
            referenceId: "a58a1c10-3ed7-43e6-bb7b-75fffe124fd3",
            name: "Combo Bữa Trưa Nhanh Gọn",
            image:
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743930819/f6lx0v4rd31m6givrmvn.png",
            customImages: [
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853069/ypc1ks0cuxl09pan6w0a.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853068/jvcnqatoa5stzauu1rql.png",
            ],
            itemType: "Custom",
            quantity: 1,
            unitPrice: 59500,
            percentage: 0,
            discountPrice: 59500,
            orderItemDetails: [
              {
                id: "ac0e54c7-206f-4558-8ad2-cfd59f696eea",
                productVariantId: "7ac44a3e-37e1-48e4-b522-c19b4696c49f",
                name: "Dâu tây sấy - Lọ thủy tinh - 13g",
                image:
                  "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
                quantity: 1,
                unitPrice: 15000,
                discountPercentage: 0,
                discountedPrice: 15000,
              },
            ],
            isCanFeedback: false,
          },
          requestItemStatus: "Return",
          customerQuantity: 1,
          customerImage:
            "https://res.cloudinary.com/deojypwtl/image/upload/v1745597251/return-exchange-request/e93856981b624d71950d3101ad7a07f7_a7i2ma.jpg",
          productStatus: "Bao bì rách, móp khi nhận hàng",
          receiveQuantity: null,
          receiveImage: null,
          note: null,
          acceptQuantity: null,
          refundAmount: null,
        },
        {
          returnExchangeRequestItemId: "488335b7-4147-40fa-b1d7-98d1dafedba7",
          orderItem: {
            id: "46b2164d-457a-4ddf-b5fc-2c8940592bdf",
            referenceId: "a397478a-bbd6-42b8-8834-bc3a8a42fa48",
            name: "Thanh Long Sấy - Túi hút chân không - 30g",
            image:
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918025/k9yqq3yl7cqlx0evkzlf.png",
            customImages: null,
            itemType: "Single",
            quantity: 1,
            unitPrice: 71000,
            percentage: 0,
            discountPrice: 71000,
            orderItemDetails: null,
            isCanFeedback: false,
          },
          requestItemStatus: "Return",
          customerQuantity: 1,
          customerImage:
            "https://res.cloudinary.com/deojypwtl/image/upload/v1745597248/return-exchange-request/4a71d8a64e194548a993cff6041e211b_sgdk1f.jpg",
          productStatus: "Đã dùng thử một phần",
          receiveQuantity: null,
          receiveImage: null,
          note: null,
          acceptQuantity: null,
          refundAmount: null,
        },
        {
          returnExchangeRequestItemId: "4d591a09-fe12-47ba-8282-68ec708e039f",
          orderItem: {
            id: "17a89730-f7f5-4c41-9cd0-5eddc55c39bb",
            referenceId: "a58a1c10-3ed7-43e6-bb7b-75fffe124fd3",
            name: "Combo Bữa Trưa Nhanh Gọn",
            image:
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743930819/f6lx0v4rd31m6givrmvn.png",
            customImages: [
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853069/ypc1ks0cuxl09pan6w0a.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853068/jvcnqatoa5stzauu1rql.png",
            ],
            itemType: "Custom",
            quantity: 1,
            unitPrice: 59500,
            percentage: 0,
            discountPrice: 59500,
            orderItemDetails: [
              {
                id: "e37d471a-1601-49b5-a0b3-25f6865c3afb",
                productVariantId: "0e0547e3-1d33-4cbb-8cee-c97224059159",
                name: "Dứa sấy khô - Gói nhỏ mẫu thử - 14g",
                image:
                  "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853068/jvcnqatoa5stzauu1rql.png",
                quantity: 1,
                unitPrice: 14500,
                discountPercentage: 0,
                discountedPrice: 14500,
              },
            ],
            isCanFeedback: false,
          },
          requestItemStatus: "Return",
          customerQuantity: 1,
          customerImage:
            "https://res.cloudinary.com/deojypwtl/image/upload/v1745597249/return-exchange-request/74f7b9de8275404aa63303038a1a5c1c_p1mkkz.jpg",
          productStatus: "Có mùi lạ hoặc hương vị bất thường",
          receiveQuantity: null,
          receiveImage: null,
          note: null,
          acceptQuantity: null,
          refundAmount: null,
        },
        {
          returnExchangeRequestItemId: "692bc70f-15da-47d4-a71e-ca1cf6f95b3c",
          orderItem: {
            id: "17a89730-f7f5-4c41-9cd0-5eddc55c39bb",
            referenceId: "a58a1c10-3ed7-43e6-bb7b-75fffe124fd3",
            name: "Combo Bữa Trưa Nhanh Gọn",
            image:
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743930819/f6lx0v4rd31m6givrmvn.png",
            customImages: [
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853069/ypc1ks0cuxl09pan6w0a.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853068/jvcnqatoa5stzauu1rql.png",
            ],
            itemType: "Custom",
            quantity: 1,
            unitPrice: 59500,
            percentage: 0,
            discountPrice: 59500,
            orderItemDetails: [
              {
                id: "1f0a7164-b618-40c0-89bf-6c0cf03953d9",
                productVariantId: "6ba6873c-a585-4a39-b235-badc59a1da63",
                name: "Táo sấy - Lon thiếc - 95g",
                image:
                  "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853069/ypc1ks0cuxl09pan6w0a.png",
                quantity: 1,
                unitPrice: 13000,
                discountPercentage: 0,
                discountedPrice: 13000,
              },
            ],
            isCanFeedback: false,
          },
          requestItemStatus: "Return",
          customerQuantity: 1,
          customerImage:
            "https://res.cloudinary.com/deojypwtl/image/upload/v1745597249/return-exchange-request/053a455ce24143f79a114267024f784b_qd5gct.jpg",
          productStatus: "Đã mở bao bì nhưng chưa sử dụng",
          receiveQuantity: null,
          receiveImage: null,
          note: null,
          acceptQuantity: null,
          refundAmount: null,
        },
        {
          returnExchangeRequestItemId: "95df1847-bef1-4adb-90f9-a2e84f35bc5e",
          orderItem: {
            id: "17a89730-f7f5-4c41-9cd0-5eddc55c39bb",
            referenceId: "a58a1c10-3ed7-43e6-bb7b-75fffe124fd3",
            name: "Combo Bữa Trưa Nhanh Gọn",
            image:
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743930819/f6lx0v4rd31m6givrmvn.png",
            customImages: [
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853069/ypc1ks0cuxl09pan6w0a.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
              "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853068/jvcnqatoa5stzauu1rql.png",
            ],
            itemType: "Custom",
            quantity: 1,
            unitPrice: 59500,
            percentage: 0,
            discountPrice: 59500,
            orderItemDetails: [
              {
                id: "b886d33d-cb17-48cd-a377-e49d6efb96b2",
                productVariantId: "5fe709ab-489a-4031-b890-ea4d8caf71d9",
                name: "Việt quất sấy - Bao gói đơn giản - 16g",
                image:
                  "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
                quantity: 1,
                unitPrice: 17000,
                discountPercentage: 0,
                discountedPrice: 17000,
              },
            ],
            isCanFeedback: false,
          },
          requestItemStatus: "Return",
          customerQuantity: 1,
          customerImage:
            "https://res.cloudinary.com/deojypwtl/image/upload/v1745597250/return-exchange-request/3e9227400aa645259f69c656b6aed98a_toxwbn.jpg",
          productStatus: "Đã dùng thử một phần",
          receiveQuantity: null,
          receiveImage: null,
          note: null,
          acceptQuantity: null,
          refundAmount: null,
        },
      ],
    },
  ],
};

// Helper function to format currency

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
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";

  switch (status) {
    case "Pending":
      variant = "secondary";
      break;
    case "Approved":
      variant = "default";
      break;
    case "Rejected":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }

  return <Badge variant={variant}>{status}</Badge>;
};

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

      {activeTab === "all" ? (
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
      )}

      {/* <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Đang xử lý</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Không có yêu cầu đang xử lý</p>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Không có yêu cầu đã duyệt</p>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Không có yêu cầu đã từ chối</p>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
