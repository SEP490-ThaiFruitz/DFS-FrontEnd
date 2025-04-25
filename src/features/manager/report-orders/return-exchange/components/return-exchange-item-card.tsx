import Image from "next/image";
import { Package, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageDisplay } from "./image-display";
import { OrderReturnItem } from "@/types/order-detail.types";
import { orderTypeLabel, placeholderImage } from "@/utils/label";
import { formatVND } from "@/lib/format-currency";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { JSX } from "react";
import StatusBadge from "./approval/return-change-product-checked/components/status-badge";

interface ReturnItemCardProps {
  // item: OrderReturnItem;
  item: Pick<
    OrderReturnItem,
    | "orderItem"
    | "requestItemStatus"
    | "productStatus"
    | "customerQuantity"
    | "receiveQuantity"
    | "acceptQuantity"
    | "refundAmount"
    | "note"
    | "customerImage"
    | "receiveImage"
  >;
}

const RowContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-1">{children}</div>;
};

export function ReturnItemCard({ item }: ReturnItemCardProps) {
  return (
    <Card className="overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow cardStyle">
      <CardContent className="p-0">
        <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b flex justify-between items-center">
          <h3 className="font-semibold text-sky-500">{item?.orderItem.name}</h3>
          {/* <Badge
            variant="outline"
            className="bg-white border-emerald-200 text-emerald-700"
          >
            {item?.requestItemStatus}
          </Badge> */}

          <StatusBadge status={item.requestItemStatus} />
        </div>

        <div className="p-5">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="md:w-2/4">
              <div className="relative h-48 w-full overflow-hidden rounded-md border bg-slate-50 shadow-sm cardStyle">
                <Image
                  src={item?.orderItem?.image || placeholderImage}
                  alt={item?.orderItem.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-3/4 grid gap-6 sm:grid-cols-2 ">
              <div>
                <h4 className="text-sm font-semibold mb-3 pb-2 border-b flex item?s-center gap-1.5">
                  <Package className="size-6 text-emerald-600" />
                  Thông tin sản phẩm
                </h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <p className="text-slate-700 text-base font-semibold">
                      Loại:
                    </p>
                    <AdvancedColorfulBadges
                      color="violet"
                      className="font-semibold w-fit"
                    >
                      {orderTypeLabel(item?.orderItem.itemType)}
                    </AdvancedColorfulBadges>
                  </div>

                  <div className="flex items-center gap-1">
                    <p className="text-base text-slate-700 font-semibold">
                      Số lượng:
                    </p>
                    <p className="font-semibold">{item?.orderItem.quantity}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <p className="text-base text-slate-700 font-semibold">
                      Giá niêm yết:
                    </p>
                    <span className="font-semibold text-base text-sky-500">
                      {formatVND(item?.orderItem.unitPrice)}
                    </span>
                  </div>

                  <RowContent>
                    <p className="text-base text-slate-700 font-semibold">
                      Giảm giá:
                    </p>
                    <span className="font-semibold text-base">
                      {item?.orderItem.percentage}%
                    </span>
                  </RowContent>

                  <RowContent>
                    <p className="text-base text-slate-700 font-semibold">
                      Giá đã giảm:
                    </p>
                    <span className="font-semibold text-base text-green-700">
                      {formatVND(item?.orderItem.discountPrice)}
                    </span>
                  </RowContent>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 pb-2 border-b flex item?s-center gap-1.5">
                  <FileText className="size-6 text-emerald-600" />
                  Thông tin trả hàng
                </h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <RowContent>
                    <p className="text-slate-700 text-base font-semibold">
                      Tình trạng:
                    </p>
                    <p className="font-semibold italic underline text-slate-700">
                      {item?.productStatus}
                    </p>
                  </RowContent>

                  <RowContent>
                    <p className="text-slate-700 text-base font-semibold">
                      Số lượng trả:
                    </p>
                    <span className="font-semibold text-base">
                      {item?.customerQuantity}
                    </span>
                  </RowContent>

                  {item?.receiveQuantity !== null && (
                    <>
                      <RowContent>
                        <p className="text-slate-700 text-base font-semibold">
                          Số lượng nhận:
                        </p>
                        <span className="font-semibold text-base">
                          {item?.receiveQuantity}
                        </span>
                      </RowContent>
                    </>
                  )}

                  {item?.acceptQuantity !== null && (
                    <>
                      <RowContent>
                        <p className="text-slate-700 text-base font-semibold">
                          Số lượng chấp nhận:
                        </p>
                        <span className="font-semibold text-base">
                          {item?.acceptQuantity}
                        </span>
                      </RowContent>
                    </>
                  )}

                  {item?.refundAmount !== null && (
                    <>
                      <RowContent>
                        <p className="text-slate-700 text-base font-semibold">
                          Số tiền hoàn lại:
                        </p>
                        <span className="font-medium text-base text-emerald-700">
                          {formatVND(item?.refundAmount ?? 0)}
                        </span>
                      </RowContent>
                    </>
                  )}
                </div>

                {item?.note && (
                  <div className="mt-3 bg-slate-50 p-2 rounded-md flex items-center">
                    <p className="text-slate-700 font-semibold text-base">
                      Ghi chú:
                    </p>
                    <p className="text-sm italic">{item.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Image */}
          {item?.customerImage && (
            <ImageDisplay
              src={item.customerImage || placeholderImage}
              alt="Hình ảnh khách hàng cung cấp"
              title="Hình ảnh khách hàng cung cấp"
            />
          )}

          {/* Received Image */}
          {item?.receiveImage && (
            <ImageDisplay
              src={item.receiveImage || placeholderImage}
              alt="Hình ảnh sản phẩm nhận lại"
              title="Hình ảnh sản phẩm nhận lại"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
