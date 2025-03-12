// "use client";

// import { useState, useEffect, useRef, useMemo } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Award,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Copy,
//   Facebook,
//   Gift,
//   Heart,
//   Home,
//   Info,
//   Instagram,
//   Leaf,
//   Minus,
//   Package,
//   Play,
//   Plus,
//   Repeat,
//   Search,
//   Send,
//   Share2,
//   ShieldCheck,
//   ShoppingBag,
//   ShoppingCart,
//   Star,
//   Truck,
//   Twitter,
//   Users,
//   Zap,
// } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
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
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Progress } from "@/components/ui/progress";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { useMobile } from "@/hooks/use-mobile";

// // Added more product images for a better gallery experience
// const additionalImages = [
//   "https://nuts.com/images/ct/images.cdn.us-central1.gcp.commercetools.com/fe6ef66f-361c-4adb-b11f-d4aa8f13c79c/1512_OrganicRaisins_-_XhBXhsi-medium.jpg",
//   "https://nuts.com/images/auto/raisins/raisins-organic-bowl.jpg",
//   "https://nuts.com/images/auto/raisins/organic-raisins-hand.jpg",
//   "https://nuts.com/images/auto/raisins/organic-raisins-packaging.jpg",
// ];

// // Added 360 degree view images
// const rotationImages = [
//   "/placeholder.svg?height=500&width=500&text=Rotation+1",
//   "/placeholder.svg?height=500&width=500&text=Rotation+2",
//   "/placeholder.svg?height=500&width=500&text=Rotation+3",
//   "/placeholder.svg?height=500&width=500&text=Rotation+4",
//   "/placeholder.svg?height=500&width=500&text=Rotation+5",
//   "/placeholder.svg?height=500&width=500&text=Rotation+6",
//   "/placeholder.svg?height=500&width=500&text=Rotation+7",
//   "/placeholder.svg?height=500&width=500&text=Rotation+8",
// ];

// // Added packaging type names based on IDs
// const packagingTypes = {
//   "a8202883-ef65-441f-a335-3224d8c600f6": "Premium Box",
//   "e82779ca-5bed-43c9-8836-980f89ff717c": "Standard Pack",
//   "754613af-e1e1-42d3-a382-0dae8a40117f": "Family Size",
// };

// // Added nutrition facts since they're null in the data
// const nutritionFacts = {
//   servingSize: "40g",
//   calories: 130,
//   totalFat: "0g",
//   saturatedFat: "0g",
//   transFat: "0g",
//   cholesterol: "0mg",
//   sodium: "5mg",
//   totalCarbohydrate: "31g",
//   dietaryFiber: "2g",
//   totalSugars: "29g",
//   addedSugars: "0g",
//   protein: "1g",
//   vitaminD: "0mcg",
//   calcium: "20mg",
//   iron: "0.7mg",
//   potassium: "270mg",
// };

// // Added product description since it's missing
// const productDescription =
//   "Our premium organic raisins (Nho khô) are naturally sweet and delicious, perfect for snacking, baking, or adding to your favorite recipes. These plump, juicy raisins are carefully sun-dried to preserve their natural sweetness and nutritional value. Rich in antioxidants, fiber, and essential minerals, they make a healthy addition to your daily diet. Enjoy them straight from the pack or use them in your favorite dishes for a natural sweetness boost.";

// // Added recipes for usage suggestions
// const recipes = [
//   {
//     title: "Morning Oatmeal Boost",
//     description:
//       "Add a handful of our organic raisins to your morning oatmeal for a natural sweetness and energy boost to start your day.",
//     ingredients: [
//       "1/2 cup oats",
//       "1 cup milk or water",
//       "2 tbsp organic raisins",
//       "1 tsp honey",
//       "Pinch of cinnamon",
//     ],
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     title: "Trail Mix Energy Blend",
//     description:
//       "Create a nutritious trail mix by combining our raisins with nuts and seeds for a perfect on-the-go snack.",
//     ingredients: [
//       "1/4 cup organic raisins",
//       "1/4 cup almonds",
//       "1/4 cup walnuts",
//       "2 tbsp pumpkin seeds",
//       "2 tbsp dark chocolate chips",
//     ],
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     title: "Moroccan Couscous Salad",
//     description:
//       "Elevate your couscous salad with the sweet touch of raisins, complementing the savory spices perfectly.",
//     ingredients: [
//       "1 cup couscous",
//       "2 tbsp organic raisins",
//       "1/4 cup diced cucumber",
//       "1/4 cup diced bell pepper",
//       "2 tbsp olive oil",
//       "1 tbsp lemon juice",
//       "Fresh mint leaves",
//     ],
//     image: "/placeholder.svg?height=200&width=300",
//   },
// ];

// // Added frequently asked questions
// const faqs = [
//   {
//     question: "Are these raisins organic?",
//     answer:
//       "Yes, our raisins are 100% certified organic, grown without synthetic pesticides or fertilizers.",
//   },
//   {
//     question: "How should I store these raisins?",
//     answer:
//       "For optimal freshness, store in a cool, dry place. After opening, you can refrigerate them in an airtight container to extend their shelf life.",
//   },
//   {
//     question: "Are these raisins suitable for vegans?",
//     answer:
//       "Yes, our organic raisins are completely plant-based and suitable for vegan diets.",
//   },
//   {
//     question: "Do these raisins contain added sugar?",
//     answer:
//       "No, our raisins contain only their natural fruit sugars with no added sweeteners.",
//   },
//   {
//     question: "What is the difference between the packaging options?",
//     answer:
//       "Our Premium Box offers the highest quality packaging for gifting, the Standard Pack is our everyday option, and the Family Size provides the best value for larger quantities.",
//   },
// ];

// // Added health benefits
// const healthBenefits = [
//   {
//     title: "Rich in Antioxidants",
//     description:
//       "Contains powerful antioxidants that help protect your cells from damage caused by free radicals.",
//     icon: <Zap className="h-8 w-8 text-amber-600" />,
//   },
//   {
//     title: "Supports Digestive Health",
//     description:
//       "High in soluble fiber that promotes healthy digestion and helps maintain regular bowel movements.",
//     icon: <Package className="h-8 w-8 text-amber-600" />,
//   },
//   {
//     title: "Natural Energy Source",
//     description:
//       "Provides a quick energy boost from natural fruit sugars, perfect for active lifestyles.",
//     icon: <Zap className="h-8 w-8 text-amber-600" />,
//   },
//   {
//     title: "Heart Health",
//     description:
//       "Contains potassium which helps maintain healthy blood pressure and heart function.",
//     icon: <Heart className="h-8 w-8 text-amber-600 fill-amber-100" />,
//   },
// ];

// // Added recently viewed products
// const recentlyViewed = [
//   {
//     id: "1",
//     name: "Organic Almonds",
//     price: 18500,
//     image: "/placeholder.svg?height=100&width=100",
//   },
//   {
//     id: "2",
//     name: "Dried Apricots",
//     price: 16200,
//     image: "/placeholder.svg?height=100&width=100",
//   },
//   {
//     id: "3",
//     name: "Mixed Nuts",
//     price: 22000,
//     image: "/placeholder.svg?height=100&width=100",
//   },
// ];

// // Added bundle products
// const bundleProducts = [
//   {
//     id: "1",
//     name: "Organic Almonds",
//     price: 18500,
//     image: "/placeholder.svg?height=100&width=100",
//     description: "Premium organic almonds, perfect for snacking or baking.",
//   },
//   {
//     id: "2",
//     name: "Dried Apricots",
//     price: 16200,
//     image: "/placeholder.svg?height=100&width=100",
//     description:
//       "Sweet and tangy dried apricots, a perfect complement to raisins.",
//   },
//   {
//     id: "3",
//     name: "Mixed Nuts",
//     price: 22000,
//     image: "/placeholder.svg?height=100&width=100",
//     description: "A delicious blend of premium nuts for a nutritious snack.",
//   },
//   {
//     id: "4",
//     name: "Organic Dates",
//     price: 19500,
//     image: "/placeholder.svg?height=100&width=100",
//     description: "Soft and sweet organic dates, nature's perfect dessert.",
//   },
// ];

// // Added certifications
// const certifications = [
//   {
//     name: "Organic Certified",
//     icon: <Leaf className="h-6 w-6" />,
//     description: "Certified organic by international standards",
//   },
//   {
//     name: "Non-GMO",
//     icon: <ShieldCheck className="h-6 w-6" />,
//     description: "Free from genetically modified organisms",
//   },
//   {
//     name: "Vegan Friendly",
//     icon: <Leaf className="h-6 w-6" />,
//     description: "100% plant-based product",
//   },
//   {
//     name: "Quality Tested",
//     icon: <Award className="h-6 w-6" />,
//     description: "Meets our rigorous quality standards",
//   },
// ];

// // Added subscription options
// const subscriptionOptions = [
//   { value: "none", label: "One-time purchase" },
//   { value: "weekly", label: "Weekly delivery (Save 10%)" },
//   { value: "biweekly", label: "Every 2 weeks (Save 8%)" },
//   { value: "monthly", label: "Monthly delivery (Save 5%)" },
// ];

// // Added gift options
// const giftOptions = [
//   { id: "gift-wrap", label: "Gift Wrap (+15,000₫)" },
//   { id: "gift-message", label: "Add Gift Message" },
//   { id: "gift-receipt", label: "Include Gift Receipt (No prices shown)" },
// ];

// // Added real-time notifications
// const recentPurchases = [
//   { name: "Minh", location: "Hanoi", time: "2 minutes ago" },
//   { name: "Linh", location: "Ho Chi Minh City", time: "15 minutes ago" },
//   { name: "Tuan", location: "Da Nang", time: "32 minutes ago" },
//   { name: "Hoa", location: "Can Tho", time: "1 hour ago" },
//   { name: "Nam", location: "Hue", time: "2 hours ago" },
// ];

// // Added user-generated content
// const userPhotos = [
//   "/placeholder.svg?height=150&width=150&text=User+Photo+1",
//   "/placeholder.svg?height=150&width=150&text=User+Photo+2",
//   "/placeholder.svg?height=150&width=150&text=User+Photo+3",
//   "/placeholder.svg?height=150&width=150&text=User+Photo+4",
//   "/placeholder.svg?height=150&width=150&text=User+Photo+5",
//   "/placeholder.svg?height=150&width=150&text=User+Photo+6",
// ];

// export default function ProductDetail() {
//   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isZoomed, setIsZoomed] = useState(false);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//   const [isSticky, setIsSticky] = useState(false);
//   const [showNotifyDialog, setShowNotifyDialog] = useState(false);
//   const [showVideoDialog, setShowVideoDialog] = useState(false);
//   const [showBundleDialog, setShowBundleDialog] = useState(false);
//   const [showGiftDialog, setShowGiftDialog] = useState(false);
//   const [email, setEmail] = useState("");
//   const [selectedTab, setSelectedTab] = useState("description");
//   const [viewMode, setViewMode] = useState("standard"); // standard, 360, video
//   const [rotationIndex, setRotationIndex] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStartX, setDragStartX] = useState(0);
//   const [subscriptionType, setSubscriptionType] = useState("none");
//   const [selectedGiftOptions, setSelectedGiftOptions] = useState([]);
//   const [giftMessage, setGiftMessage] = useState("");
//   const [selectedBundles, setSelectedBundles] = useState([]);
//   const [showRecentPurchase, setShowRecentPurchase] = useState(false);
//   const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0);
//   const [showQuickView, setShowQuickView] = useState(false);
//   const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
//   const [highContrastMode, setHighContrastMode] = useState(false);
//   const [largeText, setLargeText] = useState(false);
//   const [reducedMotion, setReducedMotion] = useState(false);
//   const imageRef = useRef(null);
//   const rotationRef = useRef(null);
//   const { toast } = useToast();
//   const isMobile = useMobile();

