"use client";

import { memo, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { OrderInformation } from "../order-action-content/order-infomation";

interface SecondStepProps {
  selectedReason: string;
  isOtherSelected: boolean;
  additionalComments: string;
  itemCondition: string;
  preferredAction: string;
  selectedOrderItem: any[];
  orderDetail: any;
  orderId: string;
}

const itemConditions = [
  { value: "Chưa mở hộp", label: "Chưa mở hộp" },
  {
    value: "Đã mở hộp nhưng chưa sử dụng",
    label: "Đã mở hộp nhưng chưa sử dụng",
  },
  { value: "Đã sử dụng nhưng không tốt", label: "Đã sử dụng nhưng không tốt" },
  { value: "Bị hư hỏng", label: "Bị hư hỏng" },
];

export const SecondStep = memo(
  ({
    selectedReason,
    isOtherSelected,
    additionalComments,
    itemCondition,
    preferredAction,
    selectedOrderItem,
    orderDetail,
    orderId,
  }: SecondStepProps) => {
    return (
      <div className="p-6 max-h-[60vh] overflow-y-auto motion-preset-focus">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-700 mb-2">
            Thông tin trả hàng
          </h3>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
            <div>
              <span className="text-base font-semibold text-slate-700">
                Lý do trả hàng:
              </span>
              <p className=" font-semibold text-violet-500">{selectedReason}</p>
              {isOtherSelected && additionalComments && (
                <div className="mt-1 pt-1 border-t border-dashed border-slate-200">
                  <p className="text-sm text-slate-600">{additionalComments}</p>
                </div>
              )}
            </div>

            <div>
              <span className="text-base text-slate-700 font-semibold">
                Yêu cầu:
              </span>
              <p className="font-semibold text-base text-violet-500">
                {preferredAction === "return" ? "Trả hàng" : "Đổi sản phẩm"}
              </p>
            </div>
          </div>
        </div>

        <OrderInformation
          queryFn={orderDetail}
          orderItems={selectedOrderItem}
          title="Thông đơn hàng sẽ được trả"
        />

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
                Sản phẩm trả lại phải còn nguyên vẹn, có đầy đủ bao bì, nhãn mác
                và phụ kiện đi kèm. Thời gian hoàn tiền có thể mất từ 7-14 ngày
                làm việc sau khi chúng tôi nhận được hàng trả lại.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SecondStep.displayName = "SecondStep";
