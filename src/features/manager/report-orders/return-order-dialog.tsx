"use client";

import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ApiResponse } from "@/types/types";
import { OrderDetailTypes } from "@/types/report-orders.types";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { OrderItem as OrderItemType } from "@/features/client/payment/successful/payment-successful.types";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { API } from "@/app/key/url";
import { FistStep } from "./steps-return/first-step";
import { SecondStep } from "./steps-return/second-step";

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
    description: "Không còn muốn sử dụng sản phẩm này nữa",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  {
    id: "other",
    reason: "Khác (vui lòng ghi rõ)",
    description: "Lý do khác không được liệt kê ở trên",
    icon: <AlertCircle className="h-4 w-4" />,
  },
];

const itemConditions = [
  { value: "Chưa mở hộp", label: "Chưa mở hộp" },
  {
    value: "Đã mở hộp nhưng chưa sử dụng",
    label: "Đã mở hộp nhưng chưa sử dụng",
  },
  { value: "Đã sử dụng nhưng không tốt", label: "Đã sử dụng nhưng không tốt" },
  { value: "Bị hư hỏng", label: "Bị hư hỏng" },
];

interface ReturnOrderDialogProps {
  orderId: string;
}

export interface SelectedItemsDetailsType {
  [key: string]: {
    reason: string;
    productStatus: string;
    images: File[];
    quantity?: number;
  };
}

export function ReturnOrderDialog({ orderId }: ReturnOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemCondition, setItemCondition] = useState("");
  const [preferredAction, setPreferredAction] = useState("return");

  const token = Cookies.get("accessToken");

  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItemType[]>(
    []
  );

  const [selectedItemsDetails, setSelectedItemsDetails] =
    useState<SelectedItemsDetailsType>({});

  const [selectImages, setSelectImages] = useState<File[]>([]);

  const [googleDriveLink, setGoogleDriveLink] = useState<string>("");

  // console.log({ selectImages });

  // const handleImageChange = (files: File[]) => {
  //   setSelectImages((prev: File[]) => {
  //     const newFiles = files.filter(
  //       (file) => !prev.some((f) => f.name === file.name)
  //     );
  //     return [...prev, ...newFiles];
  //   });
  // };

  const images = Object.values(selectedItemsDetails).flatMap(
    (item) => item.images
  );

  const handleConfirm = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    const isValid = Object.values(selectedItemsDetails).every(
      (detail) => detail?.productStatus && detail?.images?.length > 0
    );
    if (!isValid) {
      toast.info("Vui lòng điền đầy đủ lý do và tải ảnh cho tất cả sản phẩm.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("reason", selectedReason);

      formData.append(`type`, preferredAction);
      formData.append(`LinkDocument`, googleDriveLink);

      images.forEach((image, index) => {
        formData.append(`Images`, image);
      });

      selectedItems.forEach((itemId, index) => {
        const itemDetail = selectedItemsDetails[itemId];

        formData.append(`items[${index}][orderItemId]`, itemId);

        // Append quantity
        // formData.append(`items[${index}][quantity]`, "1");
        formData.append(
          `items[${index}][quantity]`,
          String(itemDetail.quantity)
        );

        // Append tình trạng sản phẩm
        formData.append(
          `items[${index}][productStatus]`,
          itemDetail.productStatus
        );

        // formData.append(`items[${index}][type]`, preferredAction);
      });

      // Gửi yêu cầu đến API
      const response = await axios.post(
        `${API}/Orders/return-exchange`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Yêu cầu trả hàng đã được gửi thành công.");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi gửi yêu cầu trả hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );

    // Nếu sản phẩm chưa có trong selectedItemsDetails, thêm nó với giá trị mặc định
    if (!selectedItemsDetails[itemId]) {
      setSelectedItemsDetails((prev) => ({
        ...prev,
        [itemId]: { productStatus: "", images: [], reason: "", quantity: 1 },
      }));
    } else {
      // Nếu bỏ chọn, xóa khỏi selectedItemsDetails
      setSelectedItemsDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[itemId];
        return newDetails;
      });
    }
  };

  const isOtherSelected = selectedReason === "Khác (vui lòng ghi rõ)";
  // const canProceed =
  //   selectedReason &&
  //   selectedItems.length > 0 &&
  //   itemCondition &&
  //   (isOtherSelected ? additionalComments.trim().length > 0 : true);

  const proveCondition =
    selectedItemsDetails[selectedItems[0]]?.images?.length > 0 ||
    !googleDriveLink;

  const canProceed =
    selectedReason &&
    selectedItems.length > 0 &&
    selectedItemsDetails[selectedItems[0]]?.productStatus &&
    proveCondition &&
    (isOtherSelected ? additionalComments.trim().length > 0 : true);

  const orderDetail = useFetch<ApiResponse<OrderDetailTypes>>(
    `/Orders/${orderId}`,
    [ORDERS_KEY.ORDER_LIST_DETAIL, orderId]
  );

  useEffect(() => {
    const selectedItemsDetails = orderDetail.data?.value?.orderItems.filter(
      (item) => selectedItems.includes(item.id)
    );
    setSelectedOrderItem(selectedItemsDetails || []);
  }, [selectedItems, orderDetail.data?.value?.orderItems]);

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
            setPreferredAction("return");
            setSelectedItemsDetails({});
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
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-3xl border-0 shadow-xl cardStyle">
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

        {/* <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          > */}
        {step === 1 ? (
          <FistStep
            orderDetail={orderDetail}
            orderId={orderId}
            selectedItems={selectedItems}
            selectedItemsDetails={selectedItemsDetails}
            setSelectedItems={setSelectedItems}
            setItemCondition={setItemCondition}
            setPreferredAction={setPreferredAction}
            setSelectedReason={setSelectedReason}
            setAdditionalComments={setAdditionalComments}
            itemCondition={itemCondition}
            selectedReason={selectedReason}
            toggleItemSelection={toggleItemSelection}
            additionalComments={additionalComments}
            preferredAction={preferredAction}
            setSelectedItemsDetails={setSelectedItemsDetails}
            returnReasons={returnReasons}
            googleDriveLink={googleDriveLink}
            setGoogleDriveLink={setGoogleDriveLink}
          />
        ) : (
          step === 2 && (
            <SecondStep
              additionalComments={additionalComments}
              orderDetail={orderDetail}
              orderId={orderId}
              preferredAction={preferredAction}
              isOtherSelected={isOtherSelected}
              itemCondition={itemCondition}
              selectedOrderItem={selectedOrderItem}
              selectedReason={selectedReason}
            />
          )
        )}
        {/* </motion.div>
        </AnimatePresence> */}

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
