import Image from "next/image";
import { Package, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageDisplay } from "./image-display";
import { OrderReturnItem } from "@/types/order-detail.types";
import { orderTypeLabel, placeholderImage } from "@/utils/label";
import { formatVND } from "@/lib/format-currency";

interface ReturnItemCardProps {
  item: OrderReturnItem;
}

export function ReturnItemCard({ item }: ReturnItemCardProps) {
  return (
    <Card className="overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow cardStyle">
      <CardContent className="p-0">
        <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b flex justify-between items-center">
          <h3 className="font-semibold">{item.orderItem.name}</h3>
          <Badge
            variant="outline"
            className="bg-white border-emerald-200 text-emerald-700"
          >
            {item.requestItemStatus}
          </Badge>
        </div>

        <div className="p-5">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="md:w-1/4">
              <div className="relative h-40 w-full overflow-hidden rounded-md border bg-slate-50 shadow-sm">
                <Image
                  src={item.orderItem.image || placeholderImage}
                  alt={item.orderItem.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-3/4 grid gap-6 sm:grid-cols-2 ">
              <div>
                <h4 className="text-sm font-medium mb-3 pb-2 border-b flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-emerald-600" />
                  Thông tin sản phẩm
                </h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p className="text-slate-700 font-semibold">Loại:</p>
                  <p className="font-medium">
                    {orderTypeLabel(item.orderItem.itemType)}
                  </p>

                  <p className="text-slate-700 font-semibold">Số lượng:</p>
                  <p className="font-medium">{item.orderItem.quantity}</p>

                  <p className="text-slate-700 font-semibold">Giá niêm yết:</p>
                  <p className="font-semibold text-sky-500">
                    {formatVND(item.orderItem.unitPrice)}
                  </p>

                  <p className="text-slate-700 font-semibold">Giảm giá:</p>
                  <p className="font-medium">{item.orderItem.percentage}%</p>

                  <p className="text-slate-700 font-semibold">Giá đã giảm:</p>
                  <p className="font-semibold text-green-700">
                    {formatVND(item.orderItem.discountPrice)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3 pb-2 border-b flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-emerald-600" />
                  Thông tin trả hàng
                </h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p className="text-slate-700 font-semibold">Tình trạng:</p>
                  <p className="font-medium">{item.productStatus}</p>

                  <p className="text-slate-700 font-semibold">Số lượng trả:</p>
                  <p className="font-medium">{item.customerQuantity}</p>

                  {item.receiveQuantity !== null && (
                    <>
                      <p className="text-slate-700 font-semibold">
                        Số lượng nhận:
                      </p>
                      <p className="font-medium">{item.receiveQuantity}</p>
                    </>
                  )}

                  {item.acceptQuantity !== null && (
                    <>
                      <p className="text-slate-700 font-semibold">
                        Số lượng chấp nhận:
                      </p>
                      <p className="font-medium">{item.acceptQuantity}</p>
                    </>
                  )}

                  {item.refundAmount !== null && (
                    <>
                      <p className="text-slate-700 font-semibold">
                        Số tiền hoàn lại:
                      </p>
                      <p className="font-medium text-emerald-700">
                        {item.refundAmount.toLocaleString()} ₫
                      </p>
                    </>
                  )}
                </div>

                {item.note && (
                  <div className="mt-3 bg-slate-50 p-2 rounded-md">
                    <p className="text-muted-foreground text-sm">Ghi chú:</p>
                    <p className="text-sm">{item.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Image */}
          {item.customerImage && (
            <ImageDisplay
              src={item.customerImage || "/placeholder.svg"}
              alt="Hình ảnh khách hàng cung cấp"
              title="Hình ảnh khách hàng cung cấp"
            />
          )}

          {/* Received Image */}
          {item.receiveImage && (
            <ImageDisplay
              src={item.receiveImage || "/placeholder.svg"}
              alt="Hình ảnh sản phẩm nhận lại"
              title="Hình ảnh sản phẩm nhận lại"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
