import { Card, CardContent } from "@/components/ui/card";
import { formatVND } from "@/lib/format-currency";
import { Star } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
const relatedProducts = [
  {
    id: "1",
    name: "Hạt điều rang muối",
    price: 120000,
    image: "/images/second-background.png",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Nho khô không hạt",
    price: 85000,
    image: "/images/second-background.png",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Hạnh nhân rang",
    price: 150000,
    image: "/images/second-background.png",
    rating: 4.8,
  },
  {
    id: "4",
    name: "Táo sấy",
    price: 95000,
    image: "/images/second-background.png",
    rating: 4.0,
  },
];

export const RelatedProduct = memo(() => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6 lg:p-8 cardStyle">
      <h2 className="text-xl font-bold mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] rounded-3xl"
          >
            <div className="aspect-square relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-105 duration-300 rounded-3xl"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium truncate" title={product.name}>
                {product.name}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className="font-bold text-sky-600">
                  {formatVND(product.price)}
                </span>
                <div className="flex items-center text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" />
                  <span className="text-xs ml-1">{product.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

RelatedProduct.displayName = "RelatedProduct";
