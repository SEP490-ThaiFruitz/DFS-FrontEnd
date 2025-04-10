import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { ViewCardProduct } from "@/components/global-components/card/view-card-product";
import { OrderItem as OrderItemTypes } from "../../payment/successful/payment-successful.types";
import { useState } from "react";
import { FeedbackDialog } from "@/components/custom/_custom-dialog/feedback-dialog";

interface ProductListProps {
  orderItems: OrderItemTypes[];
  orderStatus: string;
}
export const ProductList = ({
  orderItems,
  orderStatus,
}: Readonly<ProductListProps>) => {
  const [feedback, setFeedback] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-4">
      {orderItems.map((item: OrderItemTypes) => (
        <>
          <OrderItem key={item.id} item={item} />

          <FeedbackDialog
            refreshKey={["Customer", "Orders"]}
            isUpdateFeedback={false}
            orderItemId={item.id}
            isOpen={feedback !== undefined}
            onClose={() => setFeedback(undefined)}
          />
        </>

        // <ViewCardProduct
        //   orderItemId={item.id}
        //   orderStatus={orderStatus}
        //   key={item.referenceId}
        //   isCanFeedback={item.isCanFeedback}
        //   productName={item.name}
        //   productPrice={item.unitPrice}
        //   productQuantity={item.quantity}
        //   productImage={item.image}
        //   productPercentage={item.percentage}
        //   productDiscountPrice={item.discountPrice}
        // />
      ))}
    </div>
  );
};
