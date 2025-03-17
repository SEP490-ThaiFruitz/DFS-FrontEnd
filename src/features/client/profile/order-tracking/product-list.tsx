import { ViewCardProduct } from "@/components/global-components/card/view-card-product";

export interface OrderItem {
  id: string;
  referenceId: string;
  name: string;
  image: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  percentage: number;
  discountPrice: number;
  isFeedback: boolean;
}

interface ProductListProps {
  orderItems: OrderItem[],
  orderStatus: string,
}
export const ProductList = ({ orderItems, orderStatus }: Readonly<ProductListProps>) => {
  return (
    <div className="space-y-4">
      {orderItems.map((item: OrderItem) => (
        <ViewCardProduct
          orderItemId={item.id}
          orderStatus={orderStatus}
          key={item.referenceId}
          isFeedback={item.isFeedback}
          productName={item.name}
          productPrice={item.unitPrice}
          productQuantity={item.quantity}
          productImage={item.image}
          productPercentage={item.percentage}
          productDiscountPrice={item.discountPrice}
        />
      ))}
    </div>
  );
};
