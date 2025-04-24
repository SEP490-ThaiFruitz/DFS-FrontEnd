import { OrderReturnItem } from "@/types/order-detail.types";
import ReturnItemCard from "../components/return-items-card";
import { ReturnExchangeRequestItem } from "../types/return-exchange";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ItemsTabContentProps {
  items: OrderReturnItem[];
}

export default function ItemsTabContent({ items }: ItemsTabContentProps) {
  return (
    <ScrollArea
      className="h-200px motion-preset-slide-right 
"
    >
      {items.map((item) => (
        <ReturnItemCard key={item.returnExchangeRequestItemId} item={item} />
      ))}
    </ScrollArea>
  );
}
