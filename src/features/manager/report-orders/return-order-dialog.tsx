"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  RefreshCw,
  ShoppingBag,
  X,
} from "lucide-react";
import Image from "next/image";

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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderInformation } from "./order-action-content/order-infomation";
import { ApiResponse } from "@/types/types";
import { OrderDetailTypes } from "@/types/report-orders.types";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { ReasonContent } from "./order-action-content/reason-content";

const returnReasons = [
  {
    id: "wrong-size",
    reason: "Sai kích thước",
    description: "Sản phẩm quá lớn hoặc quá nhỏ",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "damaged",
    reason: "Sản phẩm bị hư hỏng",
    description: "Sản phẩm bị hỏng khi nhận được",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    id: "not-as-described",
    reason: "Không đúng như mô tả",
    description: "Sản phẩm khác với mô tả trên website",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    id: "defective",
    reason: "Sản phẩm bị lỗi",
    description: "Sản phẩm không hoạt động đúng",
    icon: <X className="h-4 w-4" />,
  },
  {
    id: "wrong-item",
    reason: "Nhận sai sản phẩm",
    description: "Sản phẩm nhận được không phải sản phẩm đã đặt",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "changed-mind",
    reason: "Đổi ý",
    description: "Không còn muốn sản phẩm này nữa",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  {
    id: "other",
    reason: "Khác (vui lòng ghi rõ)",
    description: "Lý do khác không được liệt kê ở trên",
    icon: <AlertCircle className="h-4 w-4" />,
  },
];

const orderItems = [
  {
    id: 1,
    name: "Áo Thun Nam Cotton Cao Cấp",
    price: "350.000₫",
    quantity: 2,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Quần Jeans Slim Fit",
    price: "550.000₫",
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
];

const itemConditions = [
  { value: "unopened", label: "Chưa mở hộp" },
  { value: "unused", label: "Đã mở hộp nhưng chưa sử dụng" },
  { value: "used", label: "Đã sử dụng nhưng còn tốt" },
  { value: "damaged", label: "Bị hư hỏng" },
];

interface ReturnOrderDialogProps {
  orderId: string;
}

export function ReturnOrderDialog({ orderId }: ReturnOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [itemCondition, setItemCondition] = useState("");
  const [preferredAction, setPreferredAction] = useState("refund");

  const handleConfirm = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    // Final confirmation
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Confirmed return with reason:", selectedReason);
      console.log("Items to return:", selectedItems);
      console.log("Item condition:", itemCondition);
      console.log("Preferred action:", preferredAction);
      console.log("Additional comments:", additionalComments);
      setIsSubmitting(false);
      setOpen(false);

      // Reset for next time
      setTimeout(() => {
        setStep(1);
        setSelectedReason("");
        setAdditionalComments("");
        setSelectedItems([]);
        setItemCondition("");
        setPreferredAction("refund");
      }, 500);
    }, 1500);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isOtherSelected = selectedReason === "Khác (vui lòng ghi rõ)";
  const canProceed =
    selectedReason &&
    selectedItems.length > 0 &&
    itemCondition &&
    (isOtherSelected ? additionalComments.trim().length > 0 : true);

  const orderDetail = useFetch<ApiResponse<OrderDetailTypes>>(
    `/Orders/${orderId}`,
    [ORDERS_KEY.ORDER_LIST_DETAIL, orderId]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          // Reset when dialog closes
          setTimeout(() => {
            setStep(1);
            setSelectedReason("");
            setAdditionalComments("");
            setSelectedItems([]);
            setItemCondition("");
            setPreferredAction("refund");
          }, 300);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group flex items-center gap-2 text-sky-500 border-sky-200 hover:bg-sky-50 hover:text-sky-600 transition-all duration-300  w-full"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          Trả hàng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-3xl border-0 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-500 ease-in-out"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        <div className="bg-gradient-to-r from-sky-50 to-sky-100 p-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-full shadow-sm">
                <RefreshCw className="h-6 w-6 text-sky-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                  {step === 1
                    ? "Yêu cầu trả hàng"
                    : "Xem lại thông tin trả hàng"}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  {step === 1
                    ? "Vui lòng cho chúng tôi biết lý do bạn muốn trả hàng."
                    : "Vui lòng xác nhận thông tin trả hàng của bạn."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 ? (
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-4 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 px-2 py-1"
                  >
                    Đã giao hàng
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Đơn hàng #VN12345
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Chọn sản phẩm muốn trả
                  </h3>
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
                          selectedItems.includes(item.id)
                            ? "border-sky-200 bg-sky-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <Checkbox
                          id={`item-${item.id}`}
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                          className={cn(
                            selectedItems.includes(item.id)
                              ? "border-sky-500 text-sky-500"
                              : ""
                          )}
                        />
                        <div className="flex gap-3 flex-1">
                          <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Label
                              htmlFor={`item-${item.id}`}
                              className="font-medium cursor-pointer"
                            >
                              {item.name}
                            </Label>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-gray-500">
                                SL: {item.quantity}
                              </span>
                              <span className="text-sm font-medium">
                                {item.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Tình trạng sản phẩm
                  </h3>
                  <Select
                    value={itemCondition}
                    onValueChange={setItemCondition}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn tình trạng sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemConditions.map((condition) => (
                        <SelectItem
                          key={condition.value}
                          value={condition.value}
                        >
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ReasonContent
                  reasons={returnReasons}
                  selectedReason={selectedReason}
                  setSelectedReason={setSelectedReason}
                  additionalComments={additionalComments}
                  setAdditionalComments={setAdditionalComments}
                  preferredAction={preferredAction}
                  setPreferredAction={setPreferredAction}
                />

                {/* <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Lý do trả hàng
                  </h3>
                  <RadioGroup
                    value={selectedReason}
                    onValueChange={setSelectedReason}
                    className="space-y-3"
                  >
                    {returnReasons.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "relative flex flex-col rounded-lg border p-4 transition-all duration-200",
                          selectedReason === item.reason
                            ? "border-sky-200 bg-sky-50 shadow-sm"
                            : "border-gray-200 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem
                            value={item.reason}
                            id={item.id}
                            className={cn(
                              "transition-colors duration-200",
                              selectedReason === item.reason
                                ? "border-sky-500 text-sky-500"
                                : ""
                            )}
                          />
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "p-1.5 rounded-full transition-colors duration-200",
                                  selectedReason === item.reason
                                    ? "bg-sky-100"
                                    : "bg-slate-100"
                                )}
                              >
                                {item.icon}
                              </div>
                              <Label
                                htmlFor={item.id}
                                className={cn(
                                  "font-medium text-base cursor-pointer transition-colors duration-200",
                                  selectedReason === item.reason
                                    ? "text-sky-700"
                                    : "text-slate-700"
                                )}
                              >
                                {item.reason}
                              </Label>
                            </div>
                            <p className="text-sm text-slate-500 ml-8">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div> */}

                {/* <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">
                    Bạn muốn
                  </h3>
                  <RadioGroup
                    value={preferredAction}
                    onValueChange={setPreferredAction}
                    className="flex gap-4"
                  >
                    <div
                      className={cn(
                        "flex-1 relative flex flex-col rounded-lg border p-4 transition-all duration-200",
                        preferredAction === "refund"
                          ? "border-sky-200 bg-sky-50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="refund" id="refund" />
                        <Label
                          htmlFor="refund"
                          className="font-medium cursor-pointer"
                        >
                          Hoàn tiền
                        </Label>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex-1 relative flex flex-col rounded-lg border p-4 transition-all duration-200",
                        preferredAction === "exchange"
                          ? "border-sky-200 bg-sky-50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="exchange" id="exchange" />
                        <Label
                          htmlFor="exchange"
                          className="font-medium cursor-pointer"
                        >
                          Đổi sản phẩm
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div> */}
                {/* 
                {isOtherSelected && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="comments" className="text-sm font-medium">
                      Vui lòng cung cấp thêm thông tin
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Nhập lý do trả hàng của bạn..."
                      value={additionalComments}
                      onChange={(e) => setAdditionalComments(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                )} */}
              </div>
            ) : (
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-700 mb-2">
                    Thông tin trả hàng
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">
                        Lý do trả hàng:
                      </span>
                      <p className="font-medium text-gray-800">
                        {selectedReason}
                      </p>
                      {isOtherSelected && additionalComments && (
                        <div className="mt-1 pt-1 border-t border-dashed border-gray-200">
                          <p className="text-sm text-gray-600">
                            {additionalComments}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">
                        Tình trạng sản phẩm:
                      </span>
                      <p className="font-medium text-gray-800">
                        {
                          itemConditions.find((c) => c.value === itemCondition)
                            ?.label
                        }
                      </p>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Yêu cầu:</span>
                      <p className="font-medium text-gray-800">
                        {preferredAction === "refund"
                          ? "Hoàn tiền"
                          : "Đổi sản phẩm"}
                      </p>
                    </div>
                  </div>
                </div>

                <OrderInformation
                  queryFn={orderDetail}
                  title="Thông đơn hàng sẽ được trả"
                />

                {/* <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Sản phẩm trả lại
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Đơn hàng #VN12345
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Đã giao hàng
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Đặt ngày 05/04/2025 • Giao ngày 08/04/2025
                    </p>

                    <div className="space-y-4">
                      {orderItems
                        .filter((item) => selectedItems.includes(item.id))
                        .map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium line-clamp-1">
                                {item.name}
                              </p>
                              <div className="flex justify-between mt-1">
                                <span className="text-sm text-gray-500">
                                  SL: {item.quantity}
                                </span>
                                <span className="text-sm font-medium">
                                  {item.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div> */}

                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">
                        Lưu ý về chính sách trả hàng
                      </h4>
                      <p className="text-xs text-amber-700 mt-1">
                        Sản phẩm trả lại phải còn nguyên vẹn, có đầy đủ bao bì,
                        nhãn mác và phụ kiện đi kèm. Thời gian hoàn tiền có thể
                        mất từ 7-14 ngày làm việc sau khi chúng tôi nhận được
                        hàng trả lại.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <Separator />

        <DialogFooter className="flex justify-between p-4 bg-gray-50">
          {step === 1 ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
                Quay lại
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!canProceed}
                        className={cn(
                          "flex items-center gap-2 transition-all duration-200",
                          !canProceed
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-sky-500 hover:bg-sky-600 text-white"
                        )}
                      >
                        Tiếp tục
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canProceed && (
                    <TooltipContent>
                      <p>Vui lòng điền đầy đủ thông tin</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Xác nhận trả hàng
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
