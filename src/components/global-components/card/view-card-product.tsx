import { FeedbackDialog } from "@/components/custom/_custom-dialog/feedback-dialog";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ViewCardProductProps {
  orderItemId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productImage: string;
  productPercentage: number;
  productDiscountPrice: number;
  orderStatus: string;
  isFeedback: boolean;
  className?: string;
}
export const ViewCardProduct = ({
  productName,
  productImage,
  productPrice,
  productQuantity,
  productPercentage,
  productDiscountPrice,
  orderStatus,
  isFeedback,
  orderItemId,
  className,
}: ViewCardProductProps) => {
  const [feedback, setFeedback] = useState<string | undefined>(undefined);
  return (
    <div className={cn("flex items-center gap-4 my-2", className)}>
      <Image
        src={productImage}
        alt={productName}
        width={1000}
        height={1000}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="font-medium">{productName}</h3>
        <span className="text-sm text-muted-foreground">
          Số lượng: {productQuantity}
        </span>
      </div>
      {productPercentage > 0 && (
        <span className="font-light text-slate-400 line-through">
          {formatVND((productPrice * productQuantity).toFixed(2))}
        </span>
      )}
      <span className="font-medium">
        {productPercentage > 0
          ? formatVND((productDiscountPrice * productQuantity).toFixed(2))
          : formatVND((productPrice * productQuantity).toFixed(2))}
      </span>
      {orderStatus === "Delivered" && isFeedback === false && (
        <Button onClick={() => setFeedback(orderItemId)} size={"sm"}>
          Đánh giá
        </Button>
      )}
      <FeedbackDialog
        refreshKey={["Customer", "Orders"]}
        isUpdateFeedback={false}
        orderItemId={orderItemId}
        isOpen={feedback !== undefined}
        onClose={() => setFeedback(undefined)}
      />
    </div>
  );
};
