"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlignJustify,
  ArrowLeft,
  ArrowRight,
  BookCheck,
  Check,
  ClipboardX,
  Copy,
  Package,
  PhoneOff,
  ServerCrash,
  X,
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
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import { OrderDetailTypes } from "@/types/report-orders.types";
import { ORDERS_KEY } from "@/app/key/manager-key";
import axios from "axios";
import { API } from "@/app/key/url";

import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  OrderItem,
  OrderItemSkeleton,
} from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { vietnameseDate } from "@/utils/date";
import { getStatusText } from "./order-status-badge";

const cancelReasons = [
  // {
  //   id: "address",
  //   reason: "Tôi muốn thay đổi địa chỉ giao hàng",
  //   description: "Địa chỉ giao hàng không chính xác hoặc đã thay đổi",
  //   icon: <Truck className="h-4 w-4" />,
  // },
  // {
  //   id: "payment",
  //   reason: "Tôi muốn thay đổi phương thức thanh toán",
  //   description: "Muốn sử dụng phương thức thanh toán khác",
  //   icon: <ShoppingBag className="h-4 w-4" />,
  // },
  // {
  //   id: "wrong-product",
  //   reason: "Tôi đặt nhầm sản phẩm",
  //   description: "Sản phẩm không phù hợp với nhu cầu",
  //   icon: <Package className="h-4 w-4" />,
  // },
  // {
  //   id: "cheaper",
  //   reason: "Tôi tìm thấy sản phẩm giá rẻ hơn ở nơi khác",
  //   description: "Đã tìm được lựa chọn tốt hơn về giá cả",
  //   icon: <ShoppingBag className="h-4 w-4" />,
  // },
  // {
  //   id: "no-need",
  //   reason: "Tôi không còn nhu cầu mua sản phẩm này nữa",
  //   description: "Đã thay đổi quyết định mua hàng",
  //   icon: <X className="h-4 w-4" />,
  // },
  // {
  //   id: "delivery-time",
  //   reason: "Thời gian giao hàng quá lâu",
  //   description: "Không thể đợi thời gian giao hàng dự kiến",
  //   icon: <Truck className="h-4 w-4" />,
  // },

  {
    id: "out-of-stock",
    reason: "Sản phẩm đã hết hàng",
    description: "Không còn đủ tồn kho để xử lý đơn hàng",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "fraud-detected",
    reason: "Phát hiện dấu hiệu gian lận",
    description: "Đơn hàng có dấu hiệu không hợp lệ hoặc gian lận",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    id: "invalid-info",
    reason: "Thông tin đơn hàng không hợp lệ",
    description:
      "Số điện thoại, địa chỉ hoặc thông tin người nhận không chính xác",
    icon: <X className="h-4 w-4" />,
  },
  {
    id: "customer-unresponsive",
    reason: "Không liên lạc được với khách hàng",
    description: "Không thể xác nhận đơn hàng do khách hàng không phản hồi",
    icon: <PhoneOff className="h-4 w-4" />,
  },

  {
    id: "called",
    reason: "Đã liên lạc nhưng không nhận hàng",
    description: "Đã liên lạc với khách hàng nhưng không nhận hàng",
    icon: <PhoneOff className="h-4 w-4" />,
  },

  {
    id: "call-5-times",
    reason: "Đã gọi 5 lần nhưng không nhận hàng",
    description: "Đã gọi 5 lần nhưng không nhận hàng",
    icon: <PhoneOff className="h-4 w-4" />,
  },

  {
    id: "duplicate-order",
    reason: "Đơn hàng bị trùng lặp",
    description: "Phát hiện khách hàng đặt nhiều đơn hàng giống nhau",
    icon: <Copy className="h-4 w-4" />,
  },
  {
    id: "internal-error",
    reason: "Lỗi hệ thống hoặc xử lý đơn hàng",
    description: "Có lỗi trong quá trình xử lý đơn hoặc hệ thống",
    icon: <ServerCrash className="h-4 w-4" />,
  },
  {
    id: "other",
    reason: "Khác (vui lòng ghi rõ)",
    description: "Lý do khác không được liệt kê ở trên",
    icon: <AlertCircle className="h-4 w-4" />,
  },
];