//   // Product data from the provided JSON with enhancements
//   const product = {
//     id: "1eb8fd3f-0c65-49d5-8e44-ea4535f3a87b",
//     name: "Nho khô",
//     englishName: "Premium Organic Raisins",
//     mainImageUrl:
//       "https://nuts.com/images/ct/images.cdn.us-central1.gcp.commercetools.com/fe6ef66f-361c-4adb-b11f-d4aa8f13c79c/1512_OrganicRaisins_-_XhBXhsi-medium.jpg",
//     productImages: additionalImages,
//     productVideo: "/placeholder.svg?height=500&width=500&text=Product+Video",
//     rotationImages: rotationImages,
//     productNutrition: nutritionFacts,
//     origin: "Vietnam",
//     harvestDate: "January 2025",
//     organicCertification: "USDA Organic",
//     sustainabilityInfo: "Eco-friendly farming practices, recyclable packaging",
//     productVariantDetail: [
//       {
//         productVariantId: "01c27ae5-2af6-4514-91dc-ded50377b351",
//         image:
//           "https://nuts.com/images/ct/images.cdn.us-central1.gcp.commercetools.com/fe6ef66f-361c-4adb-b11f-d4aa8f13c79c/1512_OrganicRaisins_-_XhBXhsi-medium.jpg",
//         productId: "1eb8fd3f-0c65-49d5-8e44-ea4535f3a87b",
//         packagingTypeId: "a8202883-ef65-441f-a335-3224d8c600f6",
//         netWeight: 1.2,
//         grossWeight: 1.5,
//         packagingLength: 9.4,
//         packagingWidth: 4.8,
//         packagingHeight: 3.9,
//         packagingVolume: 175.968,
//         shelfLife: "10 months",
//         price: 14500,
//         stockQuantity: 78,
//         reOrderPoint: 14,
//         promotion: {
//           discountPercentage: 10,
//           endDate: "2025-04-15",
//         },
//         rating: 4.2,
//         quantitySold: 156,
//         feedbacks: [
//           {
//             userId: "user1",
//             userName: "Minh Nguyen",
//             rating: 5,
//             comment: "Excellent quality raisins, very fresh and sweet!",
//             date: "2025-02-15",
//             helpful: 12,
//             images: ["/placeholder.svg?height=100&width=100&text=Review+Photo"],
//           },
//           {
//             userId: "user2",
//             userName: "Linh Tran",
//             rating: 4,
//             comment: "Good product, but the packaging could be improved.",
//             date: "2025-02-10",
//             helpful: 5,
//             images: [],
//           },
//         ],
//         overallRating: {
//           overallRating: 4.2,
//           quantityFeedback: 24,
//           fiveStar: 15,
//           fourStar: 6,
//           threeStar: 2,
//           twoStar: 1,
//           oneStar: 0,
//         },
//       },
//       {
//         productVariantId: "7ffc9215-4ec2-44cb-91f5-af186b4f0d61",
//         image:
//           "https://nuts.com/images/ct/images.cdn.us-central1.gcp.commercetools.com/fe6ef66f-361c-4adb-b11f-d4aa8f13c79c/1512_OrganicRaisins_-_XhBXhsi-medium.jpg",
//         productId: "1eb8fd3f-0c65-49d5-8e44-ea4535f3a87b",
//         packagingTypeId: "e82779ca-5bed-43c9-8836-980f89ff717c",
//         netWeight: 1.1,
//         grossWeight: 1.4,
//         packagingLength: 8.8,
//         packagingWidth: 4.5,
//         packagingHeight: 3.7,
//         packagingVolume: 146.52,
//         shelfLife: "10 months",
//         price: 14200,
//         stockQuantity: 0,
//         reOrderPoint: 16,
//         promotion: null,
//         rating: 4.0,
//         quantitySold: 132,
//         feedbacks: [],
//         overallRating: {
//           overallRating: 4.0,
//           quantityFeedback: 18,
//           fiveStar: 10,
//           fourStar: 5,
//           threeStar: 2,
//           twoStar: 1,
//           oneStar: 0,
//         },
//       },
//       {
//         productVariantId: "aa9115b5-e662-4a1d-bf82-cdc9775cea4a",
//         image:
//           "https://nuts.com/images/ct/images.cdn.us-central1.gcp.commercetools.com/fe6ef66f-361c-4adb-b11f-d4aa8f13c79c/1512_OrganicRaisins_-_XhBXhsi-medium.jpg",
//         productId: "1eb8fd3f-0c65-49d5-8e44-ea4535f3a87b",
//         packagingTypeId: "754613af-e1e1-42d3-a382-0dae8a40117f",
//         netWeight: 1.3,
//         grossWeight: 1.6,
//         packagingLength: 9.7,
//         packagingWidth: 5,
//         packagingHeight: 4,
//         packagingVolume: 194,
//         shelfLife: "9 months",
//         price: 14800,
//         stockQuantity: 77,
//         reOrderPoint: 15,
//         promotion: {
//           discountPercentage: 5,
//           endDate: "2025-03-30",
//         },
//         rating: 4.5,
//         quantitySold: 178,
//         feedbacks: [],
//         overallRating: {
//           overallRating: 4.5,
//           quantityFeedback: 28,
//           fiveStar: 18,
//           fourStar: 8,
//           threeStar: 2,
//           twoStar: 0,
//           oneStar: 0,
//         },
//       },
//     ],
//   };

//   const selectedVariant = product.productVariantDetail[selectedVariantIndex];
//   const isOutOfStock = selectedVariant.stockQuantity <= 0;
//   const hasDiscount =
//     selectedVariant.promotion &&
//     selectedVariant.promotion.discountPercentage > 0;
//   const discountedPrice = hasDiscount
//     ? selectedVariant.price *
//       (1 - selectedVariant.promotion.discountPercentage / 100)
//     : selectedVariant.price;

//   // Calculate bundle price
//   const bundleTotal = useMemo(() => {
//     return selectedBundles.reduce((total, bundleId) => {
//       const bundle = bundleProducts.find((b) => b.id === bundleId);
//       return total + (bundle ? bundle.price : 0);
//     }, 0);
//   }, [selectedBundles]);

//   // Calculate subscription discount
//   const getSubscriptionDiscount = () => {
//     switch (subscriptionType) {
//       case "weekly":
//         return 0.1;
//       case "biweekly":
//         return 0.08;
//       case "monthly":
//         return 0.05;
//       default:
//         return 0;
//     }
//   };

//   // Calculate gift wrapping cost
//   const giftWrappingCost = selectedGiftOptions.includes("gift-wrap")
//     ? 15000
//     : 0;

//   // Calculate final price
//   const calculateFinalPrice = () => {
//     let basePrice = discountedPrice * quantity;

//     // Add bundle products
//     basePrice += bundleTotal;

//     // Apply subscription discount if applicable
//     const subscriptionDiscount = getSubscriptionDiscount();
//     if (subscriptionDiscount > 0) {
//       basePrice = basePrice * (1 - subscriptionDiscount);
//     }

//     // Add gift wrapping if selected
//     basePrice += giftWrappingCost;

//     return basePrice;
//   };

//   const finalPrice = calculateFinalPrice();

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       setIsSticky(scrollPosition > 300);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Show random recent purchase notification
//   useEffect(() => {
//     const showRandomPurchase = () => {
//       if (Math.random() > 0.7) {
//         // 30% chance to show notification
//         setCurrentPurchaseIndex(
//           Math.floor(Math.random() * recentPurchases.length)
//         );
//         setShowRecentPurchase(true);

//         setTimeout(() => {
//           setShowRecentPurchase(false);
//         }, 5000);
//       }
//     };

