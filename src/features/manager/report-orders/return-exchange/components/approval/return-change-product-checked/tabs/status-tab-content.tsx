import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, DollarSign, Package, RotateCcw } from "lucide-react";
import StatusBadge from "../components/status-badge";
import { ReturnExchangeRequestItem } from "../types/return-exchange";
import { OrderReturnItem } from "@/types/order-detail.types";

interface StatusTabContentProps {
  items: OrderReturnItem[];
}

export default function StatusTabContent({ items }: StatusTabContentProps) {
  return (
    <div
      className="space-y-4 motion-preset-slide-right 
"
    >
      <div className=" ">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-slate-500" />
              Trạng thái yêu cầu
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.returnExchangeRequestItemId}
                    className="flex items-center justify-between p-2 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-white border border-slate-200">
                        {item.orderItem.orderItemDetails?.[0]?.image ? (
                          <Image
                            src={
                              item.orderItem.orderItemDetails[0].image ||
                              "/placeholder.svg"
                            }
                            alt={item.orderItem.orderItemDetails[0].name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package className="h-4 w-4 m-2 text-slate-400" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-sky-500 ">
                        {item.orderItem.orderItemDetails?.[0]?.name ||
                          item.orderItem.name}
                      </span>
                    </div>
                    <StatusBadge status={item.requestItemStatus} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
