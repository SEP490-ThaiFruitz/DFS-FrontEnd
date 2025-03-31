// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import {
//   AlertCircle,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   FlaskConical,
//   Heart,
//   HelpCircle,
//   Info,
//   Leaf,
//   ListTree,
//   LucideIcon,
//   MessageCircleMore,
//   Minus,
//   Plus,
//   Share2,
//   ShieldCheck,
//   ShoppingBag,
//   ShoppingCart,
//   Star,
//   Truck,
//   Users,
// } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Progress } from "@/components/ui/progress";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import Link from "next/link";
// import { toast } from "sonner";
// import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
// import { DetailTab } from "./tabs-content/detail-tab";
// import { CertificateTab } from "./tabs-content/certificate-tab";
// import { NutritionTab } from "./tabs-content/nutrition-tab";
// import { ReviewsTab } from "./tabs-content/reviews-tab";
// import { CountdownTimer } from "./countdown-timer";
// import {
//   ProductDetailTypes,
//   ProductVariantTypes,
// } from "./product-detail.types";

// interface ProductDetailProps {
//   product: ProductDetailTypes;
// }

// // Mock data for related products
// const relatedProducts = [
//   {
//     id: "1",
//     name: "Hạt điều rang muối",
//     price: 120000,
//     image:
//       "https://nuts.com/images/auto/510/340/fit/assets/5d15c0a1c4d0d1c3.jpg",
//     rating: 4.5,
//   },
//   {
//     id: "2",
//     name: "Nho khô không hạt",
//     price: 85000,
//     image:
//       "https://nuts.com/images/auto/510/340/fit/assets/a9e3f741e9e7c3a0.jpg",
//     rating: 4.2,
//   },
//   {
//     id: "3",
//     name: "Hạnh nhân rang",
//     price: 150000,
//     image:
//       "https://nuts.com/images/auto/510/340/fit/assets/c9a0f0a1c4d0d1c3.jpg",
//     rating: 4.8,
//   },
//   {
//     id: "4",
//     name: "Táo sấy",
//     price: 95000,
//     image:
//       "https://nuts.com/images/auto/510/340/fit/assets/b9e3f741e9e7c3a0.jpg",
//     rating: 4.0,
//   },
// ];

// // Frequently bought together products
// const frequentlyBoughtTogether = [
//   {
//     id: "5",
//     name: "Granola hạt dinh dưỡng",
//     price: 75000,
//     image:
//       "https://nuts.com/images/auto/510/340/fit/assets/d9e3f741e9e7c3a0.jpg",
//     rating: 4.7,
//   },
//   {
//     id: "6",
//     name: "Hạt chia hữu cơ",
//     price: 65000,
//     image:
//       "https://nuts.com/images/auto/510/340/fit/assets/e9e3f741e9e7c3a0.jpg",
//     rating: 4.6,
//   },
// ];

// // Mock nutritional data
// const nutritionalData = {
//   servingSize: "28g (1/4 cup)",
//   calories: 100,
//   totalFat: 0,
//   saturatedFat: 0,
//   transFat: 0,
//   cholesterol: 0,
//   sodium: 0,
//   totalCarbohydrate: 24,
//   dietaryFiber: 3,
//   sugars: 18,
//   protein: 1,
//   vitaminD: 0,
//   calcium: 0,
//   iron: 2,
//   potassium: 4,
//   vitaminC: 2,
// };

// const TABS: {
//   id: string;
//   label: string;
//   icon: LucideIcon;
// }[] = [
//   {
//     id: "detail",
//     label: "Chi tiết",
//     icon: ListTree,
//   },

//   {
//     id: "nutrition",
//     label: "Dinh dưỡng",
//     icon: FlaskConical,
//   },
//   {
//     id: "certificate",
//     label: "Chứng nhận",
//     icon: ShieldCheck,
//   },
//   {
//     id: "reviews",
//     label: "Đánh giá",
//     icon: MessageCircleMore,
//   },
// ];

