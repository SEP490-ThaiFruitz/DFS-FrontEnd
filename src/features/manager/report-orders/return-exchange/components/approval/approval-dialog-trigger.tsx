"use client";

import type React from "react";
import { useState } from "react";
import {
  AlertCircle,
  Package,
  InfoIcon,
  ImageIcon,
  ListTodo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
// import type { ReturnRequestData } from "@/types/return-exchange";
import { OrderReturnItem } from "@/types/order-detail.types";
import { ProductReceived } from "./tabs-aprroval/product-recieved";
import { GeneralTab } from "./tabs-aprroval/general-tab";
import { ImagesTab } from "./tabs-aprroval/images-tab";
import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
import Cookies from "js-cookie";

import { JSX, memo, useEffect } from "react";
import {
  ClipboardList,
  ChevronRight,
  Info,
  Receipt,
  ShieldCheck,
  LucideIcon,
  Loader2,
  CopyXIcon,
  FileWarningIcon,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrderReturnData } from "@/types/order-detail.types";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import { NotData } from "@/components/global-components/no-data";

import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { API } from "@/app/key/url";

import { useQueryClient } from "@tanstack/react-query";
import { groupItemsByOrder } from "./return-change-product-checked/utils";
import { placeholderImage } from "@/utils/label";

export type ReturnRequestDataType = {
  returnExchangeRequestItemId: string;
  orderItem: {
    name: string;
    image: string;
    customerQuantity: number;
    unitPrice: number;
    percentage: number;
    discountPrice: number;
  };
};

type ItemDataType = {
  returnExchangeRequestItemId: string;
  receiveQuantity: number;
  note: string;
  acceptQuantity: number;
};

interface ApprovalDialogProps {
  requestId: string;
}

export function ApprovalDialogTrigger({
  requestId,
}: // adminNote,

ApprovalDialogProps) {
  const [activeTab, setActiveTab] = useState("general");

  // const [isOpen, setIsOpen] = useState(false);

  const [returnRequestData, setReturnRequestData] = useState<
    ReturnRequestDataType[]
  >([]);
  const [adminNote, setAdminNote] = useState("");
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFeeResponsibility, setShippingFeeResponsibility] =
    useState("");
  const [receiveImages, setReceiveImages] = useState<string[]>([]);
  const [itemsData, setItemsData] = useState<ItemDataType[]>(
    // returnRequestData.map((item) => ({
    //   returnExchangeRequestItemId: item.returnExchangeRequestItemId,
    //   receiveQuantity: item.customerQuantity,
    //   note: "",
    //   acceptQuantity: item.customerQuantity,
    // }))
    []
  );
  const token = Cookies.get("accessToken");

  const [images, setImages] = useState<File[]>([]);

  // console.log("hinh anh nhan duoc: ", images.length);

  const orderReturnExchangeDetailData = useFetch<ApiResponse<OrderReturnData>>(
    `/Orders/${requestId}/return-exchange/details`,
    [`${ORDERS_KEY.RETURN_EXCHANGE}/${requestId}`]
  );

  const queryClient = useQueryClient();

  const safeOrderReturnData = orderReturnExchangeDetailData.data
    ?.value as OrderReturnData;

  useEffect(() => {
    // if (safeOrderReturnData) {
    //   setReturnRequestData(safeOrderReturnData.items);

    //   setItemsData(
    //     safeOrderReturnData.items.map((item) => ({
    //       returnExchangeRequestItemId: item.returnExchangeRequestItemId,
    //       receiveQuantity: item.customerQuantity,
    //       note: "",
    //       acceptQuantity: item.customerQuantity,
    //     }))
    //   );
    // }

    if (safeOrderReturnData) {
      // Format returnRequestData
      const formattedReturnRequestData = safeOrderReturnData.items.flatMap(
        (item) => {
          // Kiểm tra nếu là Custom hoặc Combo
          if (["Custom", "Combo"].includes(item.orderItem.itemType)) {
            return (
              item.orderItem?.orderItemDetails?.map((detail) => ({
                returnExchangeRequestItemId: item.returnExchangeRequestItemId, // Tạo ID duy nhất cho từng sản phẩm con
                orderItem: {
                  name: detail.name,
                  image: detail.image || placeholderImage,
                  customerQuantity: item.customerQuantity * detail.quantity, // Số lượng khách hàng yêu cầu nhân với số lượng của sản phẩm con
                  unitPrice: detail.unitPrice,
                  percentage: detail.discountPercentage,
                  discountPrice: detail.discountedPrice,
                },
              })) ?? []
            );
          }

          // Trường hợp không phải Custom hoặc Combo
          return {
            returnExchangeRequestItemId: item.returnExchangeRequestItemId,
            orderItem: {
              name: item.orderItem.name,
              image:
                item.orderItem.image ||
                item.orderItem.customImages?.[0] ||
                "/placeholder.svg",
              customerQuantity: item.customerQuantity,
              unitPrice: item.orderItem.unitPrice,
              percentage: item.orderItem.percentage,
              discountPrice: item.orderItem.discountPrice,
            },
          };
        }
      );

      // Format itemsData
      const formattedItemsData = safeOrderReturnData.items.flatMap((item) => {
        // Kiểm tra nếu là Custom hoặc Combo
        if (["Custom", "Combo"].includes(item.orderItem.itemType)) {
          return (
            item.orderItem?.orderItemDetails?.map((detail) => ({
              returnExchangeRequestItemId: item.returnExchangeRequestItemId, // Tạo ID duy nhất cho từng sản phẩm con
              receiveQuantity: item.customerQuantity || 0,
              acceptQuantity: item.acceptQuantity || 0,
              note: item.note || "",
            })) ?? []
          );
        }

        // Trường hợp không phải Custom hoặc Combo
        return {
          returnExchangeRequestItemId: item.returnExchangeRequestItemId,
          receiveQuantity: item.receiveQuantity || 0,
          acceptQuantity: item.acceptQuantity || 0,
          note: item.note || "",
        };
      });

      // Cập nhật state
      setReturnRequestData(formattedReturnRequestData);
      setItemsData(formattedItemsData);
    }
  }, [safeOrderReturnData]);

  if (orderReturnExchangeDetailData.isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (orderReturnExchangeDetailData.isError) {
    return (
      <NotData
        action={{
          label: "Thử tải lại",
          onClick: () => orderReturnExchangeDetailData.refetch(),
        }}
      />
    );
  }

  // console.log("safeOrderReturnData", safeOrderReturnData);

  // if (!safeOrderReturnData) {
  //   return (
  //     <NotData
  //       action={{
  //         label: "Thử tải lại",
  //         onClick: () => orderReturnExchangeDetailData.refetch(),
  //       }}
  //       icons={[CopyXIcon, FileWarningIcon, InfoIcon]}
  //       className="min-w-full h-full"
  //     />
  //   );
  // }

  const handleApproveClick = () => {
    setIsApprovalDialogOpen(true);
  };

  const handleItemReceiveQuantityChange = (id: string, value: number) => {
    setItemsData(
      itemsData.map((item) =>
        item.returnExchangeRequestItemId === id
          ? { ...item, receiveQuantity: value }
          : item
      )
    );
  };

  const handleItemAcceptQuantityChange = (id: string, value: number) => {
    setItemsData(
      itemsData.map((item) =>
        item.returnExchangeRequestItemId === id
          ? { ...item, acceptQuantity: value }
          : item
      )
    );
  };

  const handleItemNoteChange = (id: string, value: string) => {
    setItemsData(
      itemsData.map((item) =>
        item.returnExchangeRequestItemId === id
          ? { ...item, note: value }
          : item
      )
    );
  };

  const handleApproveSubmit = async () => {
    setIsLoading(true);

    try {
      // Prepare request body
      const requestBody = {
        requestId: requestId,
        note: adminNote,
        shippingFeeResponsibility: shippingFeeResponsibility,
        items: itemsData,
        receiveImages: images,
      };

      const formData = new FormData();

      images.forEach((image) => {
        formData.append("receiveImages", image);
      });

      formData.append("requestId", requestId);
      formData.append("note", adminNote);
      formData.append("shippingFeeResponsibility", shippingFeeResponsibility);

      itemsData.forEach((item, index) => {
        formData.append(`items[${index}]`, JSON.stringify(item));
      });

      // console.log("Sending approval request:", requestBody);

      const response = await axios.patch(
        `${API}/Orders/${requestId}/return-exchange`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log({ response });

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: [ORDERS_KEY.RETURN_EXCHANGE],
        });
        queryClient.invalidateQueries({
          queryKey: [ORDERS_KEY.ORDERS_LIST],
        });
        toast.success("Yêu cầu đã được phê duyệt thành công.");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Yêu cầu trả hàng đã được phê duyệt thành công.");

        setIsApprovalDialogOpen(false);
      }
    } catch (error) {
      console.error("Error approving return request:", error);
      toast("Đã xảy ra lỗi khi phê duyệt yêu cầu trả hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  const isApproveDisabled =
    !shippingFeeResponsibility || // chưa chọn người chịu phí
    images.length === 0 || // chưa có hình ảnh nhận hàng
    itemsData.some(
      (item) =>
        item.receiveQuantity === undefined ||
        item.acceptQuantity === undefined ||
        item.acceptQuantity > item.receiveQuantity ||
        item.acceptQuantity < 0 ||
        item.receiveQuantity < 0
    );

  const totalRefundAmount = itemsData.reduce((total, item) => {
    const originalItem = returnRequestData.find(
      (original) =>
        original?.returnExchangeRequestItemId ===
        item.returnExchangeRequestItemId
    );
    if (originalItem) {
      return total + originalItem.orderItem.discountPrice * item.acceptQuantity;
    }
    return total;
  }, 0);

  const groupedItems = groupItemsByOrder(safeOrderReturnData.items);

  console.log("data groupedItems: ", groupedItems);

  return (
    <Dialog
      open={isApprovalDialogOpen}
      onOpenChange={(value) => {
        setIsApprovalDialogOpen(value);
        setTimeout(() => (document.body.style.pointerEvents = ""), 100);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-amber-300 hover:bg-amber-600 transition-colors text-black w-full flex items-center gap-1"
          onClick={handleApproveClick}
        >
          <ListTodo className="size-5" />
          Phê duyệt
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-7xl p-0 overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500 hover:bg-amber-600 px-2 py-0.5">
              Phê duyệt
            </Badge>
            <DialogTitle className="text-xl">
              Xác nhận yêu cầu trả hàng
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500">
            Vui lòng xác nhận thông tin trả hàng trước khi phê duyệt
          </DialogDescription>
        </DialogHeader>

        <div className="w-full">
          {/* <div className="border-b px-6">
            <TabsList className="bg-transparent h-12 p-0 w-full justify-start gap-6">
              <TabsTrigger
                value="general"
                className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-0 font-medium"
              >
                Thông tin chung
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-0 font-medium"
              >
                Sản phẩm ({itemsData.length})
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-0 font-medium"
              >
                Hình ảnh
              </TabsTrigger>
            </TabsList>
          </div> */}

          <VercelTab
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: "general", label: "Thông tin chung", icon: InfoIcon },
              {
                id: "products",
                label: `Sản phẩm (${itemsData.length})`,
                icon: Package,
              },
              { id: "images", label: "Hình ảnh", icon: ImageIcon },
            ]}
          />

          <ScrollArea className="max-h-[60vh] px-6 py-4">
            {activeTab === "general" ? (
              <GeneralTab
                requestId={requestId}
                adminNote={adminNote}
                setAdminNote={setAdminNote}
                shippingFeeResponsibility={shippingFeeResponsibility}
                setShippingFeeResponsibility={setShippingFeeResponsibility}
                itemsData={itemsData}
                totalRefundAmount={totalRefundAmount}
              />
            ) : activeTab === "products" ? (
              <ProductReceived
                handleItemAcceptQuantityChange={handleItemAcceptQuantityChange}
                handleItemNoteChange={handleItemNoteChange}
                itemsData={itemsData}
                handleItemReceiveQuantityChange={
                  handleItemReceiveQuantityChange
                }
                returnRequestData={returnRequestData}
                totalRefundAmount={totalRefundAmount}
                // shippingFeeResponsibility={shippingFeeResponsibility}
              />
            ) : (
              activeTab === "images" && (
                <ImagesTab
                  receiveImages={receiveImages}
                  setImages={setImages}
                  images={images}
                />
              )
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-slate-50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-slate-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Hành động này không thể hoàn tác sau khi xác nhận
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsApprovalDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleApproveSubmit}
                disabled={isApproveDisabled || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 min-w-[120px]"
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận phê duyệt"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
