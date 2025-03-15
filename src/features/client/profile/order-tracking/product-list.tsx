import { ViewCardProduct } from "@/components/global-components/card/view-card-product";

export interface OrderItem {
  referenceId: string;
  name: string;
  image: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  percentage: number;
  discountPrice: number;
}

interface ProductListProps {
  orderItems: OrderItem[]
}
export const ProductList = ({orderItems}: Readonly<ProductListProps>) => {
  return (
    <div className="space-y-4">
      {orderItems.map((item: OrderItem) => (
        <ViewCardProduct
          key={item.referenceId}
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
