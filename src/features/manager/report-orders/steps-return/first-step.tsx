"use client";

import { memo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { FileUpload } from "@/components/global-components/aceternity/file-upload";
import { ReasonContent } from "../order-action-content/reason-content";
import { OrderItem as OrderItemTypes } from "@/features/client/payment/successful/payment-successful.types";
import { GoogleDriveLinkInput } from "@/components/global-components/form/google-drive-link-input";
import { SelectedItemsDetailsType } from "../return-order-dialog";

interface FirstStepProps {
  orderId: string;
  orderDetail: any;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  selectedItemsDetails: any;
  setSelectedItemsDetails: React.Dispatch<
    React.SetStateAction<
      Record<string, { reason: string; productStatus: string; images: File[] }>
    >
  >;
  itemCondition: string;
  setItemCondition: React.Dispatch<React.SetStateAction<string>>;
  returnReasons: any[];
  selectedReason: string;
  setSelectedReason: React.Dispatch<React.SetStateAction<string>>;
  additionalComments: string;
  setAdditionalComments: React.Dispatch<React.SetStateAction<string>>;
  preferredAction: string;
  setPreferredAction: React.Dispatch<React.SetStateAction<string>>;

  toggleItemSelection: (itemId: string) => void;

  setGoogleDriveLink?: React.Dispatch<React.SetStateAction<string>>;
  googleDriveLink?: string;
}

const itemConditions = [
  { value: "Chưa mở bao bì", label: "Chưa mở bao bì" },
  {
    value: "Đã mở bao bì nhưng chưa sử dụng",
    label: "Đã mở bao bì nhưng chưa sử dụng",
  },
  { value: "Đã dùng thử một phần", label: "Đã dùng thử một phần" },
  {
    value: "Có mùi lạ hoặc hương vị bất thường",
    label: "Có mùi lạ hoặc hương vị bất thường",
  },
  {
    value: "Bị ẩm, mốc hoặc có dấu hiệu hư hỏng",
    label: "Bị ẩm, mốc hoặc có dấu hiệu hư hỏng",
  },
  {
    value: "Bao bì rách, móp khi nhận hàng",
    label: "Bao bì rách, móp khi nhận hàng",
  },
  {
    value: "Hạn sử dụng quá ngắn hoặc đã hết",
    label: "Hạn sử dụng quá ngắn hoặc đã hết",
  },
  { value: "Giao sai loại trái cây sấy", label: "Giao sai loại trái cây sấy" },
];
export const FistStep = memo(
  ({
    additionalComments,
    orderDetail,
    orderId,
    preferredAction,
    returnReasons,
    selectedItems,
    selectedItemsDetails,
    setAdditionalComments,
    setItemCondition,
    setPreferredAction,
    setSelectedItems,
    setSelectedReason,
    setSelectedItemsDetails,
    itemCondition,
    selectedReason,
    toggleItemSelection,

    googleDriveLink,
    setGoogleDriveLink,
  }: FirstStepProps) => {
    return (
      <div className="p-6 max-h-[60vh] overflow-y-auto motion-preset-focus">
        <div className="mb-4 flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 px-2 py-1"
          >
            Đã giao hàng
          </Badge>
          <span className="text-sm text-gray-500">
            Đơn hàng{" "}
            <span className="text-sky-500 font-semibold text-base underline">
              #{orderId}
            </span>
          </span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Chọn sản phẩm muốn trả
            </h3>

            {setGoogleDriveLink && (
              <GoogleDriveLinkInput
                label="Link Google Drive ảnh(video) chứng minh?"
                linkGoogleDrive={googleDriveLink}
                setLinkGoogleDrive={setGoogleDriveLink}
              />
            )}
          </div>
          <div className="space-y-3">
            {orderDetail.data?.value?.orderItems.map((item: OrderItemTypes) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-start w-full gap-3 p-3 rounded-lg border transition-all duration-200",
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

                <div className="flex flex-col items-start flex-1 w-full ">
                  <div className="w-full">
                    <OrderItem item={item} />
                  </div>

                  {selectedItems.includes(item.id) && (
                    <>
                      <div className="flex items-center gap-2 my-2 w-full">
                        <div className="mb-6 flex-1 w-full">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Tình trạng sản phẩm
                          </h3>

                          <Select
                            value={selectedItemsDetails[item.id]?.productStatus}
                            // onValueChange={setItemCondition}

                            onValueChange={(value) =>
                              setSelectedItemsDetails(
                                (prev: SelectedItemsDetailsType) => {
                                  // console.log(value);
                                  return {
                                    ...prev,
                                    [item.id]: {
                                      ...prev[item.id],
                                      productStatus: value,
                                    },
                                  };
                                }
                              )
                            }
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

                        <div className="mb-6 flex-1 w-full">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Số lượng sản phẩm
                          </h3>

                          <Select
                            value={
                              selectedItemsDetails[item.id]?.quantity ?? "1"
                            }
                            // onValueChange={setItemCondition}

                            onValueChange={(value) =>
                              setSelectedItemsDetails(
                                (prev: SelectedItemsDetailsType) => {
                                  // console.log(value);
                                  return {
                                    ...prev,
                                    [item.id]: {
                                      ...prev[item.id],
                                      quantity: value,
                                    },
                                  };
                                }
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn số lượng" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: item.quantity })
                                .fill(0)
                                .map((_, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      value={(index + 1).toString()}
                                    >
                                      {index + 1}
                                    </SelectItem>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label className="text-sm font-medium text-slate-700 mb-2">
                          Tải ảnh minh chứng
                        </Label>
                        <FileUpload
                          onChange={(files: File[]) =>
                            setSelectedItemsDetails(
                              (
                                prev: Record<
                                  string,
                                  {
                                    reason: string;
                                    productStatus: string;
                                    images: File[];
                                  }
                                >
                              ) => ({
                                ...prev,
                                [item.id]: {
                                  ...prev[item.id],
                                  images: files,
                                },
                              })
                            )
                          }
                        />
                      </div>

                      {/* <FileUpload onChange={handleImageChange} /> */}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Tình trạng sản phẩm
          </h3>
          <Select value={itemCondition} onValueChange={setItemCondition}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn tình trạng sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              {itemConditions.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        <ReasonContent
          reasons={returnReasons}
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
          additionalComments={additionalComments}
          setAdditionalComments={setAdditionalComments}
          preferredAction={preferredAction}
          setPreferredAction={setPreferredAction}
        />
      </div>
    );
  }
);

FistStep.displayName = "FistStep";