interface CancelOrderDialogProps {
  orderId: string;
}
export function CancelOrderDialog({ orderId }: CancelOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderDetail = useFetch<ApiResponse<OrderDetailTypes>>(
    `/Orders/${orderId}`,
    [ORDERS_KEY.ORDER_LIST_DETAIL, orderId]
  );

  const orderItems = orderDetail.data?.value?.orderItems || [];

  const token = Cookies.get("accessToken");

  const queryClient = useQueryClient();

  const handleConfirm = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.patch(
        `${API}/Orders/${orderId}/status`,
        {
          status: "cancelled",
          orderId,
          reason:
            additionalComments !== "" ? additionalComments : selectedReason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log("API response:", response);

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: [ORDERS_KEY.ORDERS_LIST],
        });

        queryClient.invalidateQueries({
          queryKey: [ORDERS_KEY.ORDER_LIST_DETAIL, orderId],
        });

        toast.success("Cập nhật trạng thái thành công");

        setOpen(false);
        setTimeout(() => {
          setStep(1);
          setSelectedReason("");
          setAdditionalComments("");
        }, 500);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const isOtherSelected = selectedReason === "Khác (vui lòng ghi rõ)";
  const canProceed =
    selectedReason &&
    (isOtherSelected ? additionalComments.trim().length > 0 : true);

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setTimeout(() => {
            setStep(1);
            setSelectedReason("");
            setAdditionalComments("");
          }, 300);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group flex items-center gap-2 text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 w-full"
        >
          <ClipboardX className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          Hủy đơn hàng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-3xl border-0 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-rose-500 transition-all duration-500 ease-in-out"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-full shadow-sm">
                <AlertCircle className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                  {step === 1
                    ? "Xác nhận hủy đơn hàng"
                    : "Xem lại thông tin hủy đơn"}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  {step === 1
                    ? "Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này."
                    : "Vui lòng xác nhận thông tin hủy đơn hàng của bạn."}
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
                    className="bg-orange-50 text-orange-700 border-orange-200 px-2 py-1"
                  >
                    Đang xử lý
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Đơn hàng #VN12345
                  </span>
                </div>

                <RadioGroup
                  value={selectedReason}
                  onValueChange={setSelectedReason}
                  className="space-y-3"
                >
                  {cancelReasons.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "relative flex flex-col rounded-lg border p-4 transition-all duration-200",
                        selectedReason === item.reason
                          ? "border-rose-200 bg-rose-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start gap-3 ">
                        <RadioGroupItem
                          value={item.reason}
                          id={item.id}
                          className={cn(
                            "transition-colors duration-200 mt-1",
                            selectedReason === item.reason
                              ? "border-rose-500 text-rose-500"
                              : ""
                          )}
                        />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "p-1.5 rounded-full transition-colors duration-200",
                                selectedReason === item.reason
                                  ? "bg-rose-100"
                                  : "bg-gray-100"
                              )}
                            >
                              {item.icon}
                            </div>
                            <Label
                              htmlFor={item.id}
                              className={cn(
                                "font-medium text-base cursor-pointer transition-colors duration-200",
                                selectedReason === item.reason
                                  ? "text-rose-700"
                                  : "text-gray-700"
                              )}
                            >
                              {item.reason}
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500 ml-8">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {isOtherSelected && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="comments" className="text-sm font-medium">
                      Vui lòng cung cấp thêm thông tin
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Nhập lý do hủy đơn hàng của bạn..."
                      value={additionalComments}
                      onChange={(e) => setAdditionalComments(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-sm flex items-center gap-1 font-bold text-slate-700 mb-2">
                    <BookCheck className="size-6" /> Lý do hủy đơn
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="font-medium text-slate-800">
                      {selectedReason}
                    </p>
                    {isOtherSelected && additionalComments && (
                      <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
                        <p className="text-sm text-slate-600">
                          {additionalComments}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm flex items-center gap-1 font-bold text-slate-700 mb-2">
                    <AlignJustify className="size-6" /> Thông tin đơn hàng
                  </h3>
                  {!orderDetail.isLoading ? (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700">
                          Đơn hàng{" "}
                          <span className="text-slate-700">
                            # {orderDetail.data?.value?.orderId ?? ""}
                          </span>
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200"
                        >
                          {getStatusText(
                            (orderDetail.data?.value?.orderStatus as string) ??
                              ""
                          )}
                        </Badge>
                      </div>
                      <div className="text-xs font-bold text-gray-500 mb-4">
                        Đặt ngày{" "}
                        <span className="text-sky-500 font-semibold">
                          {vietnameseDate(
                            (orderDetail.data?.value?.buyDate as string) ?? "",
                            true
                          )}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {orderItems.map((item) => (
                          <OrderItem key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <OrderItemSkeleton />
                      <OrderItemSkeleton />
                      <OrderItemSkeleton />
                    </>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        Lưu ý về chính sách hủy đơn
                      </h4>
                      <p className="text-xs text-yellow-700 mt-1">
                        Sau khi hủy đơn hàng, bạn sẽ không thể khôi phục lại.
                        Nếu đã thanh toán, tiền sẽ được hoàn lại trong vòng 7-14
                        ngày làm việc.
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
                            : "bg-rose-500 hover:bg-rose-600 text-white"
                        )}
                      >
                        Tiếp tục
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canProceed && isOtherSelected && (
                    <TooltipContent>
                      <p>Vui lòng nhập lý do hủy đơn hàng</p>
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
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white min-w-[140px]"
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
                    Xác nhận hủy
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
