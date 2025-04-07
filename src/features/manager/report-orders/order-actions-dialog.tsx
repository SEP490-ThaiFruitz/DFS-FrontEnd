// "use client";

// import { useState } from "react";
// import {
//   AlertCircle,
//   ArrowLeft,
//   ArrowRight,
//   Check,
//   ClipboardX,
//   Package,
//   RotateCcw,
//   ShoppingBag,
//   Truck,
//   X,
// } from "lucide-react";
// import Image from "next/image";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { motion, AnimatePresence } from "framer-motion";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";

// const cancelReasons = [
//   {
//     id: "address",
//     reason: "Tôi muốn thay đổi địa chỉ giao hàng",
//     description: "Địa chỉ giao hàng không chính xác hoặc đã thay đổi",
//     icon: <Truck className="h-4 w-4" />,
//   },
//   {
//     id: "payment",
//     reason: "Tôi muốn thay đổi phương thức thanh toán",
//     description: "Muốn sử dụng phương thức thanh toán khác",
//     icon: <ShoppingBag className="h-4 w-4" />,
//   },
//   {
//     id: "wrong-product",
//     reason: "Tôi đặt nhầm sản phẩm",
//     description: "Sản phẩm không phù hợp với nhu cầu",
//     icon: <Package className="h-4 w-4" />,
//   },
//   {
//     id: "cheaper",
//     reason: "Tôi tìm thấy sản phẩm giá rẻ hơn ở nơi khác",
//     description: "Đã tìm được lựa chọn tốt hơn về giá cả",
//     icon: <ShoppingBag className="h-4 w-4" />,
//   },
//   {
//     id: "no-need",
//     reason: "Tôi không còn nhu cầu mua sản phẩm này nữa",
//     description: "Đã thay đổi quyết định mua hàng",
//     icon: <X className="h-4 w-4" />,
//   },
//   {
//     id: "delivery-time",
//     reason: "Thời gian giao hàng quá lâu",
//     description: "Không thể đợi thời gian giao hàng dự kiến",
//     icon: <Truck className="h-4 w-4" />,
//   },
//   {
//     id: "other-cancel",
//     reason: "Khác (vui lòng ghi rõ)",
//     description: "Lý do khác không được liệt kê ở trên",
//     icon: <AlertCircle className="h-4 w-4" />,
//   },
// ];

// const returnReasons = [
//   {
//     id: "damaged",
//     reason: "Sản phẩm bị hư hỏng khi nhận được",
//     description: "Sản phẩm bị hỏng, vỡ hoặc không hoạt động",
//     icon: <AlertCircle className="h-4 w-4" />,
//   },
//   {
//     id: "wrong-item",
//     reason: "Nhận được sản phẩm không đúng",
//     description: "Sản phẩm khác với mô tả hoặc hình ảnh",
//     icon: <Package className="h-4 w-4" />,
//   },
//   {
//     id: "size-issue",
//     reason: "Vấn đề về kích thước",
//     description: "Kích thước không phù hợp hoặc không như mong đợi",
//     icon: <ShoppingBag className="h-4 w-4" />,
//   },
//   {
//     id: "quality-issue",
//     reason: "Chất lượng không như mong đợi",
//     description: "Chất lượng sản phẩm không đạt yêu cầu",
//     icon: <AlertCircle className="h-4 w-4" />,
//   },
//   {
//     id: "defective",
//     reason: "Sản phẩm bị lỗi",
//     description: "Sản phẩm có lỗi kỹ thuật hoặc không hoạt động đúng",
//     icon: <X className="h-4 w-4" />,
//   },
//   {
//     id: "other-return",
//     reason: "Khác (vui lòng ghi rõ)",
//     description: "Lý do khác không được liệt kê ở trên",
//     icon: <AlertCircle className="h-4 w-4" />,
//   },
// ];