// export default function ProductDetail({ product }: ProductDetailProps) {
//   // const product = productData.value;
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariantTypes>(
//     product.productVariantDetail[0]
//   );
//   const [quantity, setQuantity] = useState(1);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [showMobileCart, setShowMobileCart] = useState(false);
//   const [selectedFrequentlyBought, setSelectedFrequentlyBought] = useState([
//     true,
//     true,
//   ]);

//   const allImages = [
//     product.mainImageUrl,
//     ...product.productImages.map((img) => img.imageUrl),
//     ...product.productVariantDetail.map((variant) => variant.image),
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 300) {
//         setShowMobileCart(true);
//       } else {
//         setShowMobileCart(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handlePrevImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? allImages.length - 1 : prev - 1
//     );
//   };

//   const handleNextImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === allImages.length - 1 ? 0 : prev + 1
//     );
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const calculateDiscountedPrice = (price: number, percentage: number) => {
//     return price - price * (percentage / 100);
//   };

//   const handleQuantityChange = (change: number) => {
//     const newQuantity = quantity + change;
//     if (
//       newQuantity >= 1 &&
//       newQuantity <= (selectedVariant?.stockQuantity ?? 0)
//     ) {
//       setQuantity(newQuantity);
//     }
//   };

//   const handleAddToCart = () => {
//     toast.success(
//       `Đã thêm vào giỏ hàng ${quantity} ${product.name} - ${selectedVariant.packageType}`
//     );
//   };

//   const handleToggleWishlist = () => {
//     toast.success(
//       isInWishlist
//         ? "Đã xóa khỏi danh sách yêu thích"
//         : "Đã thêm vào danh sách yêu thích"
//     );
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product.name,
//         text: product.description,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);

//       toast.success("Đã sao chép liên kết sản phẩm");
//     }
//   };

//   // Calculate days until promotion ends
//   const calculatePromotionDaysLeft = (endDate: Date | string) => {
//     if (!endDate) return 0;
//     const end = new Date(endDate).getTime(); // Chuyển thành số
//     const now = new Date().getTime(); // Chuyển thành số
//     const diffTime = end - now;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 ? diffDays : 0;
//   };
//   const promotionDaysLeft = selectedVariant.promotion
//     ? calculatePromotionDaysLeft(selectedVariant.promotion.endDate)
//     : 0;

//   // Calculate stock status
//   const calculateStockStatus = (quantity: number, reOrderPoint: number) => {
//     if (quantity <= reOrderPoint * 0.5) return "low";
//     if (quantity <= reOrderPoint) return "medium";
//     return "high";
//   };

//   const stockStatus = calculateStockStatus(
//     selectedVariant.stockQuantity ?? 0,
//     selectedVariant.reOrderPoint
//   );

//   // Format date
//   const formatDate = (dateString: Date | string) => {
//     return new Date(dateString).toLocaleDateString("vi-VN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // Calculate total for frequently bought together
//   const calculateFrequentlyBoughtTotal = () => {
//     let total = selectedVariant.promotion
//       ? calculateDiscountedPrice(
//           selectedVariant.price,
//           selectedVariant.promotion.percentage
//         ) * quantity
//       : selectedVariant.price * quantity;

//     frequentlyBoughtTogether.forEach((item, index) => {
//       if (selectedFrequentlyBought[index]) {
//         total += item.price;
//       }
//     });

//     return formatPrice(total);
//   };

//   const [tab, setTab] = useState(TABS[0].id);

//   return (
//     <main className="bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <nav className="flex items-center text-sm text-gray-500 mb-6">
//           <Link href="/" className="hover:text-primary transition-colors">
//             Trang chủ
//           </Link>
//           <ChevronRight className="h-4 w-4 mx-2" />
//           <Link href="/" className="hover:text-primary transition-colors">
//             Chi tiết sản phẩm
//           </Link>
//           <ChevronRight className="h-4 w-4 mx-2" />

//           <ChevronRight className="h-4 w-4 mx-2" />
//           <span className="text-gray-900 font-medium">{product.name}</span>
//         </nav>

//         <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 cardStyle">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
//             {/* Product Images */}
//             <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
//               <div className="space-y-4">
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <div
//                       className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer group"
//                       style={{ display: "block" }}
//                     >
//                       <Image
//                         src={allImages[currentImageIndex] || "/placeholder.svg"}
//                         alt={product.name}
//                         fill
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                         quality={90} // Adjust between 75-90 for good balance
//                         className="object-cover rounded-3xl transition-all duration-300 group-hover:scale-105 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md"
//                         priority
//                       />
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePrevImage();
//                         }}
//                         className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100 transition-opacity"
//                         aria-label="Previous image"
//                       >
//                         <ChevronLeft className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleNextImage();
//                         }}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100 transition-opacity"
//                         aria-label="Next image"
//                       >
//                         <ChevronRight className="h-5 w-5" />
//                       </button>
//                       {product.tags.includes("Organic") && (
//                         <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
//                           Organic
//                         </div>
//                       )}
//                       {selectedVariant.promotion && (
//                         <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
//                           -{selectedVariant.promotion.percentage}%
//                         </div>
//                       )}
//                     </div>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-4xl">
//                     <DialogHeader>
//                       <DialogTitle>Chi tiết ảnh</DialogTitle>
//                       <DialogDescription>
//                         Bạn có thể xem ảnh chi tiết sản phẩm tại đây.
//                       </DialogDescription>
//                     </DialogHeader>

//                     <div
//                       className="relative aspect-square rounded-3xl "
//                       style={{ display: "block" }}
//                     >
//                       <Image
//                         src={allImages[currentImageIndex] || "/placeholder.svg"}
//                         alt={product.name}
//                         fill
//                         sizes="(max-width: 1200px) 100vw, 80vw"
//                         loading="lazy"
//                         // quality={85}
//                         className="object-cover rounded-3xl transition-all duration-300"
//                       />
//                     </div>
//                   </DialogContent>
//                 </Dialog>

//                 {/* Thumbnails */}
//                 <div className="flex overflow-x-auto gap-3 pb-2 snap-x scrollbar-hide mt-2 p-2">
//                   {allImages.map((image, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentImageIndex(index)}
//                       className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden snap-start transition-all duration-200 ${
//                         currentImageIndex === index
//                           ? "ring-2 ring-sky-500 shadow-md scale-105"
//                           : "border border-gray-200 hover:border-sky-200 hover:shadow-sm"
//                       }`}
//                     >
//                       <Image
//                         src={image || "/placeholder.svg"}
//                         alt={`${product.name} thumbnail ${index + 1}`}
//                         width={80}
//                         height={80}
//                         className="w-full h-full object-cover "
//                         sizes="80px"
//                         placeholder="blur" // If you have blurDataURL for each image
//                         blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3C/svg%3E"
//                       />
//                     </button>
//                   ))}
//                 </div>

//                 {/* Product Actions - Mobile */}
//                 <div className="flex items-center gap-2 lg:hidden">
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={handleToggleWishlist}
//                     className={
//                       isInWishlist
//                         ? "text-rose-500 border-rose-200 bg-rose-50"
//                         : ""
//                     }
//                   >
//                     <Heart
//                       className={`h-5 w-5 ${
//                         isInWishlist ? "fill-rose-500" : ""
//                       }`}
//                     />
//                     <span className="sr-only">
//                       {isInWishlist
//                         ? "Xóa khỏi danh sách yêu thích"
//                         : "Thêm vào danh sách yêu thích"}
//                     </span>
//                   </Button>
//                   <Button variant="outline" size="icon" onClick={handleShare}>
//                     <Share2 className="h-5 w-5" />
//                     <span className="sr-only">Chia sẻ sản phẩm</span>
//                   </Button>
//                 </div>

//                 {/* Certification badges - Mobile */}
//                 <div className="flex flex-wrap gap-2 lg:hidden">
//                   {product.productCertification.slice(0, 3).map((cert) => (
//                     <TooltipProvider key={cert.id}>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <div className="bg-gray-100 p-2 rounded-full">
//                             <ShieldCheck className="h-5 w-5 text-green-600" />
//                           </div>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>{cert.name}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Product Info */}
//             <div className="p-6 lg:p-8">
//               <div className="space-y-6">
//                 <div>
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <Badge
//                         variant="outline"
//                         className="mb-2 bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-wider text-xs font-semibold"
//                       >
//                         Sản phẩm nổi bật
//                       </Badge>
//                       <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                         {product.name}
//                       </h1>
//                     </div>
//                     <div className="hidden lg:flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={handleToggleWishlist}
//                         className={
//                           isInWishlist
//                             ? "text-red-500 border-red-200 bg-red-50"
//                             : ""
//                         }
//                       >
//                         <Heart
//                           className={`h-5 w-5 ${
//                             isInWishlist ? "fill-red-500" : ""
//                           }`}
//                         />
//                         <span className="sr-only">
//                           {isInWishlist
//                             ? "Xóa khỏi danh sách yêu thích"
//                             : "Thêm vào danh sách yêu thích"}
//                         </span>
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={handleShare}
//                       >
//                         <Share2 className="h-5 w-5" />
//                         <span className="sr-only">Chia sẻ sản phẩm</span>
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap items-center gap-3 mt-3">
//                     <Badge
//                       variant="outline"
//                       className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
//                     >
//                       <Leaf className="h-3 w-3" />
//                       {product.tags[0]}
//                     </Badge>
//                     <Badge
//                       variant="outline"
//                       className="bg-blue-50 text-blue-700 border-blue-200"
//                     >
//                       {product.origin}
//                     </Badge>
//                     <div className="flex items-center text-amber-500">
//                       <Star className="h-4 w-4 fill-amber-500" />
//                       <Star className="h-4 w-4 fill-amber-500" />
//                       <Star className="h-4 w-4 fill-amber-500" />
//                       <Star className="h-4 w-4 fill-amber-500" />
//                       <Star className="h-4 w-4 fill-gray-200" />
//                       <span className="text-gray-600 text-sm ml-1">
//                         (3 đánh giá)
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <span className="text-gray-700 leading-relaxed">
//                   {product.description}
//                 </span>

//                 {/* Delivery Estimate */}
//                 <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-sky-700 text-sm cardStyle">
//                   <Truck className="h-5 w-5 flex-shrink-0" />
//                   <div>
//                     <span className="font-medium">Giao hàng nhanh</span>
//                     <span>
//                       Nhận hàng vào ngày{" "}
//                       {formatDate(
//                         new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
//                       )}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Variant Selection */}
//                 <div className="space-y-4">
//                   <h2 className="text-lg font-semibold flex items-center">
//                     Lựa chọn gói sản phẩm
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Info className="h-4 w-4 ml-2 text-gray-400" />
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p className="w-60">
//                             Chọn loại đóng gói phù hợp với nhu cầu sử dụng của
//                             bạn
//                           </p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {product.productVariantDetail.map((variant) => (
//                       <Card
//                         key={variant.productVariantId}
//                         className={`cursor-pointer transition-all cardStyle ${
//                           selectedVariant.productVariantId ===
//                           variant.productVariantId
//                             ? "ring-2 ring-sky-500 shadow-md"
//                             : "hover:border-sky-200 hover:shadow-sm"
//                         }`}
//                         onClick={() => setSelectedVariant(variant)}
//                       >
//                         <CardContent className="p-4">
//                           <div className="aspect-square relative mb-3 bg-gray-50 rounded-md overflow-hidden">
//                             <Image
//                               src={variant.image || "/placeholder.svg"}
//                               alt={`${product.name} - ${variant.packageType}`}
//                               fill
//                               className="object-cover"
//                               loading="lazy"
//                               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                             />
//                             {variant.promotion && (
//                               <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                                 -{variant.promotion.percentage}%
//                               </div>
//                             )}
//                           </div>
//                           <div className="space-y-2">
//                             <p
//                               className="font-medium text-sm truncate"
//                               title={variant.packageType}
//                             >
//                               {variant.packageType}
//                             </p>
//                             <div className="flex items-center justify-between">
//                               <p className="text-sm text-gray-500">
//                                 {variant.netWeight}g
//                               </p>
//                               <Badge
//                                 variant={
//                                   stockStatus === "low"
//                                     ? "destructive"
//                                     : stockStatus === "medium"
//                                     ? "outline"
//                                     : "secondary"
//                                 }
//                                 className="text-xs"
//                               >
//                                 {stockStatus === "low"
//                                   ? "Sắp hết hàng"
//                                   : stockStatus === "medium"
//                                   ? "Còn ít"
//                                   : "Còn hàng"}
//                               </Badge>
//                             </div>
//                             <div className="flex items-baseline gap-2">
//                               {variant.promotion ? (
//                                 <>
//                                   <span className="text-lg font-bold text-sky-600">
//                                     {formatPrice(
//                                       calculateDiscountedPrice(
//                                         variant.price,
//                                         variant.promotion.percentage
//                                       )
//                                     )}
//                                   </span>
//                                   <span className="text-sm line-through text-gray-400">
//                                     {formatPrice(variant.price)}
//                                   </span>
//                                 </>
//                               ) : (
//                                 <span className="text-lg font-bold text-sky-600">
//                                   {formatPrice(variant.price)}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Selected Variant Details */}
//                 <div className="bg-gray-50 p-5 rounded-lg space-y-4 cardStyle">
//                   {selectedVariant.promotion && (
//                     <div className="relative overflow-hidden rounded-md">
//                       <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 p-4 text-sm">
//                         <div className="flex items-start gap-3">
//                           <Clock className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
//                           <div className="space-y-1">
//                             <span className="font-medium text-rose-700">
//                               Khuyến mãi {selectedVariant.promotion.percentage}%
//                             </span>
//                             <span className="text-rose-600 text-xs">
//                               Kết thúc vào ngày{" "}
//                               {formatDate(selectedVariant.promotion.endDate)}
//                             </span>

//                             <div className="pt-1">
//                               <CountdownTimer
//                                 targetDate={
//                                   new Date(selectedVariant.promotion.endDate)
//                                 }
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex justify-between items-center">
//                     <h3 className="font-medium">Số lượng</h3>
//                     <div className="flex items-center border rounded-md bg-white shadow-sm">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleQuantityChange(-1)}
//                         disabled={quantity <= 1}
//                         className="h-9 w-9 rounded-none"
//                       >
//                         <span className="sr-only">Giảm</span>
//                         <Minus className="h-4 w-4" />
//                       </Button>
//                       <span className="w-12 text-center">{quantity}</span>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleQuantityChange(1)}
//                         disabled={
//                           quantity >= (selectedVariant.stockQuantity ?? 0)
//                         }
//                         className="h-9 w-9 rounded-none"
//                       >
//                         <span className="sr-only">Tăng</span>
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-muted-foreground">Còn lại:</span>
//                     <div className="flex items-center gap-2">
//                       <span>{selectedVariant.stockQuantity} sản phẩm</span>
//                       <Progress
//                         value={
//                           (selectedVariant.stockQuantity ??
//                             0 / (selectedVariant.reOrderPoint * 2)) * 100
//                         }
//                         className="w-16 h-1.5 bg-green-500"
//                         // indicatorClassName={getIndicatorClass()}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Hạn sử dụng:</span>
//                     <span>{selectedVariant.shelfLife} tháng</span>
//                   </div>

//                   <Separator />

//                   <div className="flex justify-between items-center">
//                     <span className="font-medium text-sm">Tổng tiền:</span>
//                     <div className="text-right">
//                       {selectedVariant.promotion && (
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="text-xs line-through text-muted-foreground">
//                             {formatPrice(selectedVariant.price * quantity)}
//                           </span>
//                           <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
//                             -{selectedVariant.promotion.percentage}%
//                           </span>
//                         </div>
//                       )}
//                       <span className="text-lg font-bold text-primary">
//                         {selectedVariant.promotion
//                           ? formatPrice(
//                               calculateDiscountedPrice(
//                                 selectedVariant.price,
//                                 selectedVariant.promotion.percentage
//                               ) * quantity
//                             )
//                           : formatPrice(selectedVariant.price * quantity)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                   <Button
//                     className="w-full h-12 text-lg gap-2 bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg transition-all"
//                     onClick={handleAddToCart}
//                   >
//                     <ShoppingCart className="h-5 w-5" />
//                     Thêm vào giỏ hàng
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="w-full h-12 text-lg gap-2 border-sky-200 text-sky-600 hover:bg-sky-50"
//                     onClick={handleToggleWishlist}
//                   >
//                     <Heart
//                       className={`h-5 w-5 ${
//                         isInWishlist ? "fill-rose-500 text-rose-500" : ""
//                       }`}
//                     />
//                     {isInWishlist
//                       ? "Đã thêm vào yêu thích"
//                       : "Thêm vào yêu thích"}
//                   </Button>
//                 </div>

//                 {/* Certifications Preview */}
//                 <div className="hidden lg:flex flex-wrap gap-2 mt-4">
//                   {product.productCertification.slice(0, 3).map((cert) => (
//                     <TooltipProvider key={cert.id}>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <div className="bg-gray-100 p-2 rounded-full">
//                             <ShieldCheck className="h-5 w-5 text-green-600" />
//                           </div>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>{cert.name}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   ))}
//                   {product.productCertification.length > 3 && (
//                     <Badge variant="outline" className="rounded-full">
//                       +{product.productCertification.length - 3}
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Frequently Bought Together */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6 lg:p-8">
//           <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
//             <Users className="h-5 w-5 text-indigo-500" />
//             Thường được mua cùng nhau
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="flex flex-col items-center">
//               <div className="relative w-40 h-40 mb-3">
//                 <Image
//                   src={selectedVariant.image || "/placeholder.svg"}
//                   alt={product.name}
//                   fill
//                   className="object-contain"
//                 />
//               </div>
//               <h3 className="font-medium text-center">{product.name}</h3>
//               <span className="text-sky-600 font-bold">
//                 {selectedVariant.promotion
//                   ? formatPrice(
//                       calculateDiscountedPrice(
//                         selectedVariant.price,
//                         selectedVariant.promotion.percentage
//                       ) * quantity
//                     )
//                   : formatPrice(selectedVariant.price * quantity)}
//               </span>
//               <Badge className="mt-2 bg-violet-100 text-violet-700 hover:bg-violet-200 border-0">
//                 Đã chọn
//               </Badge>
//             </div>

//             {frequentlyBoughtTogether.map((item, index) => (
//               <div key={item.id} className="flex flex-col items-center">
//                 <div className="relative w-40 h-40 mb-3">
//                   <Image
//                     src={item.image || "/placeholder.svg"}
//                     alt={item.name}
//                     fill
//                     className="object-contain"
//                   />
//                   <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">
//                     +
//                   </div>
//                 </div>
//                 <h3 className="font-medium text-center">{item.name}</h3>
//                 <p className="text-sky-600 font-bold">
//                   {formatPrice(item.price)}
//                 </p>
//                 <div className="mt-2">
//                   <Button
//                     variant={
//                       selectedFrequentlyBought[index] ? "default" : "outline"
//                     }
//                     size="sm"
//                     className={
//                       selectedFrequentlyBought[index]
//                         ? "bg-sky-100 text-sky-700 hover:bg-sky-200 border-0"
//                         : ""
//                     }
//                     onClick={() => {
//                       const newSelected = [...selectedFrequentlyBought];
//                       newSelected[index] = !newSelected[index];
//                       setSelectedFrequentlyBought(newSelected);
//                     }}
//                   >
//                     {selectedFrequentlyBought[index] ? "Đã chọn" : "Thêm"}
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <span className="text-gray-600 mb-1">
//                 Tổng tiền cho{" "}
//                 {1 + selectedFrequentlyBought.filter(Boolean).length} sản phẩm:
//               </span>
//               <span className="text-xl font-bold text-sky-600">
//                 {calculateFrequentlyBoughtTotal()}
//               </span>
//             </div>
//             <Button className="bg-sky-600 hover:bg-sky-700 shadow-md">
//               <ShoppingBag className="h-5 w-5 mr-2" />
//               Thêm tất cả vào giỏ hàng
//             </Button>
//           </div>
//         </div>

//         {/* Additional Information Tabs */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
//           {/* vercel tab */}

//           <VercelTab
//             tabs={TABS}
//             activeTab={tab}
//             onTabChange={setTab}
//             classNameContent="text-slate-800 "
//           />

//           {tab === "detail" ? (
//             <DetailTab
//               product={{
//                 description: product.description,
//                 dryingMethod: product.dryingMethod,
//                 moistureContent: product.moistureContent,
//               }}
//             />
//           ) : tab === "nutrition" ? (
//             <NutritionTab nutritionalData={product.productNutrition as any} />
//           ) : tab === "certificate" ? (
//             <CertificateTab
//               certificates={{
//                 productCertification: product.productCertification,
//               }}
//             />
//           ) : (
//             <ReviewsTab overallRatingResponse={product.overallRatingResponse} />
//           )}
//         </div>

//         {/* Related Products */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6 lg:p-8 cardStyle">
//           <h2 className="text-xl font-bold mb-6">Sản phẩm liên quan</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {relatedProducts.map((product) => (
//               <Card
//                 key={product.id}
//                 className="overflow-hidden shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]"
//               >
//                 <div className="aspect-square relative">
//                   <Image
//                     src={product.image || "/placeholder.svg"}
//                     alt={product.name}
//                     fill
//                     className="object-cover transition-transform hover:scale-105 duration-300"
//                   />
//                 </div>
//                 <CardContent className="p-3">
//                   <h3 className="font-medium truncate" title={product.name}>
//                     {product.name}
//                   </h3>
//                   <div className="flex justify-between items-center mt-1">
//                     <span className="font-bold text-sky-600">
//                       {formatPrice(product.price)}
//                     </span>
//                     <div className="flex items-center text-amber-500">
//                       <Star className="h-3 w-3 fill-amber-500" />
//                       <span className="text-xs ml-1">{product.rating}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Mobile Add to Cart Bar */}
//         <div
//           className={`fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex items-center gap-3 transition-transform duration-300 lg:hidden shadow-lg ${
//             showMobileCart ? "translate-y-0" : "translate-y-full"
//           }`}
//         >
//           <div className="flex-1">
//             <span className="font-medium truncate">{product.name}</span>
//             <span className="text-sky-600 font-bold">
//               {selectedVariant.promotion
//                 ? formatPrice(
//                     calculateDiscountedPrice(
//                       selectedVariant.price,
//                       selectedVariant.promotion.percentage
//                     ) * quantity
//                   )
//                 : formatPrice(selectedVariant.price * quantity)}
//             </span>
//           </div>
//           <Button
//             className="h-12 px-6 bg-sky-600 hover:bg-sky-700 shadow-md"
//             onClick={handleAddToCart}
//           >
//             <ShoppingCart className="h-5 w-5 mr-2" />
//             Thêm vào giỏ
//           </Button>
//         </div>
//       </div>
//     </main>
//   );
// }
