"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  calculateDiscountedPrice,
  calculateStockStatus,
  formatPrice,
} from "../product-lib";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import VariantSelector from "./variant-selector";
import {
  ProductDetailTypes,
  ProductVariantTypes,
} from "../product-detail.types";
import { ProductActions } from "./product-actions";
import FrequentlyBoughtTogether from "./frequency-bought-together";
import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
import { DetailTab } from "../tabs-content/detail-tab";
import { NutritionTab } from "../tabs-content/nutrition-tab";
import { CertificateTab } from "../tabs-content/certificate-tab";
import { ReviewsTab } from "../tabs-content/reviews-tab";
import { Button } from "@/components/ui/button";
import {
  FlaskConical,
  ListTree,
  LucideIcon,
  MessageCircleMore,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import Breadcrumb from "./breadcrumb";
import { RelatedProduct } from "./related-product";

// Dummy data for testing purposes. Replace with actual data fetching.

const TABS: {
  id: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    id: "detail",
    label: "Chi tiết",
    icon: ListTree,
  },

  {
    id: "nutrition",
    label: "Dinh dưỡng",
    icon: FlaskConical,
  },
  {
    id: "certificate",
    label: "Chứng nhận",
    icon: ShieldCheck,
  },
  {
    id: "reviews",
    label: "Đánh giá",
    icon: MessageCircleMore,
  },
];

const frequentlyBoughtTogether = [
  {
    id: 1,
    name: "Additional Product 1",
    image: "/placeholder.svg",
    price: 25000,
  },
  {
    id: 2,
    name: "Additional Product 2",
    image: "/placeholder.svg",
    price: 30000,
  },
];

interface ProductDetailProps {
  product: ProductDetailTypes;
}
export default function ProductDetail({ product }: ProductDetailProps) {
  // const product = productData.value
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantTypes>(
    product.productVariantDetail[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [selectedFrequentlyBought, setSelectedFrequentlyBought] = useState([
    true,
    true,
  ]);
  const [tab, setTab] = useState(TABS[0].id);

  const allImages = [
    product.mainImageUrl,
    ...product.productImages.map((img) => img.imageUrl),
    ...product.productVariantDetail.map((variant) => variant.image),
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowMobileCart(true);
      } else {
        setShowMobileCart(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (
      newQuantity >= 1 &&
      newQuantity <= (selectedVariant?.stockQuantity ?? 0)
    ) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    toast.success(
      `Đã thêm vào giỏ hàng ${quantity} ${product.name} - ${selectedVariant.packageType}`
    );
  };

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast.success(
      isInWishlist
        ? "Đã xóa khỏi danh sách yêu thích"
        : "Đã thêm vào danh sách yêu thích"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết sản phẩm");
    }
  };

  // Calculate total for frequently bought together
  const calculateFrequentlyBoughtTotal = () => {
    let total = selectedVariant?.promotion
      ? calculateDiscountedPrice(
          selectedVariant?.price,
          selectedVariant?.promotion.percentage
        ) * quantity
      : selectedVariant?.price * quantity;

    frequentlyBoughtTogether.forEach((item, index) => {
      if (selectedFrequentlyBought[index]) {
        total += item?.price;
      }
    });

    return formatPrice(total);
  };

  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb productName={product.name} />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 cardStyle">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <ProductGallery
              images={allImages}
              productName={product.name}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              tags={product.tags}
              promotion={selectedVariant?.promotion}
              handleToggleWishlist={handleToggleWishlist}
              handleShare={handleShare}
              isInWishlist={isInWishlist}
              productCertification={product.productCertification}
            />

            {/* Product Info */}
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              handleToggleWishlist={handleToggleWishlist}
              handleShare={handleShare}
              isInWishlist={isInWishlist}
            >
              {/* Variant Selection */}
              <VariantSelector
                variants={product.productVariantDetail}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                formatPrice={formatPrice}
                calculateDiscountedPrice={calculateDiscountedPrice}
              />

              {/* Product Actions */}
              <ProductActions
                selectedVariant={selectedVariant}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist}
                formatPrice={formatPrice}
                calculateDiscountedPrice={calculateDiscountedPrice}
              />
            </ProductInfo>
          </div>
        </div>

        {/* Frequently Bought Together */}
        <FrequentlyBoughtTogether
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          selectedFrequentlyBought={selectedFrequentlyBought}
          setSelectedFrequentlyBought={setSelectedFrequentlyBought}
          calculateFrequentlyBoughtTotal={calculateFrequentlyBoughtTotal}
          calculateDiscountedPrice={calculateDiscountedPrice}
          frequentlyBoughtTogether={frequentlyBoughtTogether}
        />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* vercel tab */}

          <VercelTab
            tabs={TABS}
            activeTab={tab}
            onTabChange={setTab}
            classNameContent="text-slate-800 "
          />

          {tab === "detail" ? (
            <DetailTab
              product={{
                description: product.description,
                dryingMethod: product.dryingMethod,
                moistureContent: product.moistureContent,
              }}
            />
          ) : tab === "nutrition" ? (
            <NutritionTab nutritionalData={product.productNutrition as any} />
          ) : tab === "certificate" ? (
            <CertificateTab
              certificates={{
                productCertification: product.productCertification,
              }}
            />
          ) : (
            <ReviewsTab overallRatingResponse={product.overallRatingResponse} />
          )}
        </div>

        <RelatedProduct />

        <div
          className={`fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex items-center gap-3 transition-transform duration-300 lg:hidden shadow-lg ${
            showMobileCart ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex-1">
            <span className="font-medium truncate">{product.name}</span>
            <span className="text-sky-600 font-bold">
              {selectedVariant?.promotion
                ? formatPrice(
                    calculateDiscountedPrice(
                      selectedVariant?.price,
                      selectedVariant.promotion.percentage
                    ) * quantity
                  )
                : formatPrice(selectedVariant?.price * quantity)}
            </span>
          </div>
          <Button
            className="h-12 px-6 bg-sky-600 hover:bg-sky-700 shadow-md"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </main>
  );
}
