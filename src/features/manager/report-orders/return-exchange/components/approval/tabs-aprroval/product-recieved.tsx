import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatVND } from "@/lib/format-currency";
import { OrderReturnItem } from "@/types/order-detail.types";
import { CheckCircleIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

interface ProductReceivedProps {
  itemsData: {
    returnExchangeRequestItemId: string;
    receiveQuantity: number;
    note: string;
    acceptQuantity: number;
  }[];
  returnRequestData: OrderReturnItem[];
  handleItemReceiveQuantityChange: (id: string, quantity: number) => void;
  handleItemAcceptQuantityChange: (id: string, quantity: number) => void;
  handleItemNoteChange: (id: string, note: string) => void;
  totalRefundAmount: number;
}
export const ProductReceived = memo(
  ({
    itemsData,
    returnRequestData,
    handleItemReceiveQuantityChange,
    handleItemAcceptQuantityChange,
    handleItemNoteChange,
    totalRefundAmount,
  }: ProductReceivedProps) => {
    return (
      <ScrollArea className="max-h-[60vh] sm:max-h-[70vh] lg:max-h-[80vh] overflow-y-auto space-y-4 motion-preset-slide-right motion-duration-300">
        {itemsData.map((item, index) => {
          const originalItem = returnRequestData.find(
            (original) =>
              original.returnExchangeRequestItemId ===
              item.returnExchangeRequestItemId
          );

          return (
            <Card
              key={item.returnExchangeRequestItemId}
              className="overflow-hidden border-slate-200 cardStyle"
            >
              <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackageIcon className="size-8 text-slate-500" />
                    <CardTitle className="text-sm font-semibold">
                      {originalItem?.orderItem.name}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs font-normal">
                    ID: {item.returnExchangeRequestItemId.substring(0, 8)}
                    ...
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-3">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                      <Image
                        src={
                          originalItem?.orderItem.image || "/placeholder.svg"
                        }
                        alt={originalItem?.orderItem.name || "Sản phẩm"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-9 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor={`receive-quantity-${index}`}
                          className="text-sm font-medium"
                        >
                          Số lượng nhận
                        </Label>
                        <div className="flex items-center mt-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-r-none"
                            onClick={() =>
                              handleItemReceiveQuantityChange(
                                item.returnExchangeRequestItemId,
                                Math.max(0, item.receiveQuantity - 1)
                              )
                            }
                            disabled={item.receiveQuantity <= 0}
                          >
                            <span>-</span>
                          </Button>
                          <Input
                            id={`receive-quantity-${index}`}
                            type="number"
                            min="0"
                            max={originalItem?.customerQuantity || 1}
                            value={item.receiveQuantity}
                            onChange={(e) =>
                              handleItemReceiveQuantityChange(
                                item.returnExchangeRequestItemId,
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            autoFocus
                            className="rounded-none text-center h-9"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-l-none"
                            onClick={() =>
                              handleItemReceiveQuantityChange(
                                item.returnExchangeRequestItemId,
                                Math.min(
                                  originalItem?.customerQuantity || 1,
                                  item.receiveQuantity + 1
                                )
                              )
                            }
                            disabled={
                              item.receiveQuantity >=
                              (originalItem?.customerQuantity || 1)
                            }
                          >
                            <span>+</span>
                          </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                          Số lượng thực tế nhận được từ khách hàng
                        </p>
                      </div>
                      <div>
                        <Label
                          htmlFor={`accept-quantity-${index}`}
                          className="text-sm font-medium"
                        >
                          Số lượng chấp nhận
                        </Label>
                        <div className="flex items-center mt-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-r-none"
                            onClick={() =>
                              handleItemAcceptQuantityChange(
                                item.returnExchangeRequestItemId,
                                Math.max(0, item.acceptQuantity - 1)
                              )
                            }
                            disabled={item.acceptQuantity <= 0}
                          >
                            <span>-</span>
                          </Button>
                          <Input
                            id={`accept-quantity-${index}`}
                            type="number"
                            min="0"
                            max={originalItem?.customerQuantity || 1}
                            value={item.acceptQuantity}
                            onChange={(e) =>
                              handleItemAcceptQuantityChange(
                                item.returnExchangeRequestItemId,
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            className="rounded-none text-center h-9"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-l-none"
                            onClick={() =>
                              handleItemAcceptQuantityChange(
                                item.returnExchangeRequestItemId,
                                Math.min(
                                  originalItem?.customerQuantity || 1,
                                  item.acceptQuantity + 1
                                )
                              )
                            }
                            disabled={
                              item.acceptQuantity >=
                              (originalItem?.customerQuantity || 1)
                            }
                          >
                            <span>+</span>
                          </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                          Số lượng được chấp nhận để hoàn tiền
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor={`item-note-${index}`}
                        className="text-sm font-medium"
                      >
                        Ghi chú cho sản phẩm
                      </Label>
                      <Textarea
                        id={`item-note-${index}`}
                        placeholder="Nhập ghi chú cho sản phẩm này"
                        value={item.note}
                        onChange={(e) =>
                          handleItemNoteChange(
                            item.returnExchangeRequestItemId,
                            e.target.value
                          )
                        }
                        className="mt-1.5 resize-none cardStyle"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 cardStyle">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600">
                          Đơn giá:
                        </span>
                        <span className="font-medium">
                          {formatVND(originalItem?.orderItem.unitPrice || 0)}
                        </span>
                      </div>
                      {(originalItem?.orderItem.percentage || 0) > 0 && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm font-semibold text-slate-600">
                            Giảm giá:
                          </span>
                          <span className="text-rose-500">
                            -{originalItem?.orderItem.percentage}%
                          </span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Hoàn tiền cho sản phẩm:
                        </span>
                        <span className="text-emerald-600 font-semibold">
                          {formatVND(
                            (originalItem?.orderItem.discountPrice || 0) *
                              item.acceptQuantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="size-8 text-green-500" />
              <span className="font-medium">Tổng số tiền hoàn lại</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatVND(totalRefundAmount)}
            </span>
          </div>
        </div>
      </ScrollArea>
    );
  }
);

ProductReceived.displayName = "ProductReceived";
