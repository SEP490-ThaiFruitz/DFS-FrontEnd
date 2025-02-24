import { cn } from "@/lib/utils";

interface ViewCardProductActionsProps {}

interface ViewCardProductActionsProps {
  productName: string;
  productPrice: number;
  productQuantity: number;
  productImage: string;

  className?: string;
}
export const ViewCardProductActions = ({
  productName,
  productImage,
  productPrice,
  productQuantity,
  className,
}: ViewCardProductActionsProps) => {
  return (
    <div className={cn("flex  gap-4 my-2", className)}>
      <img
        src={productImage}
        alt={productName}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="font-medium">{productName}</h3>
        <p className="text-sm text-muted-foreground">
          Số lượng: {productQuantity}
        </p>
      </div>
      <div className="flex flex-col items-center gap-x-1">
        <span>110.000đ</span>

        <del>99.000đ</del>
      </div>
    </div>
  );
};