//     const interval = setInterval(showRandomPurchase, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   // Apply accessibility settings
//   useEffect(() => {
//     document.documentElement.classList.toggle(
//       "high-contrast",
//       highContrastMode
//     );
//     document.documentElement.classList.toggle("large-text", largeText);
//     document.documentElement.classList.toggle("reduced-motion", reducedMotion);
//   }, [highContrastMode, largeText, reducedMotion]);

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const handlePrevImage = () => {
//     if (viewMode === "standard") {
//       setCurrentImageIndex((prev) =>
//         prev === 0 ? product.productImages.length - 1 : prev - 1
//       );
//     } else if (viewMode === "360") {
//       setRotationIndex((prev) =>
//         prev === 0 ? rotationImages.length - 1 : prev - 1
//       );
//     }
//   };

//   const handleNextImage = () => {
//     if (viewMode === "standard") {
//       setCurrentImageIndex((prev) =>
//         prev === product.productImages.length - 1 ? 0 : prev + 1
//       );
//     } else if (viewMode === "360") {
//       setRotationIndex((prev) =>
//         prev === rotationImages.length - 1 ? 0 : prev + 1
//       );
//     }
//   };

//   const handleMouseDown = (e) => {
//     if (viewMode !== "360" || isMobile) return;
//     setIsDragging(true);
//     setDragStartX(e.clientX);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || viewMode !== "360") return;

//     const deltaX = e.clientX - dragStartX;
//     if (Math.abs(deltaX) > 20) {
//       if (deltaX > 0) {
//         handlePrevImage();
//       } else {
//         handleNextImage();
//       }
//       setDragStartX(e.clientX);
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleTouchStart = (e) => {
//     if (viewMode !== "360") return;
//     setIsDragging(true);
//     setDragStartX(e.touches[0].clientX);
//   };

//   const handleTouchMove = (e) => {
//     if (!isDragging || viewMode !== "360") return;

//     const deltaX = e.touches[0].clientX - dragStartX;
//     if (Math.abs(deltaX) > 20) {
//       if (deltaX > 0) {
//         handlePrevImage();
//       } else {
//         handleNextImage();
//       }
//       setDragStartX(e.touches[0].clientX);
//     }
//   };

//   const handleTouchEnd = () => {
//     setIsDragging(false);
//   };

//   const handleAddToCart = () => {
//     if (isOutOfStock) {
//       setShowNotifyDialog(true);
//       return;
//     }

//     toast({
//       title: "Added to cart",
//       description: `${quantity} × ${product.name} (${
//         packagingTypes[selectedVariant.packagingTypeId]
//       })`,
//     });
//   };

//   const handleAddToWishlist = () => {
//     toast({
//       title: "Added to wishlist",
//       description: `${product.name} has been added to your wishlist`,
//     });
//   };

//   const handleShare = (platform) => {
//     toast({
//       title: `Shared on ${platform}`,
//       description: "Product link has been copied to clipboard",
//     });
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(window.location.href);
//     toast({
//       title: "Link copied",
//       description: "Product link has been copied to clipboard",
//     });
//   };

//   const handleZoom = (e) => {
//     if (!imageRef.current || isMobile || viewMode !== "standard") return;

//     const { left, top, width, height } =
//       imageRef.current.getBoundingClientRect();
//     const x = (e.clientX - left) / width;
//     const y = (e.clientY - top) / height;

//     setZoomPosition({ x, y });
//   };

//   const handleNotifyMe = () => {
//     toast({
//       title: "Notification set",
//       description: "We'll notify you when this product is back in stock",
//     });
//     setShowNotifyDialog(false);
//   };

//   const handleBundleSelection = (bundleId) => {
//     setSelectedBundles((prev) => {
//       if (prev.includes(bundleId)) {
//         return prev.filter((id) => id !== bundleId);
//       } else {
//         return [...prev, bundleId];
//       }
//     });
//   };

//   const handleGiftOptionChange = (optionId) => {
//     setSelectedGiftOptions((prev) => {
//       if (prev.includes(optionId)) {
//         return prev.filter((id) => id !== optionId);
//       } else {
//         return [...prev, optionId];
//       }
//     });
//   };

//   const handleAddBundle = () => {
//     if (selectedBundles.length === 0) {
//       toast({
//         title: "No bundles selected",
//         description: "Please select at least one product to bundle",
//       });
//       return;
//     }

//     toast({
//       title: "Bundle added",
//       description: `Added ${selectedBundles.length} products to your bundle`,
//     });
//     setShowBundleDialog(false);
//   };

//   const handleAddGiftOptions = () => {
//     toast({
//       title: "Gift options added",
//       description: "Your gift options have been saved",
//     });
//     setShowGiftDialog(false);
//   };

//   const estimatedDelivery = () => {
//     const today = new Date();
//     const deliveryDate = new Date(today);
//     deliveryDate.setDate(today.getDate() + 3);
//     return deliveryDate.toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getSubscriptionLabel = () => {
//     switch (subscriptionType) {
//       case "weekly":
//         return "Weekly delivery (Save 10%)";
//       case "biweekly":
//         return "Every 2 weeks (Save 8%)";
//       case "monthly":
//         return "Monthly delivery (Save 5%)";
//       default:
//         return "One-time purchase";
//     }
//   };

//   return (
//     <div
//       className={`${
//         highContrastMode
//           ? "bg-white"
//           : "bg-gradient-to-b from-amber-50/30 to-white"
//       }`}
//     >
//       {/* Accessibility Menu Button */}
//       <button
//         className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all"
//         onClick={() => setShowAccessibilityMenu(true)}
//         aria-label="Accessibility options"
//       >
//         <Users className="h-5 w-5" />
//       </button>

//       {/* Quick View Button */}
//       <AnimatePresence>
//         {isSticky && !isMobile && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             className="fixed bottom-20 right-4 z-50"
//           >
//             <Button
//               className="rounded-full shadow-lg"
//               onClick={() => setShowQuickView(!showQuickView)}
//             >
//               <Search className="h-5 w-5 mr-2" />
//               Quick View
//             </Button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Quick View Panel */}
//       <AnimatePresence>
//         {showQuickView && (
//           <motion.div
//             initial={{ opacity: 0, x: 300 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 300 }}
//             className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-xl border-l overflow-auto"
//           >
//             <div className="p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-bold text-lg">Quick View</h3>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowQuickView(false)}
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-16 w-16 relative rounded overflow-hidden">
//                     <Image
//                       src={product.mainImageUrl || "/placeholder.svg"}
//                       alt={product.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h4 className="font-medium">{product.name}</h4>
//                     <p className="text-sm text-muted-foreground">
//                       {product.englishName}
//                     </p>
//                     <p className="font-bold text-primary">
//                       {formatPrice(discountedPrice)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <h5 className="font-medium text-sm">Quick Actions</h5>
//                   <div className="grid grid-cols-2 gap-2">
//                     <Button
//                       size="sm"
//                       onClick={handleAddToCart}
//                       disabled={isOutOfStock}
//                     >
//                       Add to Cart
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={handleAddToWishlist}
//                     >
//                       Wishlist
//                     </Button>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <h5 className="font-medium text-sm">Jump to Section</h5>
//                   <div className="space-y-1">
//                     {[
//                       "description",
//                       "specifications",
//                       "nutrition",
//                       "recipes",
//                       "reviews",
//                       "faq",
//                     ].map((tab) => (
//                       <Button
//                         key={tab}
//                         variant="ghost"
//                         size="sm"
//                         className="w-full justify-start"
//                         onClick={() => {
//                           setSelectedTab(tab);
//                           setShowQuickView(false);
//                           document
//                             .getElementById(tab)
//                             ?.scrollIntoView({ behavior: "smooth" });
//                         }}
//                       >
//                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Accessibility Dialog */}
//       <Dialog
//         open={showAccessibilityMenu}
//         onOpenChange={setShowAccessibilityMenu}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Accessibility Options</DialogTitle>
//             <DialogDescription>
//               Customize your browsing experience to suit your needs.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="high-contrast" className="flex flex-col gap-1">
//                 <span>High Contrast Mode</span>
//                 <span className="font-normal text-sm text-muted-foreground">
//                   Increases contrast for better visibility
//                 </span>
//               </Label>
//               <Switch
//                 id="high-contrast"
//                 checked={highContrastMode}
//                 onCheckedChange={setHighContrastMode}
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <Label htmlFor="large-text" className="flex flex-col gap-1">
//                 <span>Larger Text</span>
//                 <span className="font-normal text-sm text-muted-foreground">
//                   Increases text size throughout the page
//                 </span>
//               </Label>
//               <Switch
//                 id="large-text"
//                 checked={largeText}
//                 onCheckedChange={setLargeText}
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <Label htmlFor="reduced-motion" className="flex flex-col gap-1">
//                 <span>Reduced Motion</span>
//                 <span className="font-normal text-sm text-muted-foreground">
//                   Minimizes animations and transitions
//                 </span>
//               </Label>
//               <Switch
//                 id="reduced-motion"
//                 checked={reducedMotion}
//                 onCheckedChange={setReducedMotion}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setShowAccessibilityMenu(false)}>
//               Save Preferences
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Recent Purchase Notification */}
//       <AnimatePresence>
//         {showRecentPurchase && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             className="fixed bottom-4 left-4 z-50 max-w-xs bg-white rounded-lg shadow-lg border p-4"
//           >
//             <div className="flex items-start gap-3">
//               <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
//                 <ShoppingBag className="h-5 w-5 text-amber-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium">
//                   {recentPurchases[currentPurchaseIndex].name} from{" "}
//                   {recentPurchases[currentPurchaseIndex].location}
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   Purchased this product{" "}
//                   {recentPurchases[currentPurchaseIndex].time}
//                 </p>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-6 w-6 p-0 rounded-full"
//                 onClick={() => setShowRecentPurchase(false)}
//               >
//                 <span className="sr-only">Close</span>
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="container mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <nav className="flex items-center text-sm mb-6 text-muted-foreground">
//           <Link
//             href="/"
//             className="flex items-center hover:text-primary transition-colors"
//           >
//             <Home className="h-4 w-4 mr-1" />
//             Home
//           </Link>
//           <ChevronRight className="h-4 w-4 mx-1" />
//           <Link
//             href="/category"
//             className="hover:text-primary transition-colors"
//           >
//             Dried Fruits
//           </Link>
//           <ChevronRight className="h-4 w-4 mx-1" />
//           <span
//             className={`${
//               largeText ? "text-base" : "text-sm"
//             } text-foreground font-medium truncate`}
//           >
//             {product.name}
//           </span>
//         </nav>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Product Image Gallery */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant={viewMode === "standard" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("standard")}
//                 >
//                   Standard View
//                 </Button>
//                 <Button
//                   variant={viewMode === "360" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("360")}
//                 >
//                   360° View
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowVideoDialog(true)}
//                 >
//                   <Play className="h-4 w-4 mr-1" />
//                   Video
//                 </Button>
//               </div>
//             </div>

//             <div
//               className={`relative aspect-square overflow-hidden rounded-lg border ${
//                 highContrastMode ? "bg-white border-black" : "bg-white"
//               }`}
//               onMouseMove={handleZoom}
//               onMouseEnter={() => setIsZoomed(true)}
//               onMouseLeave={() => setIsZoomed(false)}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               onTouchStart={handleTouchStart}
//               onTouchMove={handleTouchMove}
//               onTouchEnd={handleTouchEnd}
//               ref={viewMode === "standard" ? imageRef : rotationRef}
//             >
//               {viewMode === "standard" && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Image
//                     src={
//                       product.productImages[currentImageIndex] ||
//                       "/placeholder.svg"
//                     }
//                     alt={product.name}
//                     fill
//                     className={`object-cover transition-transform duration-200 ${
//                       isZoomed && !isMobile ? "scale-150" : ""
//                     } ${reducedMotion ? "transition-none" : ""}`}
//                     style={
//                       isZoomed && !isMobile
//                         ? {
//                             transformOrigin: `${zoomPosition.x * 100}% ${
//                               zoomPosition.y * 100
//                             }%`,
//                           }
//                         : {}
//                     }
//                   />
//                 </div>
//               )}

//               {viewMode === "360" && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Image
//                     src={rotationImages[rotationIndex] || "/placeholder.svg"}
//                     alt={`${product.name} 360 view ${rotationIndex + 1}`}
//                     fill
//                     className="object-cover"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                     <div className="bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
//                       Drag to rotate
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {hasDiscount && (
//                 <div className="absolute top-2 left-2 z-10">
//                   <Badge
//                     className={`${
//                       highContrastMode
//                         ? "bg-black text-white"
//                         : "bg-red-500 hover:bg-red-600 text-white"
//                     }`}
//                   >
//                     {selectedVariant.promotion.discountPercentage}% OFF
//                   </Badge>
//                 </div>
//               )}

//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className={`absolute left-2 top-1/2 -translate-y-1/2 ${
//                   highContrastMode
//                     ? "bg-black text-white hover:bg-black/90"
//                     : "bg-background/80 hover:bg-background/90"
//                 }`}
//                 onClick={handlePrevImage}
//               >
//                 <ChevronLeft className="h-6 w-6" />
//                 <span className="sr-only">Previous image</span>
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className={`absolute right-2 top-1/2 -translate-y-1/2 ${
//                   highContrastMode
//                     ? "bg-black text-white hover:bg-black/90"
//                     : "bg-background/80 hover:bg-background/90"
//                 }`}
//                 onClick={handleNextImage}
//               >
//                 <ChevronRight className="h-6 w-6" />
//                 <span className="sr-only">Next image</span>
//               </Button>

//               {!isMobile && viewMode === "standard" && (
//                 <div className="absolute bottom-2 right-2 z-10">
//                   <Badge
//                     variant="outline"
//                     className={`${
//                       highContrastMode
//                         ? "bg-black text-white"
//                         : "bg-background/80"
//                     }`}
//                   >
//                     {isZoomed ? "Zoom Active" : "Hover to Zoom"}
//                   </Badge>
//                 </div>
//               )}
//             </div>

//             {viewMode === "standard" && (
//               <div className="flex space-x-2 overflow-auto pb-2">
//                 {product.productImages.map((image, index) => (
//                   <button
//                     key={index}
//                     className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
//                       currentImageIndex === index
//                         ? `${
//                             highContrastMode
//                               ? "ring-2 ring-black"
//                               : "ring-2 ring-primary"
//                           }`
//                         : ""
//                     } bg-white`}
//                     onClick={() => setCurrentImageIndex(index)}
//                   >
//                     <Image
//                       src={image || "/placeholder.svg"}
//                       alt={`${product.name} thumbnail ${index + 1}`}
//                       fill
//                       className="object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}

//             {viewMode === "360" && (
//               <div className="flex justify-center items-center">
//                 <Slider
//                   value={[rotationIndex]}
//                   min={0}
//                   max={rotationImages.length - 1}
//                   step={1}
//                   className="w-full"
//                   onValueChange={(value) => setRotationIndex(value[0])}
//                 />
//               </div>
//             )}

//             {/* Social Sharing */}
//             <div className="flex items-center justify-between pt-2 border-t">
//               <div
//                 className={`${
//                   largeText ? "text-base" : "text-sm"
//                 } font-medium text-muted-foreground`}
//               >
//                 Share this product:
//               </div>
//               <div className="flex space-x-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => handleShare("Facebook")}
//                 >
//                   <Facebook className="h-4 w-4" />
//                   <span className="sr-only">Share on Facebook</span>
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => handleShare("Twitter")}
//                 >
//                   <Twitter className="h-4 w-4" />
//                   <span className="sr-only">Share on Twitter</span>
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => handleShare("Instagram")}
//                 >
//                   <Instagram className="h-4 w-4" />
//                   <span className="sr-only">Share on Instagram</span>
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handleCopyLink}>
//                   <Copy className="h-4 w-4" />
//                   <span className="sr-only">Copy link</span>
//                 </Button>
//               </div>
//             </div>

