import { cn } from "@/lib/utils";

interface ViewCardProductProps {}

interface ViewCardProductProps {
  productName: string;
  productPrice: number;
  productQuantity: number;
  productImage: string;

  className?: string;
}
export const ViewCardProduct = ({
  productName,
  productImage,
  productPrice,
  productQuantity,
  className,
}: ViewCardProductProps) => {
  return (
    <div className={cn("flex items-center gap-4 my-2", className)}>
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
      <p className="font-medium">
        ${(productPrice * productQuantity).toFixed(2)}
      </p>
    </div>
  );
};
