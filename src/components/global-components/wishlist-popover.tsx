import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Heart, HeartPulseIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { AnimatePresence, motion } from "framer-motion";
import { formatVND } from "@/lib/format-currency";
import Image from "next/image";
import Link from "next/link";

export const WishlistPopover = () => {
  const { wishlist, removeFromWishlist } = useWishlistStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative inline-flex text-sm h-11 w-10 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer">
          <div className="relative">
            <HeartPulseIcon className="size-5 motion-preset-blink motion-duration-2000 text-rose-600" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={wishlist.length}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {wishlist.length}
                  </motion.span>
                </AnimatePresence>
              </span>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-4">
        <h4 className="text-lg font-semibold mb-2 text-rose-500 flex items-center gap-1">
          <HeartPulseIcon className=" text-rose-600" fill="red" /> Danh sách yêu
          thích
        </h4>
        {wishlist.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Bạn chưa yêu thích sản phẩm nào!
          </p>
        ) : (
          <ul className="space-y-3 max-h-[300px] overflow-auto pr-1">
            {wishlist.map((product) => {
              const hasDiscount = product?.promotion?.price;

              const discountPrice = hasDiscount ? product?.promotion?.price : 0;

              const originalPrice = product.price;

              return (
                <li
                  key={product.productVariantId}
                  className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 w-full"
                >
                  <Link
                    href={`/product/${product.productId}`}
                    className="flex items-center gap-3 rounded-xl border p-3 bg-muted/30 w-full"
                  >
                    <Image
                      src={product.image}
                      alt={product.packageType}
                      width={64}
                      height={64}
                      className="rounded-xl object-cover border size-16"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm truncate">
                        {product.packageType}
                      </p>

                      {!hasDiscount && (
                        <p className="text-base text-sky-500 font-semibold">
                          {formatVND(product.price)}
                        </p>
                      )}

                      {hasDiscount && (
                        <div className="flex items-center gap-1">
                          <span className="text-base text-sky-500 font-semibold ">
                            {formatVND(discountPrice ?? 0)}
                          </span>
                          <span className="text-sm text-rose-500 font-semibold line-through">
                            {formatVND(originalPrice)}
                          </span>
                        </div>
                      )}

                      {product.promotion ? (
                        <p className="text-base text-sky-500 font-semibold">
                          KM: Giảm {product.promotion.percentage}%
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeFromWishlist(product.productVariantId)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};