//             {/* Certifications */}
//             <div className="pt-4 border-t">
//               <h3
//                 className={`${
//                   largeText ? "text-base" : "text-sm"
//                 } font-medium mb-3`}
//               >
//                 Certifications
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 {certifications.map((cert, index) => (
//                   <TooltipProvider key={index}>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <div
//                           className={`flex items-center justify-center h-12 w-12 rounded-full ${
//                             highContrastMode
//                               ? "bg-black text-white"
//                               : "bg-amber-100 text-amber-800"
//                           }`}
//                         >
//                           {cert.icon}
//                         </div>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <div className="text-xs">
//                           <p className="font-bold">{cert.name}</p>
//                           <p>{cert.description}</p>
//                         </div>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                 ))}
//               </div>
//             </div>

//             {/* User Generated Content */}
//             <div className="pt-4 border-t">
//               <div className="flex items-center justify-between mb-3">
//                 <h3
//                   className={`${
//                     largeText ? "text-base" : "text-sm"
//                   } font-medium`}
//                 >
//                   Customer Photos
//                 </h3>
//                 <Button variant="link" size="sm" className="h-auto p-0">
//                   View all
//                 </Button>
//               </div>
//               <div className="grid grid-cols-3 gap-2">
//                 {userPhotos.slice(0, 6).map((photo, index) => (
//                   <div
//                     key={index}
//                     className="relative aspect-square rounded-md overflow-hidden"
//                   >
//                     <Image
//                       src={photo || "/placeholder.svg"}
//                       alt={`User photo ${index + 1}`}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             <div>
//               <div className="flex items-center justify-between">
//                 <Badge
//                   variant="outline"
//                   className={`${
//                     highContrastMode
//                       ? "bg-black text-white"
//                       : "bg-amber-100 text-amber-800 border-amber-200"
//                   }`}
//                 >
//                   Organic
//                 </Badge>
//                 <div
//                   className={`flex items-center ${
//                     largeText ? "text-base" : "text-sm"
//                   } text-muted-foreground`}
//                 >
//                   <Package className="h-4 w-4 mr-1" />
//                   <span>
//                     SKU: {selectedVariant.productVariantId.substring(0, 8)}
//                   </span>
//                 </div>
//               </div>
//               <h1
//                 className={`${
//                   largeText ? "text-4xl" : "text-3xl"
//                 } font-bold tracking-tight mt-2`}
//               >
//                 {product.name}
//               </h1>
//               <p
//                 className={`${
//                   largeText ? "text-xl" : "text-lg"
//                 } text-muted-foreground mt-1`}
//               >
//                 {product.englishName}
//               </p>
//               <div className="mt-2 flex items-center">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-5 w-5 ${
//                         i <
//                         Math.round(
//                           selectedVariant.overallRating?.overallRating || 0
//                         )
//                           ? `${
//                               highContrastMode
//                                 ? "fill-black text-black"
//                                 : "fill-amber-400 text-amber-400"
//                             }`
//                           : "fill-muted text-muted-foreground"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span
//                   className={`ml-2 ${
//                     largeText ? "text-base" : "text-sm"
//                   } text-muted-foreground`}
//                 >
//                   {selectedVariant.overallRating?.quantityFeedback || 0} reviews
//                 </span>
//                 <span className="mx-2 text-muted-foreground">•</span>
//                 <span
//                   className={`${
//                     largeText ? "text-base" : "text-sm"
//                   } text-muted-foreground`}
//                 >
//                   {selectedVariant.quantitySold} sold
//                 </span>
//               </div>
//             </div>

//             <div>
//               <div className="flex items-baseline gap-2">
//                 {hasDiscount && (
//                   <span
//                     className={`${
//                       largeText ? "text-2xl" : "text-xl"
//                     } text-muted-foreground line-through`}
//                   >
//                     {formatPrice(selectedVariant.price)}
//                   </span>
//                 )}
//                 <div
//                   className={`${
//                     largeText ? "text-4xl" : "text-3xl"
//                   } font-bold ${
//                     highContrastMode ? "text-black" : "text-primary"
//                   }`}
//                 >
//                   {formatPrice(discountedPrice)}
//                 </div>
//                 {hasDiscount && (
//                   <Badge
//                     variant="outline"
//                     className={`ml-2 ${
//                       highContrastMode
//                         ? "bg-black text-white"
//                         : "bg-red-100 text-red-800 border-red-200"
//                     }`}
//                   >
//                     Save {selectedVariant.promotion.discountPercentage}%
//                   </Badge>
//                 )}
//               </div>
//               <p
//                 className={`${
//                   largeText ? "text-base" : "text-sm"
//                 } text-muted-foreground mt-1 flex items-center`}
//               >
//                 <Truck className="h-4 w-4 mr-1" />
//                 Free shipping on orders over {formatPrice(200000)}
//               </p>
//             </div>

//             {/* Origin Information */}
//             <div
//               className={`${
//                 highContrastMode ? "bg-gray-100" : "bg-amber-50"
//               } rounded-lg p-4 border ${
//                 highContrastMode ? "border-black" : "border-amber-100"
//               }`}
//             >
//               <div className="flex items-start space-x-4">
//                 <div
//                   className={`h-10 w-10 rounded-full ${
//                     highContrastMode ? "bg-black text-white" : "bg-amber-100"
//                   } flex items-center justify-center flex-shrink-0`}
//                 >
//                   <Leaf className="h-5 w-5 text-amber-800" />
//                 </div>
//                 <div>
//                   <h3
//                     className={`${
//                       largeText ? "text-lg" : "text-base"
//                     } font-medium`}
//                   >
//                     Product Origin
//                   </h3>
//                   <div className="mt-1 space-y-1">
//                     <p
//                       className={`${
//                         largeText ? "text-base" : "text-sm"
//                       } flex items-center`}
//                     >
//                       <span className="font-medium mr-2">Origin:</span>{" "}
//                       {product.origin}
//                     </p>
//                     <p
//                       className={`${
//                         largeText ? "text-base" : "text-sm"
//                       } flex items-center`}
//                     >
//                       <span className="font-medium mr-2">Harvest Date:</span>{" "}
//                       {product.harvestDate}
//                     </p>
//                     <p
//                       className={`${
//                         largeText ? "text-base" : "text-sm"
//                       } flex items-center`}
//                     >
//                       <span className="font-medium mr-2">Certification:</span>{" "}
//                       {product.organicCertification}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Estimated Delivery */}
//             <div
//               className={`${
//                 highContrastMode
//                   ? "bg-gray-100 border-black"
//                   : "bg-green-50 border-green-100"
//               } border rounded-lg p-3 flex items-center`}
//             >
//               <Clock className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
//               <div>
//                 <p
//                   className={`${
//                     largeText ? "text-base" : "text-sm"
//                   } font-medium text-green-800`}
//                 >
//                   Estimated Delivery
//                 </p>
//                 <p
//                   className={`${
//                     largeText ? "text-base" : "text-sm"
//                   } text-green-700`}
//                 >
//                   {estimatedDelivery()} if ordered today
//                 </p>
//               </div>
//             </div>

//             {/* Subscription Options */}
//             <div>
//               <h3
//                 className={`${
//                   largeText ? "text-lg" : "text-base"
//                 } font-medium mb-2`}
//               >
//                 Purchase Options
//               </h3>
//               <RadioGroup
//                 value={subscriptionType}
//                 onValueChange={setSubscriptionType}
//                 className="space-y-2"
//               >
//                 {subscriptionOptions.map((option) => (
//                   <div
//                     key={option.value}
//                     className={`flex items-center space-x-2 rounded-md border p-3 ${
//                       subscriptionType === option.value
//                         ? `${
//                             highContrastMode
//                               ? "border-black bg-gray-100"
//                               : "border-amber-200 bg-amber-50"
//                           }`
//                         : ""
//                     }`}
//                   >
//                     <RadioGroupItem value={option.value} id={option.value} />
//                     <Label
//                       htmlFor={option.value}
//                       className="flex-1 cursor-pointer"
//                     >
//                       {option.label}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>

//               {subscriptionType !== "none" && (
//                 <div className="mt-3 p-3 rounded-md bg-muted">
//                   <p
//                     className={`${
//                       largeText ? "text-base" : "text-sm"
//                     } text-muted-foreground`}
//                   >
//                     Your first delivery will arrive on {estimatedDelivery()}.
//                     You can pause, skip, or cancel anytime.
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h3
//                   className={`${
//                     largeText ? "text-lg" : "text-base"
//                   } font-medium mb-2`}
//                 >
//                   Packaging Type
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {product.productVariantDetail.map((variant, index) => (
//                     <TooltipProvider key={variant.productVariantId}>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <div>
//                             <Button
//                               variant={
//                                 selectedVariantIndex === index
//                                   ? "default"
//                                   : "outline"
//                               }
//                               onClick={() => setSelectedVariantIndex(index)}
//                               className={`flex-1 sm:flex-none ${
//                                 variant.stockQuantity <= 0 ? "opacity-60" : ""
//                               } ${largeText ? "text-base py-6" : ""}`}
//                               disabled={variant.stockQuantity <= 0}
//                             >
//                               {packagingTypes[variant.packagingTypeId]}
//                               {variant.stockQuantity <= 0 && " (Out of Stock)"}
//                             </Button>
//                           </div>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <div className="text-xs">
//                             <p>Net weight: {variant.netWeight}kg</p>
//                             <p>
//                               Dimensions: {variant.packagingLength}×
//                               {variant.packagingWidth}×{variant.packagingHeight}
//                               cm
//                             </p>
//                           </div>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h3
//                   className={`${
//                     largeText ? "text-lg" : "text-base"
//                   } font-medium mb-2`}
//                 >
//                   Quantity
//                 </h3>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     disabled={quantity <= 1 || isOutOfStock}
//                     className={largeText ? "h-12 w-12" : ""}
//                   >
//                     <Minus className="h-4 w-4" />
//                     <span className="sr-only">Decrease quantity</span>
//                   </Button>
//                   <span
//                     className={`w-12 text-center ${largeText ? "text-xl" : ""}`}
//                   >
//                     {quantity}
//                   </span>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() =>
//                       setQuantity(
//                         Math.min(selectedVariant.stockQuantity, quantity + 1)
//                       )
//                     }
//                     disabled={
//                       quantity >= selectedVariant.stockQuantity || isOutOfStock
//                     }
//                     className={largeText ? "h-12 w-12" : ""}
//                   >
//                     <Plus className="h-4 w-4" />
//                     <span className="sr-only">Increase quantity</span>
//                   </Button>
//                   {!isOutOfStock ? (
//                     <span
//                       className={`${
//                         largeText ? "text-base" : "text-sm"
//                       } text-muted-foreground ml-2`}
//                     >
//                       {selectedVariant.stockQuantity} available
//                     </span>
//                   ) : (
//                     <span
//                       className={`${
//                         largeText ? "text-base" : "text-sm"
//                       } text-red-500 ml-2 font-medium`}
//                     >
//                       Out of stock
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Bundle and Gift Options */}
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <Button
//                   variant="outline"
//                   className="gap-2"
//                   onClick={() => setShowBundleDialog(true)}
//                 >
//                   <Package className="h-5 w-5" />
//                   Create Bundle
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="gap-2"
//                   onClick={() => setShowGiftDialog(true)}
//                 >
//                   <Gift className="h-5 w-5" />
//                   Gift Options
//                 </Button>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-2 pt-2">
//                 <Button
//                   className={`flex-1 gap-2 ${
//                     isOutOfStock
//                       ? "bg-muted text-muted-foreground hover:bg-muted"
//                       : ""
//                   } ${largeText ? "text-base py-6" : ""}`}
//                   size="lg"
//                   onClick={handleAddToCart}
//                 >
//                   {isOutOfStock ? (
//                     <>
//                       <ShoppingCart className="h-5 w-5" />
//                       Notify When Available
//                     </>
//                   ) : (
//                     <>
//                       <ShoppingCart className="h-5 w-5" />
//                       Add to Cart
//                     </>
//                   )}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="gap-2"
//                   onClick={handleAddToWishlist}
//                 >
//                   <Heart className="h-5 w-5" />
//                   <span className="sr-only sm:not-sr-only sm:inline">
//                     Add to Wishlist
//                   </span>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="gap-2 hidden sm:flex"
//                   onClick={() => handleCopyLink()}
//                 >
//                   <Share2 className="h-5 w-5" />
//                   <span className="sr-only sm:not-sr-only sm:inline">
//                     Share
//                   </span>
//                 </Button>
//               </div>

//               {/* One-Click Reorder */}
//               <div className="pt-2">
//                 <Button
//                   variant="outline"
//                   className="w-full gap-2 border-dashed"
//                 >
//                   <Repeat className="h-5 w-5" />
//                   One-Click Reorder
//                 </Button>
//                 <p className="text-xs text-muted-foreground mt-1 text-center">
//                   Quickly reorder this product with your saved preferences
//                 </p>
//               </div>

//               {/* Price Summary */}
//               {(subscriptionType !== "none" ||
//                 selectedBundles.length > 0 ||
//                 selectedGiftOptions.includes("gift-wrap")) && (
//                 <div className="rounded-lg border p-4 mt-6 bg-white">
//                   <h3
//                     className={`${
//                       largeText ? "text-lg" : "text-base"
//                     } font-medium mb-3`}
//                   >
//                     Price Summary
//                   </h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Base Price ({quantity})</span>
//                       <span>{formatPrice(discountedPrice * quantity)}</span>
//                     </div>

//                     {selectedBundles.length > 0 && (
//                       <div className="flex justify-between">
//                         <span>Bundle Items ({selectedBundles.length})</span>
//                         <span>{formatPrice(bundleTotal)}</span>
//                       </div>
//                     )}

//                     {subscriptionType !== "none" && (
//                       <div className="flex justify-between text-green-600">
//                         <span>
//                           Subscription Discount (
//                           {getSubscriptionDiscount() * 100}%)
//                         </span>
//                         <span>
//                           -
//                           {formatPrice(
//                             (discountedPrice * quantity + bundleTotal) *
//                               getSubscriptionDiscount()
//                           )}
//                         </span>
//                       </div>
//                     )}

//                     {selectedGiftOptions.includes("gift-wrap") && (
//                       <div className="flex justify-between">
//                         <span>Gift Wrapping</span>
//                         <span>{formatPrice(giftWrappingCost)}</span>
//                       </div>
//                     )}

//                     <div className="border-t pt-2 mt-2 flex justify-between font-bold">
//                       <span>Total</span>
//                       <span>{formatPrice(finalPrice)}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="rounded-lg border p-4 mt-6 bg-white">
//                 <div className="flex items-center gap-2">
//                   <Info
//                     className={`h-5 w-5 ${
//                       highContrastMode ? "text-black" : "text-amber-600"
//                     }`}
//                   />
//                   <span className="font-medium">Product Information</span>
//                 </div>
//                 <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
//                   <div className="flex justify-between sm:block">
//                     <span className="text-muted-foreground">Shelf Life:</span>
//                     <span className="font-medium sm:ml-2">
//                       {selectedVariant.shelfLife}
//                     </span>
//                   </div>
//                   <div className="flex justify-between sm:block">
//                     <span className="text-muted-foreground">Net Weight:</span>
//                     <span className="font-medium sm:ml-2">
//                       {selectedVariant.netWeight}kg
//                     </span>
//                   </div>
//                   <div className="flex justify-between sm:block">
//                     <span className="text-muted-foreground">Gross Weight:</span>
//                     <span className="font-medium sm:ml-2">
//                       {selectedVariant.grossWeight}kg
//                     </span>
//                   </div>
//                   <div className="flex justify-between sm:block">
//                     <span className="text-muted-foreground">Packaging:</span>
//                     <span className="font-medium sm:ml-2">
//                       {selectedVariant.packagingLength} ×{" "}
//                       {selectedVariant.packagingWidth} ×{" "}
//                       {selectedVariant.packagingHeight} cm
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Product Details Tabs */}
//         <div className="mt-12" id="tabs-section">
//           <Tabs
//             defaultValue="description"
//             value={selectedTab}
//             onValueChange={setSelectedTab}
//           >
//             <TabsList
//               className={`w-full justify-start border-b rounded-none h-auto p-0 bg-transparent ${
//                 largeText ? "text-lg" : ""
//               }`}
//             >
//               <TabsTrigger
//                 value="description"
//                 id="description"
//                 className={`rounded-none data-[state=active]:border-b-2 ${
//                   highContrastMode
//                     ? "data-[state=active]:border-black"
//                     : "data-[state=active]:border-amber-600"
//                 } py-3 ${largeText ? "text-lg" : "text-base"}`}
//               >
//                 Description
//               </TabsTrigger>
//               <TabsTrigger
//                 value="specifications"
//                 id="specifications"
//                 className={`rounded-none data-[state=active]:border-b-2 ${
//                   highContrastMode
//                     ? "data-[state=active]:border-black"
//                     : "data-[state=active]:border-amber-600"
//                 } py-3 ${largeText ? "text-lg" : "text-base"}`}
//               >
//                 Specifications
//               </TabsTrigger>
//               <TabsTrigger
//                 value="nutrition"
//                 id="nutrition"
//                 className={`rounded-none data-[state=active]:border-b-2 ${
//                   highContrastMode
//                     ? "data-[state=active]:border-black"
//                     : "data-[state=active]:border-amber-600"
//                 } py-3 ${largeText ? "text-lg" : "text-base"}`}
//               >
//                 Nutrition Facts
//               </TabsTrigger>
//               <TabsTrigger
//                 value="recipes"
//                 id="recipes"
//                 className={`rounded-none data-[state=active]:border-b-2 ${
//                   highContrastMode
//                     ? "data-[state=active]:border-black"
//                     : "data-[state=active]:border-amber-600"
//                 } py-3 ${largeText ? "text-lg" : "text-base"}`}
//               >
//                 Recipes
//               </TabsTrigger>
//               <TabsTrigger
//                 value="reviews"
//                 id="reviews"
//                 className={`rounded-none data-[state=active]:border-b-2 ${
//                   highContrastMode
//                     ? "data-[state=active]:border-black"
//                     : "data-[state=active]:border-amber-600"
//                 } py-3 ${largeText ? "text-lg" : "text-base"}`}
//               >
//                 Reviews
//               </TabsTrigger>
//               <TabsTrigger
//                 value="faq"
//                 id="faq"
//                 className={`rounded-none data-[state=active]:border-b-2 ${
//                   highContrastMode
//                     ? "data-[state=active]:border-black"
//                     : "data-[state=active]:border-amber-600"
//                 } py-3 ${largeText ? "text-lg" : "text-base"}`}
//               >
//                 FAQ
//               </TabsTrigger>
//             </TabsList>
//             <TabsContent value="description" className="pt-6">
//               <div className="prose max-w-none">
//                 <p
//                   className={`${
//                     largeText ? "text-xl" : "text-lg"
//                   } leading-relaxed`}
//                 >
//                   {productDescription}
//                 </p>

//                 <h3
//                   className={`${
//                     largeText ? "text-2xl" : "text-xl"
//                   } font-medium mt-8 mb-4`}
//                 >
//                   Health Benefits
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
//                   {healthBenefits.map((benefit, index) => (
//                     <Card
//                       key={index}
//                       className={`${
//                         highContrastMode
//                           ? "border-black bg-gray-50"
//                           : "border-amber-100 bg-amber-50/50"
//                       }`}
//                     >
//                       <CardContent className="p-6 flex flex-col items-center text-center">
//                         <div className="mb-4">{benefit.icon}</div>
//                         <h4
//                           className={`font-medium ${
//                             largeText ? "text-xl" : "text-lg"
//                           } mb-2`}
//                         >
//                           {benefit.title}
//                         </h4>
//                         <p
//                           className={`${
//                             largeText ? "text-base" : "text-sm"
//                           } text-muted-foreground`}
//                         >
//                           {benefit.description}
//                         </p>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>

//                 <h3
//                   className={`${
//                     largeText ? "text-2xl" : "text-xl"
//                   } font-medium mt-8 mb-4`}
//                 >
//                   Origin & Production
//                 </h3>
//                 <p className={largeText ? "text-lg" : ""}>
//                   Our organic raisins are sourced from carefully selected
//                   vineyards where grapes are grown without synthetic pesticides
//                   or fertilizers. The grapes are harvested at peak ripeness and
//                   then naturally sun-dried to preserve their nutritional value
//                   and develop their sweet flavor profile.
//                 </p>
//                 <p className={largeText ? "text-lg" : ""}>
//                   The drying process takes approximately 2-3 weeks, during which
//                   the grapes are turned regularly to ensure even drying. Once
//                   dried, the raisins undergo a gentle cleaning process before
//                   being packaged in our various packaging options to maintain
//                   freshness and extend shelf life.
//                 </p>

//                 <h3
//                   className={`${
//                     largeText ? "text-2xl" : "text-xl"
//                   } font-medium mt-8 mb-4`}
//                 >
//                   Sustainability Commitment
//                 </h3>
//                 <p className={largeText ? "text-lg" : ""}>
//                   {product.sustainabilityInfo}
//                 </p>
//               </div>
//             </TabsContent>
//             <TabsContent value="specifications" className="pt-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <Card
//                   className={
//                     highContrastMode ? "border-black" : "border-amber-100"
//                   }
//                 >
//                   <CardContent className="p-6">
//                     <h3
//                       className={`${
//                         largeText ? "text-xl" : "text-lg"
//                       } font-medium mb-4`}
//                     >
//                       Product Specifications
//                     </h3>
//                     <div className="space-y-3">
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Product Name
//                         </span>
//                         <span>{product.name}</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">Origin</span>
//                         <span>{product.origin}</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">Type</span>
//                         <span>Organic Dried Fruit</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Certification
//                         </span>
//                         <span>{product.organicCertification}</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">Storage</span>
//                         <span>Store in a cool, dry place</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Ingredients
//                         </span>
//                         <span>100% Organic Raisins</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">Allergens</span>
//                         <span>None</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Harvest Date
//                         </span>
//                         <span>{product.harvestDate}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card
//                   className={
//                     highContrastMode ? "border-black" : "border-amber-100"
//                   }
//                 >
//                   <CardContent className="p-6">
//                     <h3
//                       className={`${
//                         largeText ? "text-xl" : "text-lg"
//                       } font-medium mb-4`}
//                     >
//                       Packaging Details
//                     </h3>
//                     <div className="space-y-3">
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Packaging Type
//                         </span>
//                         <span>
//                           {packagingTypes[selectedVariant.packagingTypeId]}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Net Weight
//                         </span>
//                         <span>{selectedVariant.netWeight}kg</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Gross Weight
//                         </span>
//                         <span>{selectedVariant.grossWeight}kg</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Dimensions
//                         </span>
//                         <span>
//                           {selectedVariant.packagingLength} ×{" "}
//                           {selectedVariant.packagingWidth} ×{" "}
//                           {selectedVariant.packagingHeight} cm
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Shelf Life
//                         </span>
//                         <span>{selectedVariant.shelfLife}</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Packaging Material
//                         </span>
//                         <span>Recyclable Materials</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 pb-2 border-b">
//                         <span className="text-muted-foreground">
//                           Storage Instructions
//                         </span>
//                         <span>Keep sealed after opening</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Size Comparison */}
//               <div className="mt-8">
//                 <h3
//                   className={`${
//                     largeText ? "text-xl" : "text-lg"
//                   } font-medium mb-4`}
//                 >
//                   Size Comparison
//                 </h3>
//                 <div className="bg-white p-6 rounded-lg border border-amber-100">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {product.productVariantDetail.map((variant, index) => (
//                       <div
//                         key={variant.productVariantId}
//                         className={`p-4 rounded-lg border ${
//                           selectedVariantIndex === index
//                             ? `${
//                                 highContrastMode
//                                   ? "border-black bg-gray-50"
//                                   : "border-amber-500 bg-amber-50"
//                               }`
//                             : "border-muted"
//                         }`}
//                       >
//                         <h4 className="font-medium mb-2">
//                           {packagingTypes[variant.packagingTypeId]}
//                         </h4>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span>Net Weight:</span>
//                             <span className="font-medium">
//                               {variant.netWeight}kg
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Dimensions:</span>
//                             <span className="font-medium">
//                               {variant.packagingLength}×{variant.packagingWidth}
//                               ×{variant.packagingHeight}cm
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Volume:</span>
//                             <span className="font-medium">
//                               {variant.packagingVolume.toFixed(1)}cm³
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Price:</span>
//                             <span className="font-medium">
//                               {formatPrice(variant.price)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Interactive Size Comparison */}
//               <div className="mt-8">
//                 <h3
//                   className={`${
//                     largeText ? "text-xl" : "text-lg"
//                   } font-medium mb-4`}
//                 >
//                   Interactive Size Comparison
//                 </h3>
//                 <div className="bg-white p-6 rounded-lg border border-amber-100">
//                   <div className="aspect-video relative bg-gray-50 rounded-lg overflow-hidden">
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <Image
//                         src="/placeholder.svg?height=400&width=800&text=Interactive+Size+Comparison"
//                         alt="Size comparison"
//                         fill
//                         className="object-cover"
//                       />
//                       <Button
//                         className={`absolute bottom-4 left-1/2 -translate-x-1/2 ${
//                           highContrastMode ? "bg-black hover:bg-black/90" : ""
//                         }`}
//                       >
//                         Compare with Common Objects
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="nutrition" className="pt-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <h3
//                     className={`${
//                       largeText ? "text-xl" : "text-lg"
//                     } font-medium mb-4`}
//                   >
//                     Nutrition Information
//                   </h3>
//                   <p className="text-muted-foreground mb-6">
//                     Our organic raisins are a nutrient-dense food, providing
//                     essential vitamins and minerals with no added sugars or
//                     preservatives. They're naturally sweet and make a perfect
//                     healthy snack or recipe ingredient.
//                   </p>
//                   <Card
//                     className={
//                       highContrastMode ? "border-black" : "border-amber-100"
//                     }
//                   >
//                     <CardContent className="p-6">
//                       <h3
//                         className={`${
//                           largeText ? "text-xl" : "text-lg"
//                         } font-bold mb-2 text-center`}
//                       >
//                         Nutrition Facts
//                       </h3>
//                       <p className="text-sm text-center mb-4">
//                         Serving Size {nutritionFacts.servingSize}
//                       </p>
//                       <Separator className="my-2 border-black" />
//                       <div className="space-y-1">
//                         <div className="flex justify-between font-bold">
//                           <span>Calories</span>
//                           <span>{nutritionFacts.calories}</span>
//                         </div>
//                         <Separator className="my-2" />
//                         <div className="flex justify-between">
//                           <span className="font-bold">Total Fat</span>
//                           <span>{nutritionFacts.totalFat}</span>
//                         </div>
//                         <div className="flex justify-between pl-4">
//                           <span>Saturated Fat</span>
//                           <span>{nutritionFacts.saturatedFat}</span>
//                         </div>
//                         <div className="flex justify-between pl-4">
//                           <span>Trans Fat</span>
//                           <span>{nutritionFacts.transFat}</span>
//                         </div>
//                         <Separator className="my-2" />
//                         <div className="flex justify-between">
//                           <span className="font-bold">Cholesterol</span>
//                           <span>{nutritionFacts.cholesterol}</span>
//                         </div>
//                         <Separator className="my-2" />
//                         <div className="flex justify-between">
//                           <span className="font-bold">Sodium</span>
//                           <span>{nutritionFacts.sodium}</span>
//                         </div>
//                         <Separator className="my-2" />
//                         <div className="flex justify-between">
//                           <span className="font-bold">Total Carbohydrate</span>
//                           <span>{nutritionFacts.totalCarbohydrate}</span>
//                         </div>
//                         <div className="flex justify-between pl-4">
//                           <span>Dietary Fiber</span>
//                           <span>{nutritionFacts.dietaryFiber}</span>
//                         </div>
//                         <div className="flex justify-between pl-4">
//                           <span>Total Sugars</span>
//                           <span>{nutritionFacts.totalSugars}</span>
//                         </div>
//                         <div className="flex justify-between pl-8">
//                           <span>Includes Added Sugars</span>
//                           <span>{nutritionFacts.addedSugars}</span>
//                         </div>
//                         <Separator className="my-2" />
//                         <div className="flex justify-between">
//                           <span className="font-bold">Protein</span>
//                           <span>{nutritionFacts.protein}</span>
//                         </div>
//                         <Separator className="my-2" />
//                         <div className="flex justify-between">
//                           <span>Vitamin D</span>
//                           <span>{nutritionFacts.vitaminD}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Calcium</span>
//                           <span>{nutritionFacts.calcium}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Iron</span>
//                           <span>{nutritionFacts.iron}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Potassium</span>
//                           <span>{nutritionFacts.potassium}</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <p className="text-sm text-muted-foreground mt-4">
//                     * Percent Daily Values are based on a 2,000 calorie diet.
//                   </p>
//                 </div>
//                 <div>
//                   <h3
//                     className={`${
//                       largeText ? "text-xl" : "text-lg"
//                     } font-medium mb-4`}
//                   >
//                     Nutritional Benefits
//                   </h3>
//                   <div className="space-y-4">
//                     <Card
//                       className={
//                         highContrastMode ? "border-black" : "border-amber-100"
//                       }
//                     >
//                       <CardContent className="p-4">
//                         <h4 className="font-medium mb-2">
//                           Rich in Antioxidants
//                         </h4>
//                         <p
//                           className={`${
//                             largeText ? "text-base" : "text-sm"
//                           } text-muted-foreground`}
//                         >
//                           Raisins contain polyphenols, which are antioxidants
//                           that may help protect your cells from damage caused by
//                           free radicals.
//                         </p>
//                       </CardContent>
//                     </Card>
//                     <Card
//                       className={
//                         highContrastMode ? "border-black" : "border-amber-100"
//                       }
//                     >
//                       <CardContent className="p-4">
//                         <h4 className="font-medium mb-2">
//                           Good Source of Fiber
//                         </h4>
//                         <p
//                           className={`${
//                             largeText ? "text-base" : "text-sm"
//                           } text-muted-foreground`}
//                         >
//                           With 2g of fiber per serving, raisins can help support
//                           digestive health and promote regularity.
//                         </p>
//                       </CardContent>
//                     </Card>
//                     <Card
//                       className={
//                         highContrastMode ? "border-black" : "border-amber-100"
//                       }
//                     >
//                       <CardContent className="p-4">
//                         <h4 className="font-medium mb-2">
//                           Natural Energy Source
//                         </h4>
//                         <p
//                           className={`${
//                             largeText ? "text-base" : "text-sm"
//                           } text-muted-foreground`}
//                         >
//                           The natural sugars in raisins provide a quick energy
//                           boost, making them perfect for pre-workout snacks or
//                           afternoon pick-me-ups.
//                         </p>
//                       </CardContent>
//                     </Card>
//                     <Card
//                       className={
//                         highContrastMode ? "border-black" : "border-amber-100"
//                       }
//                     >
//                       <CardContent className="p-4">
//                         <h4 className="font-medium mb-2">Essential Minerals</h4>
//                         <p
//                           className={`${
//                             largeText ? "text-base" : "text-sm"
//                           } text-muted-foreground`}
//                         >
//                           Raisins contain important minerals like iron,
//                           potassium, and calcium that support various bodily
//                           functions.
//                         </p>
//                       </CardContent>
//                     </Card>
//                     <Card
//                       className={
//                         highContrastMode ? "border-black" : "border-amber-100"
//                       }
//                     >
//                       <CardContent className="p-4">
//                         <h4 className="font-medium mb-2">No Added Sugars</h4>
//                         <p
//                           className={`${
//                             largeText ? "text-base" : "text-sm"
//                           } text-muted-foreground`}
//                         >
//                           All the sweetness in our raisins comes naturally from
//                           the fruit itself, with no artificial sweeteners or
//                           added sugars.
//                         </p>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </div>
//               </div>

//               {/* Interactive Nutrition Visualization */}
//               <div className="mt-8">
//                 <h3
//                   className={`${
//                     largeText ? "text-xl" : "text-lg"
//                   } font-medium mb-4`}
//                 >
//                   Nutrition Visualization
//                 </h3>
//                 <div className="bg-white p-6 rounded-lg border border-amber-100">
//                   <div className="aspect-video relative bg-gray-50 rounded-lg overflow-hidden">
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <Image
//                         src="/placeholder.svg?height=400&width=800&text=Interactive+Nutrition+Chart"
//                         alt="Nutrition visualization"
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="recipes" className="pt-6">
//               <h3
//                 className={`${
//                   largeText ? "text-xl" : "text-lg"
//                 } font-medium mb-4`}
//               >
//                 Delicious Ways to Enjoy Our Organic Raisins
//               </h3>
//               <p className="text-muted-foreground mb-6">
//                 Our organic raisins are incredibly versatile and can be used in
//                 countless recipes. Here are some of our favorite ways to enjoy
//                 them.
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//                 {recipes.map((recipe, index) => (
//                   <Card
//                     key={index}
//                     className={`overflow-hidden ${
//                       highContrastMode ? "border-black" : "border-amber-100"
//                     }`}
//                   >
//                     <div className="aspect-video relative">
//                       <Image
//                         src={recipe.image || "/placeholder.svg"}
//                         alt={recipe.title}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <CardContent className="p-6">
//                       <h4
//                         className={`font-medium ${
//                           largeText ? "text-xl" : "text-lg"
//                         } mb-2`}
//                       >
//                         {recipe.title}
//                       </h4>
//                       <p
//                         className={`${
//                           largeText ? "text-base" : "text-sm"
//                         } text-muted-foreground mb-4`}
//                       >
//                         {recipe.description}
//                       </p>
//                       <h5 className="font-medium text-sm mb-2">Ingredients:</h5>
//                       <ul
//                         className={`${
//                           largeText ? "text-base" : "text-sm"
//                         } space-y-1 list-disc pl-4`}
//                       >
//                         {recipe.ingredients.map((ingredient, i) => (
//                           <li key={i}>{ingredient}</li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>

//               <div
//                 className={`mt-8 ${
//                   highContrastMode ? "bg-gray-50" : "bg-amber-50"
//                 } rounded-lg p-6 border ${
//                   highContrastMode ? "border-black" : "border-amber-100"
//                 }`}
//               >
//                 <h4
//                   className={`font-medium ${
//                     largeText ? "text-xl" : "text-lg"
//                   } mb-4`}
//                 >
//                   More Ways to Use Raisins
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                   <div className="flex items-start space-x-2">
//                     <div
//                       className={`h-6 w-6 rounded-full ${
//                         highContrastMode ? "bg-gray-300" : "bg-amber-200"
//                       } flex items-center justify-center ${
//                         highContrastMode ? "text-black" : "text-amber-800"
//                       } font-medium`}
//                     >
//                       1
//                     </div>
//                     <p className={`${largeText ? "text-base" : "text-sm"}`}>
//                       Add to your morning cereal or overnight oats
//                     </p>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <div
//                       className={`h-6 w-6 rounded-full ${
//                         highContrastMode ? "bg-gray-300" : "bg-amber-200"
//                       } flex items-center justify-center ${
//                         highContrastMode ? "text-black" : "text-amber-800"
//                       } font-medium`}
//                     >
//                       2
//                     </div>
//                     <p className={`${largeText ? "text-base" : "text-sm"}`}>
//                       Mix into homemade granola or energy bars
//                     </p>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <div
//                       className={`h-6 w-6 rounded-full ${
//                         highContrastMode ? "bg-gray-300" : "bg-amber-200"
//                       } flex items-center justify-center ${
//                         highContrastMode ? "text-black" : "text-amber-800"
//                       } font-medium`}
//                     >
//                       3
//                     </div>
//                     <p className={`${largeText ? "text-base" : "text-sm"}`}>
//                       Bake into cookies, muffins, or bread
//                     </p>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <div
//                       className={`h-6 w-6 rounded-full ${
//                         highContrastMode ? "bg-gray-300" : "bg-amber-200"
//                       } flex items-center justify-center ${
//                         highContrastMode ? "text-black" : "text-amber-800"
//                       } font-medium`}
//                     >
//                       4
//                     </div>
//                     <p className={`${largeText ? "text-base" : "text-sm"}`}>
//                       Add to savory rice dishes like pilaf or biryani
//                     </p>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <div
//                       className={`h-6 w-6 rounded-full ${
//                         highContrastMode ? "bg-gray-300" : "bg-amber-200"
//                       } flex items-center justify-center ${
//                         highContrastMode ? "text-black" : "text-amber-800"
//                       } font-medium`}
//                     >
//                       5
//                     </div>
//                     <p className={`${largeText ? "text-base" : "text-sm"}`}>
//                       Blend into smoothies for natural sweetness
//                     </p>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <div
//                       className={`h-6 w-6 rounded-full ${
//                         highContrastMode ? "bg-gray-300" : "bg-amber-200"
//                       } flex items-center justify-center ${
//                         highContrastMode ? "text-black" : "text-amber-800"
//                       } font-medium`}
//                     >
//                       6
//                     </div>
//                     <p className={`${largeText ? "text-base" : "text-sm"}`}>
//                       Use in Moroccan tagines or curries
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Video Recipe */}
//               <div className="mt-8">
//                 <h3
//                   className={`${
//                     largeText ? "text-xl" : "text-lg"
//                   } font-medium mb-4`}
//                 >
//                   Video Recipe
//                 </h3>
//                 <div className="bg-white p-6 rounded-lg border border-amber-100">
//                   <div className="aspect-video relative bg-gray-50 rounded-lg overflow-hidden">
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <Image
//                         src="/placeholder.svg?height=400&width=800&text=Recipe+Video+Thumbnail"
//                         alt="Recipe video"
//                         fill
//                         className="object-cover"
//                       />
//                       <Button
//                         className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 rounded-none"
//                         onClick={() => setShowVideoDialog(true)}
//                       >
//                         <Play className="h-16 w-16 text-white" />
//                       </Button>
//                     </div>
//                   </div>
//                   <h4 className="font-medium text-center mt-4">
//                     Raisin Energy Balls: A Quick & Healthy Snack
//                   </h4>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="reviews" className="pt-6">
//               {selectedVariant.feedbacks &&
//               selectedVariant.feedbacks.length > 0 ? (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     <div className="md:col-span-1">
//                       <Card
//                         className={`${
//                           highContrastMode ? "border-black" : "border-amber-100"
//                         }`}
//                       >
//                         <CardContent className="p-6">
//                           <div className="text-center">
//                             <div className="flex items-center justify-center mb-2">
//                               <span
//                                 className={`text-4xl font-bold ${
//                                   highContrastMode
//                                     ? "text-black"
//                                     : "text-amber-600"
//                                 }`}
//                               >
//                                 {selectedVariant.overallRating?.overallRating.toFixed(
//                                   1
//                                 )}
//                               </span>
//                               <span className="text-lg text-muted-foreground">
//                                 /5
//                               </span>
//                             </div>
//                             <div className="flex items-center justify-center mb-4">
//                               {[...Array(5)].map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   className={`h-5 w-5 ${
//                                     i <
//                                     Math.round(
//                                       selectedVariant.overallRating
//                                         ?.overallRating || 0
//                                     )
//                                       ? `${
//                                           highContrastMode
//                                             ? "fill-black text-black"
//                                             : "fill-amber-400 text-amber-400"
//                                         }`
//                                       : "fill-muted text-muted-foreground"
//                                   }`}
//                                 />
//                               ))}
//                             </div>
//                             <p className="text-sm text-muted-foreground">
//                               Based on{" "}
//                               {selectedVariant.overallRating
//                                 ?.quantityFeedback || 0}{" "}
//                               reviews
//                             </p>
//                           </div>

//                           <div className="mt-6 space-y-3">
//                             {[5, 4, 3, 2, 1].map((star) => (
//                               <div
//                                 key={star}
//                                 className="flex items-center gap-4"
//                               >
//                                 <div className="flex items-center min-w-[80px]">
//                                   <span className="mr-2">{star}</span>
//                                   <Star
//                                     className={`h-4 w-4 ${
//                                       highContrastMode
//                                         ? "fill-black text-black"
//                                         : "fill-amber-400 text-amber-400"
//                                     }`}
//                                   />
//                                 </div>
//                                 <Progress
//                                   value={
//                                     selectedVariant.overallRating
//                                       ?.quantityFeedback
//                                       ? (selectedVariant.overallRating[
//                                           `${star}Star`
//                                         ] /
//                                           selectedVariant.overallRating
//                                             .quantityFeedback) *
//                                         100
//                                       : 0
//                                   }
//                                   className="h-2 flex-1"
//                                 />
//                                 <span className="text-sm text-muted-foreground min-w-[40px] text-right">
//                                   {selectedVariant.overallRating?.[
//                                     `${star}Star`
//                                   ] || 0}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>

//                           <div className="mt-6">
//                             <Button className="w-full">Write a Review</Button>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       <div className="mt-6">
//                         <h4
//                           className={`${
//                             largeText ? "text-lg" : "text-base"
//                           } font-medium mb-3`}
//                         >
//                           Filter Reviews
//                         </h4>
//                         <div className="space-y-2">
//                           <div className="flex items-center">
//                             <Checkbox id="with-photos" />
//                             <label
//                               htmlFor="with-photos"
//                               className="ml-2 text-sm"
//                             >
//                               With Photos
//                             </label>
//                           </div>
//                           <div className="flex items-center">
//                             <Checkbox id="verified-purchase" />
//                             <label
//                               htmlFor="verified-purchase"
//                               className="ml-2 text-sm"
//                             >
//                               Verified Purchase
//                             </label>
//                           </div>
//                           <div>
//                             <label className="text-sm mb-1 block">Rating</label>
//                             <div className="flex flex-wrap gap-1">
//                               {[5, 4, 3, 2, 1].map((star) => (
//                                 <Button
//                                   key={star}
//                                   variant="outline"
//                                   size="sm"
//                                   className="min-w-[40px]"
//                                 >
//                                   {star}★
//                                 </Button>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="md:col-span-2">
//                       <div className="space-y-6">
//                         {selectedVariant.feedbacks.map((feedback, index) => (
//                           <Card
//                             key={index}
//                             className={`${
//                               highContrastMode
//                                 ? "border-black"
//                                 : "border-amber-100"
//                             }`}
//                           >
//                             <CardContent className="p-6">
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <h4 className="font-medium">
//                                     {feedback.userName}
//                                   </h4>
//                                   <div className="flex items-center mt-1">
//                                     {[...Array(5)].map((_, i) => (
//                                       <Star
//                                         key={i}
//                                         className={`h-4 w-4 ${
//                                           i < feedback.rating
//                                             ? `${
//                                                 highContrastMode
//                                                   ? "fill-black text-black"
//                                                   : "fill-amber-400 text-amber-400"
//                                               }`
//                                             : "fill-muted text-muted-foreground"
//                                         }`}
//                                       />
//                                     ))}
//                                     <span className="ml-2 text-xs text-muted-foreground">
//                                       {new Date(
//                                         feedback.date
//                                       ).toLocaleDateString()}
//                                     </span>
//                                   </div>
//                                 </div>
//                                 <Badge variant="outline">
//                                   Verified Purchase
//                                 </Badge>
//                               </div>

//                               <p className="mt-4">{feedback.comment}</p>

//                               {feedback.images &&
//                                 feedback.images.length > 0 && (
//                                   <div className="mt-4 flex gap-2">
//                                     {feedback.images.map((image, imgIndex) => (
//                                       <div
//                                         key={imgIndex}
//                                         className="h-16 w-16 relative rounded overflow-hidden"
//                                       >
//                                         <Image
//                                           src={image || "/placeholder.svg"}
//                                           alt={`Review image ${imgIndex + 1}`}
//                                           fill
//                                           className="object-cover"
//                                         />
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}

//                               <div className="mt-4 flex items-center justify-between">
//                                 <div className="flex items-center">
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-8 px-2"
//                                   >
//                                     <span className="mr-1">
//                                       Helpful ({feedback.helpful})
//                                     </span>
//                                   </Button>
//                                 </div>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 px-2"
//                                 >
//                                   Report
//                                 </Button>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}

//                         <Button variant="outline" className="w-full">
//                           Load More Reviews
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-12 bg-white rounded-lg border">
//                   <h3
//                     className={`${
//                       largeText ? "text-2xl" : "text-xl"
//                     } font-medium`}
//                   >
//                     No Reviews Yet
//                   </h3>
//                   <p className="text-muted-foreground mt-2 mb-6">
//                     Be the first to review this product
//                   </p>
//                   <Button
//                     className={`${
//                       highContrastMode
//                         ? "bg-black hover:bg-black/90"
//                         : "bg-amber-600 hover:bg-amber-700"
//                     }`}
//                   >
//                     Write a Review
//                   </Button>
//                 </div>
//               )}
//             </TabsContent>
//             <TabsContent value="faq" className="pt-6">
//               <h3
//                 className={`${
//                   largeText ? "text-xl" : "text-lg"
//                 } font-medium mb-4`}
//               >
//                 Frequently Asked Questions
//               </h3>
//               <Accordion type="single" collapsible className="w-full">
//                 {faqs.map((faq, index) => (
//                   <AccordionItem
//                     key={index}
//                     value={`item-${index}`}
//                     className={
//                       highContrastMode ? "border-black" : "border-amber-100"
//                     }
//                   >
//                     <AccordionTrigger className="text-left">
//                       {faq.question}
//                     </AccordionTrigger>
//                     <AccordionContent className="text-muted-foreground">
//                       {faq.answer}
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>

//               <div
//                 className={`mt-8 ${
//                   highContrastMode ? "bg-gray-50" : "bg-amber-50"
//                 } rounded-lg p-6 border ${
//                   highContrastMode ? "border-black" : "border-amber-100"
//                 }`}
//               >
//                 <h4
//                   className={`font-medium ${
//                     largeText ? "text-xl" : "text-lg"
//                   } mb-2`}
//                 >
//                   Still have questions?
//                 </h4>
//                 <p className="text-muted-foreground mb-4">
//                   If you can't find the answer to your question in our FAQ,
//                   please contact our customer support team.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <Button
//                     variant="outline"
//                     className={
//                       highContrastMode ? "bg-white border-black" : "bg-white"
//                     }
//                   >
//                     <Send className="h-4 w-4 mr-2" />
//                     Contact Support
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className={
//                       highContrastMode ? "bg-white border-black" : "bg-white"
//                     }
//                   >
//                     <Search className="h-4 w-4 mr-2" />
//                     Search Knowledge Base
//                   </Button>
//                 </div>
//               </div>

//               {/* Ask a Question */}
//               <div className="mt-8">
//                 <Card
//                   className={
//                     highContrastMode ? "border-black" : "border-amber-100"
//                   }
//                 >
//                   <CardHeader>
//                     <CardTitle>Ask a Question</CardTitle>
//                     <CardDescription>
//                       Our team will respond to your question within 24 hours
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="name">Your Name</Label>
//                           <Input id="name" placeholder="Enter your name" />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="email">Email Address</Label>
//                           <Input
//                             id="email"
//                             type="email"
//                             placeholder="Enter your email"
//                           />
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="question">Your Question</Label>
//                         <textarea
//                           id="question"
//                           className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                           placeholder="Type your question here..."
//                         />
//                       </div>
//                     </div>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       className={
//                         highContrastMode ? "bg-black hover:bg-black/90" : ""
//                       }
//                     >
//                       Submit Question
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Recently Viewed */}
//         <div className="mt-16">
//           <h2
//             className={`${largeText ? "text-3xl" : "text-2xl"} font-bold mb-6`}
//           >
//             Recently Viewed
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {recentlyViewed.map((item) => (
//               <Card
//                 key={item.id}
//                 className={`overflow-hidden ${
//                   highContrastMode ? "border-black" : "border-amber-100"
//                 }`}
//               >
//                 <div className="aspect-square relative">
//                   <Image
//                     src={item.image || "/placeholder.svg"}
//                     alt={item.name}
//                     fill
//                     className={`object-cover transition-all hover:scale-105 ${
//                       reducedMotion ? "transition-none hover:scale-100" : ""
//                     }`}
//                   />
//                 </div>
//                 <CardContent className="p-4">
//                   <h3 className="font-medium truncate">{item.name}</h3>
//                   <p
//                     className={`${
//                       largeText ? "text-base" : "text-sm"
//                     } text-muted-foreground`}
//                   >
//                     Organic Product
//                   </p>
//                   <div className="mt-2 font-bold">
//                     {formatPrice(item.price)}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Related Products */}
//         <div className="mt-16">
//           <h2
//             className={`${largeText ? "text-3xl" : "text-2xl"} font-bold mb-6`}
//           >
//             You May Also Like
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, i) => (
//               <Card
//                 key={i}
//                 className={`overflow-hidden ${
//                   highContrastMode ? "border-black" : "border-amber-100"
//                 }`}
//               >
//                 <div className="aspect-square relative">
//                   <Image
//                     src={`/placeholder.svg?height=300&width=300`}
//                     alt={`Related product ${i + 1}`}
//                     fill
//                     className={`object-cover transition-all hover:scale-105 ${
//                       reducedMotion ? "transition-none hover:scale-100" : ""
//                     }`}
//                   />
//                   {i === 1 && (
//                     <div className="absolute top-2 left-2 z-10">
//                       <Badge
//                         className={`${
//                           highContrastMode
//                             ? "bg-black text-white"
//                             : "bg-red-500 hover:bg-red-600 text-white"
//                         }`}
//                       >
//                         15% OFF
//                       </Badge>
//                     </div>
//                   )}
//                 </div>
//                 <CardContent className="p-4">
//                   <h3 className="font-medium truncate">
//                     Related Dried Fruit {i + 1}
//                   </h3>
//                   <p
//                     className={`${
//                       largeText ? "text-base" : "text-sm"
//                     } text-muted-foreground`}
//                   >
//                     Organic Product
//                   </p>
//                   <div className="mt-2 font-bold">
//                     {formatPrice(12000 + i * 1000)}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Sticky Add to Cart (Mobile) */}
//       {isSticky && (
//         <div
//           className={`fixed bottom-0 left-0 right-0 ${
//             highContrastMode ? "bg-white" : "bg-background"
//           } border-t p-4 md:hidden z-50 shadow-lg`}
//         >
//           <div className="flex items-center justify-between gap-4">
//             <div>
//               <div className="font-bold">{formatPrice(discountedPrice)}</div>
//               {hasDiscount && (
//                 <div className="text-sm text-muted-foreground line-through">
//                   {formatPrice(selectedVariant.price)}
//                 </div>
//               )}
//             </div>
//             <Button
//               className={
//                 highContrastMode ? "bg-black hover:bg-black/90" : "flex-1"
//               }
//               onClick={handleAddToCart}
//               disabled={isOutOfStock}
//             >
//               {isOutOfStock ? "Notify Me" : "Add to Cart"}
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Notify When Available Dialog */}
//       <Dialog open={showNotifyDialog} onOpenChange={setShowNotifyDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Get notified when back in stock</DialogTitle>
//             <DialogDescription>
//               We'll send you an email when this product is available again.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label
//                 htmlFor="email"
//                 className="text-right text-sm font-medium col-span-1"
//               >
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                 placeholder="your.email@example.com"
//               />
//             </div>
//           </div>
//           <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
//             <Button
//               variant="outline"
//               onClick={() => setShowNotifyDialog(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleNotifyMe}
//               className={
//                 highContrastMode
//                   ? "bg-black hover:bg-black/90"
//                   : "bg-amber-600 hover:bg-amber-700"
//               }
//             >
//               Notify Me
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Video Dialog */}
//       <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
//         <DialogContent className="sm:max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>Product Video</DialogTitle>
//           </DialogHeader>
//           <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Image
//                 src="/placeholder.svg?height=600&width=1000&text=Product+Video+Player"
//                 alt="Product video"
//                 fill
//                 className="object-cover"
//               />
//               <Button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 rounded-none">
//                 <Play className="h-16 w-16 text-white" />
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Bundle Dialog */}
//       <Dialog open={showBundleDialog} onOpenChange={setShowBundleDialog}>
//         <DialogContent className="sm:max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Create Your Bundle</DialogTitle>
//             <DialogDescription>
//               Add complementary products to enhance your experience
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
//               {bundleProducts.map((bundle) => (
//                 <div
//                   key={bundle.id}
//                   className={`flex gap-3 p-3 rounded-lg border ${
//                     selectedBundles.includes(bundle.id)
//                       ? `${
//                           highContrastMode
//                             ? "border-black bg-gray-50"
//                             : "border-amber-200 bg-amber-50"
//                         }`
//                       : "border-muted"
//                   }`}
//                 >
//                   <Checkbox
//                     checked={selectedBundles.includes(bundle.id)}
//                     onCheckedChange={() => handleBundleSelection(bundle.id)}
//                     className="mt-1"
//                   />
//                   <div className="flex gap-3 flex-1">
//                     <div className="h-16 w-16 relative rounded overflow-hidden flex-shrink-0">
//                       <Image
//                         src={bundle.image || "/placeholder.svg"}
//                         alt={bundle.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-medium">{bundle.name}</h4>
//                       <p className="text-sm text-muted-foreground line-clamp-2">
//                         {bundle.description}
//                       </p>
//                       <p className="font-bold mt-1">
//                         {formatPrice(bundle.price)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {selectedBundles.length > 0 && (
//               <div className="bg-muted p-3 rounded-lg">
//                 <div className="flex justify-between mb-2">
//                   <span>Selected Items:</span>
//                   <span>{selectedBundles.length}</span>
//                 </div>
//                 <div className="flex justify-between font-bold">
//                   <span>Bundle Total:</span>
//                   <span>{formatPrice(bundleTotal)}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setShowBundleDialog(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddBundle}
//               className={highContrastMode ? "bg-black hover:bg-black/90" : ""}
//             >
//               Add Selected Items
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Gift Options Dialog */}
//       <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Gift Options</DialogTitle>
//             <DialogDescription>
//               Make your gift special with these options
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             {giftOptions.map((option) => (
//               <div key={option.id} className="flex items-start space-x-2">
//                 <Checkbox
//                   id={option.id}
//                   checked={selectedGiftOptions.includes(option.id)}
//                   onCheckedChange={() => handleGiftOptionChange(option.id)}
//                 />
//                 <div className="grid gap-1.5 leading-none">
//                   <label
//                     htmlFor={option.id}
//                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                   >
//                     {option.label}
//                   </label>
//                 </div>
//               </div>
//             ))}

//             {selectedGiftOptions.includes("gift-message") && (
//               <div className="space-y-2">
//                 <Label htmlFor="gift-message-text">Gift Message</Label>
//                 <textarea
//                   id="gift-message-text"
//                   className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                   placeholder="Enter your gift message here..."
//                   value={giftMessage}
//                   onChange={(e) => setGiftMessage(e.target.value)}
//                 />
//               </div>
//             )}

//             {selectedGiftOptions.length > 0 &&
//               selectedGiftOptions.includes("gift-wrap") && (
//                 <div className="bg-muted p-3 rounded-lg">
//                   <div className="flex justify-between font-bold">
//                     <span>Gift Wrapping:</span>
//                     <span>{formatPrice(giftWrappingCost)}</span>
//                   </div>
//                 </div>
//               )}
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowGiftDialog(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddGiftOptions}
//               className={highContrastMode ? "bg-black hover:bg-black/90" : ""}
//             >
//               Save Gift Options
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
