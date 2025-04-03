"use client";

import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-custom-card";
import { SelectedItems } from "./select-item";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ComboDropZone } from "./combo-drop-zone";
import Image from "next/image";
import { CuisineSelector } from "@/components/custom/_custom_select/cuisine-selector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import axios from "axios";
import Cookie from "js-cookie";
import { Search, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product, ProductVariant } from "@/hooks/use-cart-store";

// Define types based on the provided data structure
// export type Promotion = {
//   startDate: string;
//   endDate: string;
//   percentage: number;
//   price: number;
// };

// export type ProductVariant = {
//   productVariantId: string;
//   imageVariant: string;
//   packageType: string;
//   netWeight: number;
//   price: number;
//   stockQuantity: number;
//   promotion: Promotion | null;
// };

// export type Category = {
//   id: string;
//   name: string;
//   thumbnail: string;
// };

// export type Product = {
//   id: string;
//   name: string;
//   mainImageUrl: string;
//   description: string;
//   tags: string[];
//   categories: Category[];
//   variant: ProductVariant[];
//   rating: number;
//   quantitySold: number;
// };

export type ComboItem = {
  id: string; // Using productVariantId as id
  productVariantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
};

export type CustomCombo = {
  comboId: string | null;
  name: string;
  comboItems: {
    productVariantId: string;
    quantity: number;
  }[];

  description?: string | null;
};

interface CustomComboBuilderProps {
  productsData: Product[];
}