// const orderItems = [
//   {
//     id: 1,
//     name: "Áo Thun Nam Cotton Cao Cấp",
//     price: "350.000₫",
//     quantity: 2,
//     image: "/placeholder.svg?height=80&width=80",
//   },
//   {
//     id: 2,
//     name: "Quần Jeans Slim Fit",
//     price: "550.000₫",
//     quantity: 1,
//     image: "/placeholder.svg?height=80&width=80",
//   },
// ];

// type ActionMode = "cancel" | "return";

// export function OrderActionDialog() {
//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState<ActionMode>("cancel");
//   const [selectedReason, setSelectedReason] = useState("");
//   const [additionalComments, setAdditionalComments] = useState("");
//   const [step, setStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [returnMethod, setReturnMethod] = useState("pickup");
//   const [selectedItems, setSelectedItems] = useState<number[]>([]);
//   const [itemConditions, setItemConditions] = useState<Record<number, string>>(
//     {}
//   );

//   const handleModeChange = (newMode: ActionMode) => {
//     setMode(newMode);
//     setSelectedReason("");
//     setAdditionalComments("");
//     setSelectedItems([]);
//     setItemConditions({});
//   };

//   const handleConfirm = () => {
//     if (step === 1) {
//       setStep(2);
//       return;
//     }

//     // Final confirmation
//     setIsSubmitting(true);

//     // Simulate API call
//     setTimeout(() => {
//       console.log("Action:", mode);
//       console.log("Reason:", selectedReason);
//       console.log("Additional comments:", additionalComments);

//       if (mode === "return") {
//         console.log("Return method:", returnMethod);
//         console.log("Selected items:", selectedItems);
//         console.log("Item conditions:", itemConditions);
//       }

//       setIsSubmitting(false);
//       setOpen(false);

//       // Reset for next time
//       setTimeout(() => {
//         setStep(1);
//         setSelectedReason("");
//         setAdditionalComments("");
//         setSelectedItems([]);
//         setItemConditions({});
//       }, 500);
//     }, 1500);
//   };

//   const handleBack = () => {
//     if (step === 2) {
//       setStep(1);
//     }
//   };

//   const toggleItemSelection = (itemId: number) => {
//     setSelectedItems((prev) =>
//       prev.includes(itemId)
//         ? prev.filter((id) => id !== itemId)
//         : [...prev, itemId]
//     );
//   };

//   const updateItemCondition = (itemId: number, condition: string) => {
//     setItemConditions((prev) => ({
//       ...prev,
//       [itemId]: condition,
//     }));
//   };

//   const isOtherSelected = selectedReason.includes("Khác");

//   const canProceed = () => {
//     if (!selectedReason) return false;

//     if (isOtherSelected && additionalComments.trim().length === 0) return false;

//     if (mode === "return") {
//       if (selectedItems.length === 0) return false;

//       // Check if all selected items have conditions set
//       for (const itemId of selectedItems) {
//         if (!itemConditions[itemId]) return false;
//       }
//     }

//     return true;
//   };

//   const getActionColor = () => {
//     return mode === "cancel" ? "red" : "amber";
//   };

//   const getActionIcon = () => {
//     return mode === "cancel" ? (
//       <ClipboardX className="h-4 w-4" />
//     ) : (
//       <RotateCcw className="h-4 w-4" />
//     );
//   };

//   const getActionTitle = () => {
//     return mode === "cancel" ? "Hủy đơn hàng" : "Trả hàng";
//   };

