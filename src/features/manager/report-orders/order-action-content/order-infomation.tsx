import { AlignJustify } from "lucide-react";
import { getStatusText } from "../order-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  OrderItem,
  OrderItemSkeleton,
} from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "@/types/types";
import { OrderDetailTypes } from "@/types/report-orders.types";
import { vietnameseDate } from "@/utils/date";
import { memo } from "react";
import { OrderItem as OrderItemTypes } from "@/features/client/payment/successful/payment-successful.types";
import { EmptyState } from "@/components/global-components/empty-state";

interface OrderInformationProps {
  queryFn: UseQueryResult<ApiResponse<OrderDetailTypes>, Error>;

  title?: string;
  className?: string;

  orderItems: OrderItemTypes[] | [];
}
export const OrderInformation = memo(
  ({
    queryFn,
    title = "Thông tin đơn hàng",
    className,
    orderItems,
  }: OrderInformationProps) => {
    // const orderItems = queryFn.data?.value?.orderItems || [];

    // console.log({ orderItems });
    return (
      <div className="mb-6 w-full">
        <h3 className="text-sm flex items-center gap-1 font-bold text-slate-700 mb-2">
          <AlignJustify className="size-6" /> {title}
        </h3>

        {orderItems && orderItems?.length > 0 ? (
          <div className="p-4  cardStyle">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700">
                Đơn hàng{" "}
                <span className="text-slate-700">
                  # {queryFn.data?.value?.orderId ?? ""}
                </span>
              </span>
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                {getStatusText(
                  (queryFn.data?.value?.orderStatus as string) ?? ""
                )}
              </Badge>
            </div>
            <div className="text-xs font-bold text-gray-500 mb-4">
              Đặt ngày{" "}
              <span className="text-sky-500 font-semibold">
                {vietnameseDate(
                  (queryFn.data?.value?.buyDate as string) ?? "",
                  true
                )}
              </span>
            </div>

            <div className="space-y-4">
              {orderItems?.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Không có đơn hàng nào"
            description="Đơn hàng này không có sản phẩm nào"
          />
        )}

        {/* {!queryFn.isLoading ? (
          <div className="p-4  cardStyle">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700">
                Đơn hàng{" "}
                <span className="text-slate-700">
                  # {queryFn.data?.value?.orderId ?? ""}
                </span>
              </span>
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                {getStatusText(
                  (queryFn.data?.value?.orderStatus as string) ?? ""
                )}
              </Badge>
            </div>
            <div className="text-xs font-bold text-gray-500 mb-4">
              Đặt ngày{" "}
              <span className="text-sky-500 font-semibold">
                {vietnameseDate(
                  (queryFn.data?.value?.buyDate as string) ?? "",
                  true
                )}
              </span>
            </div>

            <div className="space-y-4">
              {orderItems?.map((item) => (
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
        )} */}
      </div>
    );
  }
);

OrderInformation.displayName = "OrderInformation";