export const CustomComboBuilder = memo(
  ({ productsData }: CustomComboBuilderProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<ComboItem[]>([]);
    const [comboName, setComboName] = useState<string>("Tùy chọn Combo!");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [activeTags, setActiveTags] = useState<string[]>([]);

    const [activeItem, setActiveItem] = useState<ComboItem | null>(null);

    // Get unique categories from all products
    const categories = [
      { id: "all", name: "Tất cả" },
      ...Array.from(
        new Set(
          productsData
            .flatMap((product) => product.categories)
            .filter(Boolean)
            .map((category) => JSON.stringify(category))
        )
      ).map((categoryString) => JSON.parse(categoryString)),
    ];

    // Get unique tags from all products
    const allTags = Array.from(
      new Set(
        productsData
          .flatMap((product: Product) => product.tags)
          .filter(Boolean)
          .map((tag: string | undefined) => tag?.trim())
      )
    ).sort();

    useEffect(() => {
      // Initialize products from the data
      setProducts(productsData);
    }, [productsData]);

    const filteredProducts = products?.filter((product) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Filter by category
      const matchesCategory =
        activeCategory === "all" ||
        product.categories.some((category) => category.id === activeCategory);

      // Filter by tags
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) =>
          product?.tags?.some(
            (productTag) =>
              productTag.trim().toLowerCase() === tag.toLowerCase()
          )
        );

      return matchesSearch && matchesCategory && matchesTags;
    });

    const toggleTag = (tag: string) => {
      setActiveTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    };

    const clearFilters = () => {
      setSearchTerm("");
      setActiveCategory("all");
      setActiveTags([]);
    };

    const addToCombo = (product: Product, variant: ProductVariant) => {
      const existingItemIndex = selectedItems.findIndex(
        (item) => item.productVariantId === variant.productVariantId
      );

      if (existingItemIndex >= 0) {
        // Item already exists, increment quantity
        const updatedItems = [...selectedItems];
        updatedItems[existingItemIndex].quantity += 1;
        setSelectedItems(updatedItems);
      } else {
        // Add new item
        setSelectedItems([
          ...selectedItems,
          {
            id: variant.productVariantId, // Using productVariantId as id for dnd-kit
            productVariantId: variant.productVariantId,
            quantity: 1,
            product,
            variant,
          },
        ]);
      }

      toast.success(
        `Đã thêm ${product.name} - ${variant.packageType} vào combo`
      );
    };

    const updateItemQuantity = (productVariantId: string, quantity: number) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        setSelectedItems(
          selectedItems.filter(
            (item) => item.productVariantId !== productVariantId
          )
        );
      } else {
        // Update quantity
        setSelectedItems(
          selectedItems.map((item) =>
            item.productVariantId === productVariantId
              ? { ...item, quantity }
              : item
          )
        );
      }
    };

    const removeItem = (productVariantId: string) => {
      setSelectedItems(
        selectedItems.filter(
          (item) => item.productVariantId !== productVariantId
        )
      );
    };

    const calculateTotalPrice = () => {
      return selectedItems.reduce((total, item) => {
        const price = item.variant.promotion
          ? item.variant.promotion.price
          : item.variant.price;
        return total + price * item.quantity;
      }, 0);
    };

    const accessToken = Cookie.get("accessToken") || null;

    const handleSubmit = async () => {
      if (comboName.trim() === "") {
        toast.warning("Vui lòng nhập tên cho combo của bạn");

        return;
      }

      if (selectedItems.length === 0) {
        toast.warning("Vui lòng chọn ít nhất một sản phẩm cho combo của bạn");

        return;
      }

      const comboData: CustomCombo = {
        comboId: null,
        name: comboName,
        description: "test description",
        comboItems: selectedItems.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      };

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_URL_API}/Combos/custom`,
          comboData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(response);

        if (response.status === 200) {
          toast.success("Tạo combo thành công!");

          console.log(response.data);

          setComboName("");
          setSelectedItems([]);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tạo combo. Vui lòng thử lại sau.");
      }

      // Here you would normally send the data to your API

      // Reset form after successful submission
    };

    // Handle drag start event
    const handleDragStart = (event: DragStartEvent) => {
      const { active } = event;
      const draggedItemId = active.id as string;

      // Find the product and variant being dragged
      const productId = draggedItemId.split("::")[0];
      const variantId = draggedItemId.split("::")[1];

      const product = products.find((p) => p.id === productId);
      const variant = product?.variant.find(
        (v) => v.productVariantId === variantId
      );

      if (product && variant) {
        setActiveItem({
          id: draggedItemId,
          productVariantId: variant.productVariantId,
          quantity: 1,
          product,
          variant,
        });
      }
    };

    const handleComboReorder = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setSelectedItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    // Handle drag end event
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && over.id === "combo-drop-zone" && activeItem) {
        // Check if item already exists in combo
        const existingItemIndex = selectedItems.findIndex(
          (item) => item.productVariantId === activeItem.productVariantId
        );

        if (existingItemIndex >= 0) {
          // Item already exists, increment quantity
          const updatedItems = [...selectedItems];
          updatedItems[existingItemIndex].quantity += 1;
          setSelectedItems(updatedItems);
        } else {
          // Add new item
          setSelectedItems([...selectedItems, activeItem]);
        }

        toast.success("Đã thêm vào combo");
      }

      // Reset active item
      setActiveItem(null);
    };

    return (
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 motion-preset-pop">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-[oklch(0.929 0.013 255.508)] shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-700" />
                    <Input
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 focus-visible:ring-slate-400"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* <span className="text-sm text-slate-500 whitespace-nowrap">
                  Danh mục:
                </span> */}
                  {/* <select
                  className="border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select> */}

                  <Select
                    onValueChange={(setValue) => setActiveCategory(setValue)}
                    value={activeCategory}
                    defaultValue="all"
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Lọc theo loại" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Loại của sản phẩm</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags filter */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {activeTags.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="ml-auto text-xs text-slate-700 hover:text-slate-700"
                    >
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <CuisineSelector
                    title="Lọc theo thẻ"
                    options={allTags as string[]}
                    activeOptions={activeTags.length ? activeTags : []}
                    toggleCuisine={toggleTag}
                  />
                </div>
              </div>

              <AnimatePresence>
                {filteredProducts.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
                  >
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCombo={addToCombo}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16 text-slate-500 bg-slate-50 rounded-lg"
                  >
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-slate-300 mb-4" />
                      <p className="text-lg font-medium mb-2">
                        Không tìm thấy sản phẩm phù hợp
                      </p>
                      <p className="text-sm text-slate-400 mb-4">
                        Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                      </p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="border-slate-300"
                      >
                        Xóa bộ lọc
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4 h-full">
            <ComboDropZone>
              <div className="rounded-xl shadow-sm p-6 sticky top-4 cardStyle">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="text-slate-900" size={20} />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Combo của bạn
                  </h2>
                </div>
                <h3 className="text-sm text-slate-700 font-semibold ">
                  Tạo Combo cần tối thiểu 4 sản phẩm
                </h3>

                <div className="mb-6">
                  <Label
                    htmlFor="combo-name"
                    className="text-slate-700 mb-1.5 block"
                  >
                    Tên combo
                  </Label>
                  <Input
                    id="combo-name"
                    placeholder="Nhập tên cho combo của bạn"
                    value={comboName}
                    onChange={(e) => setComboName(e.target.value)}
                    className="border-slate-200 focus-visible:ring-slate-400"
                  />
                </div>

                <Separator className="my-6 bg-slate-100" />

                <DndContext onDragEnd={handleComboReorder}>
                  <AnimatePresence>
                    {selectedItems.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <ScrollArea className="h-[400px] pr-4">
                          <SelectedItems
                            items={selectedItems}
                            onUpdateQuantity={updateItemQuantity}
                            onRemoveItem={removeItem}
                          />
                        </ScrollArea>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg"
                      >
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 font-medium">
                          Chưa có sản phẩm nào được chọn
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          Hãy thêm sản phẩm vào combo của bạn
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DndContext>

                {selectedItems.length > 0 && (
                  <>
                    <Separator className="my-6 bg-slate-100" />
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-medium text-slate-700">
                        Tổng tiền:
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(calculateTotalPrice())}
                      </span>
                    </div>
                  </>
                )}

                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={handleSubmit}
                  disabled={
                    selectedItems.length === 0 || comboName.trim() === ""
                  }
                >
                  Tạo combo
                </Button>
              </div>
            </ComboDropZone>
          </div>
        </div>

        <DragOverlay>
          {activeItem && (
            <div className="bg-white rounded-lg shadow-md p-3 w-64 opacity-90">
              <div className="flex gap-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-slate-50">
                  <Image
                    src={
                      activeItem.variant.imageVariant ||
                      activeItem.product.mainImageUrl
                    }
                    alt={activeItem.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm line-clamp-1">
                    {activeItem.product.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {activeItem.variant.packageType}
                  </p>
                  <p className="text-xs font-semibold text-green-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      activeItem.variant.promotion
                        ? activeItem.variant.promotion.price
                        : activeItem.variant.price
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
        {/* <Toaster /> */}
      </DndContext>
    );
  }
);

CustomComboBuilder.displayName = "CustomComboBuilder";