//   const getReasons = () => {
//     return mode === "cancel" ? cancelReasons : returnReasons;
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(newOpen) => {
//         setOpen(newOpen);
//         if (!newOpen) {
//           // Reset when dialog closes
//           setTimeout(() => {
//             setStep(1);
//             setSelectedReason("");
//             setAdditionalComments("");
//             setSelectedItems([]);
//             setItemConditions({});
//           }, 300);
//         }
//       }}
//     >
//       <div className="flex gap-2">
//         <DialogTrigger asChild>
//           <Button
//             variant="outline"
//             className={`group flex items-center gap-2 text-${getActionColor()}-500 border-${getActionColor()}-200 hover:bg-${getActionColor()}-50 hover:text-${getActionColor()}-600 transition-all duration-300`}
//           >
//             <ClipboardX className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
//             Hủy đơn hàng
//           </Button>
//         </DialogTrigger>

//         <DialogTrigger asChild>
//           <Button
//             variant="outline"
//             className="group flex items-center gap-2 text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300"
//             onClick={() => handleModeChange("return")}
//           >
//             <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
//             Trả hàng
//           </Button>
//         </DialogTrigger>
//       </div>

//       <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border-0 shadow-xl">
//         <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 overflow-hidden">
//           <div
//             className={`h-full bg-${getActionColor()}-500 transition-all duration-500 ease-in-out`}
//             style={{ width: step === 1 ? "50%" : "100%" }}
//           />
//         </div>

//         <div
//           className={`bg-gradient-to-r from-${getActionColor()}-50 to-${getActionColor()}-100 p-6`}
//         >
//           <DialogHeader className="space-y-3">
//             <div className="flex items-center gap-3">
//               <div className="bg-white p-2.5 rounded-full shadow-sm">
//                 {mode === "cancel" ? (
//                   <AlertCircle
//                     className={`h-6 w-6 text-${getActionColor()}-500`}
//                   />
//                 ) : (
//                   <RotateCcw
//                     className={`h-6 w-6 text-${getActionColor()}-500`}
//                   />
//                 )}
//               </div>
//               <div>
//                 <DialogTitle className="text-xl font-semibold text-gray-800">
//                   {step === 1
//                     ? mode === "cancel"
//                       ? "Xác nhận hủy đơn hàng"
//                       : "Yêu cầu trả hàng"
//                     : mode === "cancel"
//                     ? "Xem lại thông tin hủy đơn"
//                     : "Xem lại thông tin trả hàng"}
//                 </DialogTitle>
//                 <DialogDescription className="text-gray-600 mt-1">
//                   {step === 1
//                     ? "Vui lòng cho chúng tôi biết lý do của bạn."
//                     : "Vui lòng xác nhận thông tin của bạn."}
//                 </DialogDescription>
//               </div>
//             </div>
//           </DialogHeader>
//         </div>

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={`step-${step}-${mode}`}
//             initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             {step === 1 ? (
//               <div className="p-6 max-h-[60vh] overflow-y-auto">
//                 {/* Mode selector - only shown in step 1 */}
//                 <Tabs
//                   defaultValue={mode}
//                   className="mb-6"
//                   onValueChange={(value) =>
//                     handleModeChange(value as ActionMode)
//                   }
//                 >
//                   <TabsList className="grid w-full grid-cols-2">
//                     <TabsTrigger value="cancel">Hủy đơn hàng</TabsTrigger>
//                     <TabsTrigger value="return">Trả hàng</TabsTrigger>
//                   </TabsList>
//                 </Tabs>

//                 <div className="mb-4 flex items-center gap-2">
//                   <Badge
//                     variant="outline"
//                     className="bg-orange-50 text-orange-700 border-orange-200 px-2 py-1"
//                   >
//                     Đang xử lý
//                   </Badge>
//                   <span className="text-sm text-gray-500">
//                     Đơn hàng #VN12345
//                   </span>
//                 </div>

//                 {mode === "return" && (
//                   <div className="mb-6 space-y-4">
//                     <h3 className="text-sm font-medium">
//                       Chọn sản phẩm muốn trả
//                     </h3>
//                     {orderItems.map((item) => (
//                       <div
//                         key={item.id}
//                         className={cn(
//                           "relative flex flex-col rounded-lg border p-4 transition-all duration-200",
//                           selectedItems.includes(item.id)
//                             ? "border-amber-200 bg-amber-50 shadow-sm"
//                             : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                         )}
//                       >
//                         <div className="flex items-start gap-3">
//                           <Checkbox
//                             id={`item-${item.id}`}
//                             checked={selectedItems.includes(item.id)}
//                             onCheckedChange={() => toggleItemSelection(item.id)}
//                             className={cn(
//                               "transition-colors duration-200",
//                               selectedItems.includes(item.id)
//                                 ? "border-amber-500 text-amber-500"
//                                 : ""
//                             )}
//                           />
//                           <div className="flex flex-1 gap-3">
//                             <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
//                               <Image
//                                 src={item.image || "/placeholder.svg"}
//                                 alt={item.name}
//                                 width={80}
//                                 height={80}
//                                 className="object-cover"
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <Label
//                                 htmlFor={`item-${item.id}`}
//                                 className="font-medium cursor-pointer"
//                               >
//                                 {item.name}
//                               </Label>
//                               <div className="flex justify-between mt-1">
//                                 <span className="text-sm text-gray-500">
//                                   SL: {item.quantity}
//                                 </span>
//                                 <span className="text-sm font-medium">
//                                   {item.price}
//                                 </span>
//                               </div>

//                               {selectedItems.includes(item.id) && (
//                                 <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
//                                   <Label
//                                     htmlFor={`condition-${item.id}`}
//                                     className="text-sm mb-1 block"
//                                   >
//                                     Tình trạng sản phẩm
//                                   </Label>
//                                   <Select
//                                     value={itemConditions[item.id] || ""}
//                                     onValueChange={(value) =>
//                                       updateItemCondition(item.id, value)
//                                     }
//                                   >
//                                     <SelectTrigger
//                                       id={`condition-${item.id}`}
//                                       className="w-full"
//                                     >
//                                       <SelectValue placeholder="Chọn tình trạng" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="new">
//                                         Còn nguyên hộp, chưa sử dụng
//                                       </SelectItem>
//                                       <SelectItem value="opened">
//                                         Đã mở hộp, chưa sử dụng
//                                       </SelectItem>
//                                       <SelectItem value="used">
//                                         Đã sử dụng, còn tốt
//                                       </SelectItem>
//                                       <SelectItem value="damaged">
//                                         Bị hư hỏng/lỗi
//                                       </SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     {selectedItems.length > 0 && (
//                       <div className="mt-4 space-y-2">
//                         <Label
//                           htmlFor="return-method"
//                           className="text-sm font-medium"
//                         >
//                           Phương thức trả hàng
//                         </Label>
//                         <Select
//                           value={returnMethod}
//                           onValueChange={setReturnMethod}
//                         >
//                           <SelectTrigger id="return-method">
//                             <SelectValue placeholder="Chọn phương thức" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="pickup">
//                               Đơn vị vận chuyển đến lấy hàng
//                             </SelectItem>
//                             <SelectItem value="dropoff">
//                               Tự mang đến điểm giao nhận
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="space-y-2 mb-4">
//                   <h3 className="text-sm font-medium">
//                     {mode === "cancel" ? "Lý do hủy đơn" : "Lý do trả hàng"}
//                   </h3>
//                 </div>

//                 <RadioGroup
//                   value={selectedReason}
//                   onValueChange={setSelectedReason}
//                   className="space-y-3"
//                 >
//                   {getReasons().map((item) => (
//                     <div
//                       key={item.id}
//                       className={cn(
//                         "relative flex flex-col rounded-lg border p-4 transition-all duration-200",
//                         selectedReason === item.reason
//                           ? `border-${getActionColor()}-200 bg-${getActionColor()}-50 shadow-sm`
//                           : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                       )}
//                     >
//                       <div className="flex items-start gap-3">
//                         <RadioGroupItem
//                           value={item.reason}
//                           id={item.id}
//                           className={cn(
//                             "transition-colors duration-200",
//                             selectedReason === item.reason
//                               ? `border-${getActionColor()}-500 text-${getActionColor()}-500`
//                               : ""
//                           )}
//                         />
//                         <div className="space-y-1 flex-1">
//                           <div className="flex items-center gap-2">
//                             <div
//                               className={cn(
//                                 "p-1.5 rounded-full transition-colors duration-200",
//                                 selectedReason === item.reason
//                                   ? `bg-${getActionColor()}-100`
//                                   : "bg-gray-100"
//                               )}
//                             >
//                               {item.icon}
//                             </div>
//                             <Label
//                               htmlFor={item.id}
//                               className={cn(
//                                 "font-medium text-base cursor-pointer transition-colors duration-200",
//                                 selectedReason === item.reason
//                                   ? `text-${getActionColor()}-700`
//                                   : "text-gray-700"
//                               )}
//                             >
//                               {item.reason}
//                             </Label>
//                           </div>
//                           <p className="text-sm text-gray-500 ml-8">
//                             {item.description}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </RadioGroup>

//                 {isOtherSelected && (
//                   <div className="mt-4 space-y-2">
//                     <Label htmlFor="comments" className="text-sm font-medium">
//                       Vui lòng cung cấp thêm thông tin
//                     </Label>
//                     <Textarea
//                       id="comments"
//                       placeholder={
//                         mode === "cancel"
//                           ? "Nhập lý do hủy đơn hàng của bạn..."
//                           : "Nhập lý do trả hàng của bạn..."
//                       }
//                       value={additionalComments}
//                       onChange={(e) => setAdditionalComments(e.target.value)}
//                       className="min-h-[100px] resize-none"
//                     />
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="p-6 max-h-[60vh] overflow-y-auto">
//                 <div className="mb-6">
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">
//                     {mode === "cancel" ? "Lý do hủy đơn" : "Lý do trả hàng"}
//                   </h3>
//                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <p className="font-medium text-gray-800">
//                       {selectedReason}
//                     </p>
//                     {isOtherSelected && additionalComments && (
//                       <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
//                         <p className="text-sm text-gray-600">
//                           {additionalComments}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {mode === "return" && selectedItems.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-sm font-medium text-gray-500 mb-2">
//                       Sản phẩm trả lại
//                     </h3>
//                     <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                       <div className="space-y-4">
//                         {orderItems
//                           .filter((item) => selectedItems.includes(item.id))
//                           .map((item) => (
//                             <div key={item.id} className="flex gap-3">
//                               <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
//                                 <Image
//                                   src={item.image || "/placeholder.svg"}
//                                   alt={item.name}
//                                   width={80}
//                                   height={80}
//                                   className="object-cover"
//                                 />
//                               </div>
//                               <div className="flex-1">
//                                 <p className="text-sm font-medium">
//                                   {item.name}
//                                 </p>
//                                 <div className="flex justify-between mt-1">
//                                   <span className="text-sm text-gray-500">
//                                     SL: {item.quantity}
//                                   </span>
//                                   <span className="text-sm font-medium">
//                                     {item.price}
//                                   </span>
//                                 </div>
//                                 <div className="mt-1">
//                                   <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
//                                     {itemConditions[item.id] === "new" &&
//                                       "Còn nguyên hộp, chưa sử dụng"}
//                                     {itemConditions[item.id] === "opened" &&
//                                       "Đã mở hộp, chưa sử dụng"}
//                                     {itemConditions[item.id] === "used" &&
//                                       "Đã sử dụng, còn tốt"}
//                                     {itemConditions[item.id] === "damaged" &&
//                                       "Bị hư hỏng/lỗi"}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                       </div>

//                       <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm font-medium">
//                             Phương thức trả hàng:
//                           </span>
//                           <span className="text-sm">
//                             {returnMethod === "pickup"
//                               ? "Đơn vị vận chuyển đến lấy hàng"
//                               : "Tự mang đến điểm giao nhận"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mb-6">
//                   <h3 className="text-sm font-medium text-gray-500 mb-2">
//                     Thông tin đơn hàng
//                   </h3>
//                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-sm font-medium">
//                         Đơn hàng #VN12345
//                       </span>
//                       <Badge
//                         variant="outline"
//                         className="bg-orange-50 text-orange-700 border-orange-200"
//                       >
//                         Đang xử lý
//                       </Badge>
//                     </div>
//                     <p className="text-xs text-gray-500 mb-4">
//                       Đặt ngày 05/04/2025 • 14:30
//                     </p>

//                     {mode === "cancel" && (
//                       <div className="space-y-4">
//                         {orderItems.map((item) => (
//                           <div key={item.id} className="flex gap-3">
//                             <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
//                               <Image
//                                 src={item.image || "/placeholder.svg"}
//                                 alt={item.name}
//                                 width={80}
//                                 height={80}
//                                 className="object-cover"
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <p className="text-sm font-medium line-clamp-1">
//                                 {item.name}
//                               </p>
//                               <div className="flex justify-between mt-1">
//                                 <span className="text-sm text-gray-500">
//                                   SL: {item.quantity}
//                                 </span>
//                                 <span className="text-sm font-medium">
//                                   {item.price}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div
//                   className={`bg-${getActionColor()}-50 border border-${getActionColor()}-200 rounded-lg p-4`}
//                 >
//                   <div className="flex gap-3">
//                     <div className="flex-shrink-0">
//                       <AlertCircle
//                         className={`h-5 w-5 text-${getActionColor()}-500`}
//                       />
//                     </div>
//                     <div>
//                       <h4
//                         className={`text-sm font-medium text-${getActionColor()}-800`}
//                       >
//                         {mode === "cancel"
//                           ? "Lưu ý về chính sách hủy đơn"
//                           : "Lưu ý về chính sách trả hàng"}
//                       </h4>
//                       <p
//                         className={`text-xs text-${getActionColor()}-700 mt-1`}
//                       >
//                         {mode === "cancel"
//                           ? "Sau khi hủy đơn hàng, bạn sẽ không thể khôi phục lại. Nếu đã thanh toán, tiền sẽ được hoàn lại trong vòng 7-14 ngày làm việc."
//                           : "Sản phẩm trả lại phải còn nguyên vẹn, đầy đủ phụ kiện và hóa đơn. Thời gian hoàn tiền sau khi nhận được hàng trả là 7-14 ngày làm việc."}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>

//         <Separator />

//         <DialogFooter className="flex justify-between p-4 bg-gray-50">
//           {step === 1 ? (
//             <>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => setOpen(false)}
//                 className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
//               >
//                 <X className="h-4 w-4" />
//                 Quay lại
//               </Button>
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <div>
//                       <Button
//                         type="button"
//                         onClick={handleConfirm}
//                         disabled={!canProceed()}
//                         className={cn(
//                           "flex items-center gap-2 transition-all duration-200",
//                           !canProceed()
//                             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                             : `bg-${getActionColor()}-500 hover:bg-${getActionColor()}-600 text-white`
//                         )}
//                       >
//                         Tiếp tục
//                         <ArrowRight className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TooltipTrigger>
//                   {!canProceed() && (
//                     <TooltipContent>
//                       <p>
//                         {mode === "return" && selectedItems.length === 0
//                           ? "Vui lòng chọn ít nhất một sản phẩm"
//                           : isOtherSelected &&
//                             additionalComments.trim().length === 0
//                           ? "Vui lòng nhập lý do của bạn"
//                           : "Vui lòng chọn lý do"}
//                       </p>
//                     </TooltipContent>
//                   )}
//                 </Tooltip>
//               </TooltipProvider>
//             </>
//           ) : (
//             <>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleBack}
//                 className="flex items-center gap-2"
//                 disabled={isSubmitting}
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Quay lại
//               </Button>
//               <Button
//                 type="button"
//                 onClick={handleConfirm}
//                 disabled={isSubmitting}
//                 className={`flex items-center gap-2 bg-${getActionColor()}-500 hover:bg-${getActionColor()}-600 text-white min-w-[140px]`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Đang xử lý...
//                   </>
//                 ) : (
//                   <>
//                     <Check className="h-4 w-4" />
//                     {mode === "cancel" ? "Xác nhận hủy" : "Xác nhận trả hàng"}
//                   </>
//                 )}
//               </Button>
//             </>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
