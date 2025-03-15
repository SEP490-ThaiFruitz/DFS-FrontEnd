import { formatVND } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ViewCardProductProps {
  productName: string;
  productPrice: number;
  productQuantity: number;
  productImage: string;
  productPercentage: number;
  productDiscountPrice: number;
  className?: string;
}
export const ViewCardProduct = ({
  productName,
  productImage,
  productPrice,
  productQuantity,
  productPercentage,
  productDiscountPrice,
  className,
}: ViewCardProductProps) => {
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
        <p className="text-sm text-muted-foreground">
          Số lượng: {productQuantity}
        </p>
      </div>
      {productPercentage > 0 && (
        <p className="font-light text-slate-400 line-through">
          {formatVND((productPrice * productQuantity).toFixed(2))}
        </p>
      )}
      <p className="font-medium">
        {productPercentage > 0 ? formatVND((productDiscountPrice * productQuantity).toFixed(2)) : formatVND((productPrice * productQuantity).toFixed(2))}
      </p>
    </div>
  );
};
