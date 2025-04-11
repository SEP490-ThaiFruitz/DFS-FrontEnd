"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GripVertical, Minus, Plus, X } from "lucide-react";
import type { ComboItem } from "./custom-combo-builder";
import { motion, AnimatePresence } from "framer-motion";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { formatVND } from "@/lib/format-currency";

interface SelectedItemsProps {
  items: ComboItem[];
  onUpdateQuantity: (productVariantId: string, quantity: number) => void;
  onRemoveItem: (productVariantId: string) => void;
}

interface SortableItemProps {
  item: ComboItem;
  onUpdateQuantity: (productVariantId: string, quantity: number) => void;
  onRemoveItem: (productVariantId: string) => void;
}

export function SelectedItems({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: SelectedItemsProps) {
  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence>
        {items.map((item) => (
          <SortableItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function SortableItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const price = item.variant.promotion
    ? item.variant.promotion.price
    : item.variant.price;

  const hasDiscount = item?.variant?.promotion !== null;
  const discountPrice = item?.variant?.promotion?.price;
  const originalPrice = item.variant.price;

  // const productVariantId = item?.productVariantId;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDragging ? 0.6 : 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging ? "0 5px 10px rgba(0,0,0,0.1)" : "none",
        zIndex: isDragging ? 10 : 0,
      }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      ref={setNodeRef}
      style={style}
      className="flex gap-3 pb-4 border-b border-gray-100 relative"
    >
      {/* Drag handle */}
      <motion.div
        {...attributes}
        {...listeners}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={16} />
      </motion.div>

      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
        <Image
          src={item.variant.imageVariant || item.product.mainImageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-grow">
        <h4 className="font-bold text-base line-clamp-1 italics text-gray-900 mb-1">
          {item.product.name}
        </h4>
        <p className="text-xs text-slate-500 mb-1">
          {item.variant.packageType} - {item.variant.netWeight}g
        </p>

        <span className="text-xs text-slate-500 font-bold mb-1">📦 Single</span>

        <div className="flex justify-between items-center">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none"
              onClick={() =>
                onUpdateQuantity(item.productVariantId, item.quantity - 1)
              }
            >
              <Minus size={14} />
              <span className="sr-only">Giảm</span>
            </Button>

            <motion.span
              key={item.quantity}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="w-8 text-center text-sm"
            >
              {item.quantity}
            </motion.span>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none"
              onClick={() =>
                onUpdateQuantity(item.productVariantId, item.quantity + 1)
              }
              disabled={item.quantity >= item.variant.stockQuantity}
            >
              <Plus size={14} />
              <span className="sr-only">Tăng</span>
            </Button>
          </div>

          <div className="text-right">
            {/* <div className="flex items-center gap-1">  */}

            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <motion.div
                  // key={item.variant.promotion.price * item.quantity}
                  key={`variant-${item.productVariantId}-${item.quantity}`}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-bold text-base text-sky-500"
                >
                  {formatVND((discountPrice as number) * item.quantity)}
                </motion.div>

                <motion.div
                  key={price * item.quantity}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-bold text-xs text-rose-500 line-through"
                >
                  {formatVND(originalPrice * item.quantity)}
                </motion.div>
              </div>
            ) : (
              <motion.div
                // key={price * item.quantity}
                key={`variant-${item.productVariantId}-${item.quantity}`}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="font-bold text-base text-sky-500"
              >
                {formatVND(price * item.quantity)}
              </motion.div>
            )}
            {/* </div> */}
            <div className="text-xs text-slate-700 mt-1">
              <span className="text-gray-500  mr-1">{formatVND(price)}</span> x{" "}
              {item.quantity}
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-gray-400 hover:text-red-500 self-start"
        onClick={() => onRemoveItem(item.productVariantId)}
      >
        <X size={14} />
        <span className="sr-only">Xóa</span>
      </Button>
    </motion.div>
  );
}
