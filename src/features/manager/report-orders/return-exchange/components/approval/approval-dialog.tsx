"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  Info,
  Camera,
  FileText,
  Package,
  InfoIcon,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
// import type { ReturnRequestData } from "@/types/return-exchange";
import { formatVND } from "@/lib/format-currency";
import { OrderReturnItem } from "@/types/order-detail.types";
import { FileUpload } from "@/components/global-components/aceternity/file-upload";
import { ProductReceived } from "./tabs-aprroval/product-recieved";
import { GeneralTab } from "./tabs-aprroval/general-tab";
import { ImagesTab } from "./tabs-aprroval/images-tab";
import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";

interface ApprovalDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  requestId: string;
  adminNote: string;
  setAdminNote: (note: string) => void;
  shippingFeeResponsibility: string;
  setShippingFeeResponsibility: (value: string) => void;
  itemsData: {
    returnExchangeRequestItemId: string;
    receiveQuantity: number;
    note: string;
    acceptQuantity: number;
  }[];
  returnRequestData: OrderReturnItem[];
  handleItemReceiveQuantityChange: (id: string, value: number) => void;
  handleItemAcceptQuantityChange: (id: string, value: number) => void;
  handleItemNoteChange: (id: string, value: string) => void;
  receiveImages: string[];
  // handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setImages: React.Dispatch<React.SetStateAction<File[]>>;

  // removeImage: (index: number) => void;
  isLoading: boolean;
  images: File[];
  onSubmit: () => Promise<void>;
}

export function ApprovalDialog({
  isOpen,
  setIsOpen,
  requestId,
  adminNote,
  setAdminNote,
  shippingFeeResponsibility,
  setShippingFeeResponsibility,
  itemsData,
  returnRequestData,
  handleItemReceiveQuantityChange,
  handleItemAcceptQuantityChange,
  handleItemNoteChange,
  receiveImages,
  // handleImageUpload,
  setImages,
  images,
  // removeImage,
  isLoading,
  onSubmit,
}: ApprovalDialogProps) {
  const [activeTab, setActiveTab] = useState("general");

  // Calculate total refund amount
  const totalRefundAmount = itemsData.reduce((total, item) => {
    const originalItem = returnRequestData.find(
      (original) =>
        original.returnExchangeRequestItemId ===
        item.returnExchangeRequestItemId
    );
    if (originalItem) {
      return total + originalItem.orderItem.discountPrice * item.acceptQuantity;
    }
    return total;
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-7xl p-0 overflow-hidden">
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
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={onSubmit}
                disabled={isLoading}
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
