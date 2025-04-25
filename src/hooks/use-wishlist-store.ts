import { ProductVariantTypes } from "@/features/product-detail/product-detail.types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  wishlist: ProductVariantTypes[];
  addToWishlist: (product: ProductVariantTypes) => void;
  removeFromWishlist: (productVariantId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productVariantId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (product) => {
        const { wishlist } = get();
        const exists = wishlist.some(
          (p) => p.productVariantId === product.productVariantId
        );
        // if (!exists) {
        //   set({ wishlist: [...wishlist, product] });
        // }

        if (!exists) {
          set({ wishlist: [...wishlist, product] });
          toast.success("Đã thêm vào danh sách yêu thích ❤️");
        } else {
          toast("Sản phẩm đã có trong danh sách yêu thích");
        }
      },

      removeFromWishlist: (productVariantId) => {
        set((state) => ({
          wishlist: state.wishlist.filter(
            (p) => p.productVariantId !== productVariantId
          ),
        }));

        toast.error("Đã xoá khỏi danh sách yêu thích 💔");
      },

      clearWishlist: () => set({ wishlist: [] }),

      isInWishlist: (productVariantId) => {
        return get().wishlist.some(
          (p) => p.productVariantId === productVariantId
        );
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
