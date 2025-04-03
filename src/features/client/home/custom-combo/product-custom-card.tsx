"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Star, Plus, Info, Grab } from "lucide-react";

import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { formatVND } from "@/lib/format-currency";
import { Product, ProductVariant } from "@/hooks/use-cart-store";

interface ProductCardProps {
  product: Product;
  onAddToCombo: (product: Product, variant: ProductVariant) => void;
}

export function ProductCard({ product, onAddToCombo }: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variant[0]?.productVariantId || ""
  );

  const selectedVariant = product.variant.find(
    (v) => v.productVariantId === selectedVariantId
  );

  // Create a unique ID for the draggable item
  const draggableId = `${product.id}::${selectedVariantId}`;

  // Set up draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: draggableId,
    data: {
      product,
      variant: selectedVariant,
    },
  });

  const handleAddToCombo = () => {
    if (selectedVariant) {
      onAddToCombo(product, selectedVariant);
    }
  };

  // Calculate the discounted price if there's a promotion
  const discountPrice = selectedVariant?.promotion?.price;

  const originalPrice = selectedVariant?.price || 0;
  const hasDiscount = selectedVariant?.promotion !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md border-gray-100 group cardStyle">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={selectedVariant?.imageVariant || product.mainImageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-500"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 right-3 bg-rose-500 font-medium">
              -{selectedVariant?.promotion?.percentage}%
            </Badge>
          )}

          <motion.div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-1.5 cursor-grab active:cursor-grabbing shadow-sm"
          >
            <Grab size={16} className="text-gray-600" />
          </motion.div>
        </div>

        <CardContent className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-slate-100"
                >
                  <Info size={16} className="text-slate-500" />
                  <span className="sr-only">Chi tiết</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl text-slate-700 font-semibold line-clamp-3">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-5">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-50">
                    <Image
                      src={product.mainImageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < product.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      Đã bán: {product.quantitySold}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {product?.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-normal"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full">
                      Đóng
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < product.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-200"
                }
              />
            ))}
          </div>

          <div className="mb-4">
            <Select
              value={selectedVariantId}
              onValueChange={setSelectedVariantId}
            >
              <SelectTrigger className="w-full text-sm font-semibold ">
                <SelectValue placeholder="Chọn loại đóng gói" />
              </SelectTrigger>
              <SelectContent>
                {product.variant.map((variant) => (
                  <SelectItem
                    key={variant.productVariantId}
                    value={variant.productVariantId}
                  >
                    {variant.packageType} - {variant.netWeight}g
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {discountPrice ? (
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-bold text-sky-500/70  hover:text-xl 2xl:hover:text-2xl transition-all duration-150">
                {formatVND(discountPrice)}
              </h2>
              <span className="text-sm text-[#fdba74] line-through">
                {formatVND(originalPrice)}
              </span>
            </div>
          ) : (
            <h2 className="text-lg font-bold text-sky-500/70  hover:text-xl 2xl:hover:text-2xl transition-all duration-150">
              {formatVND(originalPrice)}
            </h2>
          )}

          {/* <div className="flex items-baseline gap-2">
            <span className="font-bold text-slate-900">
              {formatVND(discountPrice ?? 0)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {formatVND(originalPrice)}
              </span>
            )}
          </div> */}
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Button
            onClick={handleAddToCombo}
            className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white group-hover:shadow-md transition-all hoverAnimate"
            disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
          >
            <Plus size={16} className="mr-1" />
            Thêm vào combo
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
