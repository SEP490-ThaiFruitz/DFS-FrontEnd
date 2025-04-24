// "use client";

// import { useState } from "react";
// import { groupItemsByOrder } from "./utils";
// import PageHeader from "./components/page-header";
// import SummaryCards from "./components/summary-product";
// import FilterTabs from "./components/filter-tabs";
// import OrderCard from "./components/order-card";
// import { ReturnExchangeRequestItem } from "./types/return-exchange";
// import { OrderReturnItem } from "@/types/order-detail.types";
// // Mock data
// const returnExchangeItems: OrderReturnItem[] = [
//   {
//     returnExchangeRequestItemId: "059a8415-4443-4262-b491-f97bb976d388",
//     orderItem: {
//       id: "b91531d6-6bc7-4742-9e18-5d22140f2822",
//       referenceId: "9f222ce2-70a9-4b6a-8c45-45bb8c18b1b9",
//       name: "Tùy chọn Combo!",
//       image: null,
//       customImages: [
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918023/al1gdwfe1f1wxw1e4rpl.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918024/xlsb2tcd4ckqitz1j9gv.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918025/k9yqq3yl7cqlx0evkzlf.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
//       ],
//       itemType: "Custom",
//       quantity: 1,
//       unitPrice: 227280,
//       percentage: 6,
//       discountPrice: 213643.2,
//       orderItemDetails: [
//         {
//           id: "bbfdb554-1fac-4e7f-a241-5b6dc4814a5c",
//           productVariantId: "d5eb4704-6429-4fb0-8563-aecf075c78d2",
//           name: "Kiwi Sấy - Lon thiếc - 20g",
//           image:
//             "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918024/xlsb2tcd4ckqitz1j9gv.png",
//           quantity: 1,
//           unitPrice: 88000,
//           discountPercentage: 0,
//           discountedPrice: 88000,
//         },
//       ],
//       isCanFeedback: false,
//     },
//     requestItemStatus: "Return",
//     customerQuantity: 1,
//     customerImage:
//       "https://res.cloudinary.com/deojypwtl/image/upload/v1745478921/return-exchange-request/eb260102d1514d0c8864dd9e18d54442_rxc3df.jpg",
//     productStatus: "Đã dùng thử một phần",
//     receiveQuantity: null,
//     receiveImage: null,
//     note: null,
//     acceptQuantity: null,
//     refundAmount: null,
//     createdAt: "2023-07-15T10:30:00Z",
//   },
//   {
//     returnExchangeRequestItemId: "2a1dcbeb-c218-4f1a-8b96-c47f8aa10418",
//     orderItem: {
//       id: "b91531d6-6bc7-4742-9e18-5d22140f2822",
//       referenceId: "9f222ce2-70a9-4b6a-8c45-45bb8c18b1b9",
//       name: "Tùy chọn Combo!",
//       image: null,
//       customImages: [
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918023/al1gdwfe1f1wxw1e4rpl.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918024/xlsb2tcd4ckqitz1j9gv.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918025/k9yqq3yl7cqlx0evkzlf.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
//       ],
//       itemType: "Custom",
//       quantity: 1,
//       unitPrice: 227280,
//       percentage: 6,
//       discountPrice: 213643.2,
//       orderItemDetails: [
//         {
//           id: "910caa56-2a0b-455d-873c-4a942da7d9e5",
//           productVariantId: "5fe709ab-489a-4031-b890-ea4d8caf71d9",
//           name: "Việt quất sấy - Bao gói đơn giản - 16g",
//           image:
//             "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
//           quantity: 1,
//           unitPrice: 17000,
//           discountPercentage: 0,
//           discountedPrice: 17000,
//         },
//       ],
//       isCanFeedback: false,
//     },
//     requestItemStatus: "Return",
//     customerQuantity: 1,
//     customerImage:
//       "https://res.cloudinary.com/deojypwtl/image/upload/v1745478919/return-exchange-request/7c5cd1446836439c9d1590d035903dc3_nabeon.png",
//     productStatus: "Đã mở bao bì nhưng chưa sử dụng",
//     receiveQuantity: null,
//     receiveImage: null,
//     note: null,
//     acceptQuantity: null,
//     refundAmount: null,
//     createdAt: "2023-07-15T10:30:00Z",
//   },
//   {
//     returnExchangeRequestItemId: "7cd04736-e098-4e66-8fa2-3b432bb90ba4",
//     orderItem: {
//       id: "b91531d6-6bc7-4742-9e18-5d22140f2822",
//       referenceId: "9f222ce2-70a9-4b6a-8c45-45bb8c18b1b9",
//       name: "Tùy chọn Combo!",
//       image: null,
//       customImages: [
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918023/al1gdwfe1f1wxw1e4rpl.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918024/xlsb2tcd4ckqitz1j9gv.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918025/k9yqq3yl7cqlx0evkzlf.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
//       ],
//       itemType: "Custom",
//       quantity: 1,
//       unitPrice: 227280,
//       percentage: 6,
//       discountPrice: 213643.2,
//       orderItemDetails: [
//         {
//           id: "7f796693-ebc5-4cee-b342-6890a86e79ad",
//           productVariantId: "0bc2c18d-3fa7-4e46-b1b6-b8787ee3cd4f",
//           name: "Táo Tàu sấy - Hộp giấy quà tặng - 12g",
//           image:
//             "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918023/al1gdwfe1f1wxw1e4rpl.png",
//           quantity: 1,
//           unitPrice: 56000,
//           discountPercentage: 20,
//           discountedPrice: 44800,
//         },
//       ],
//       isCanFeedback: false,
//     },
//     requestItemStatus: "Return",
//     customerQuantity: 1,
//     customerImage:
//       "https://res.cloudinary.com/deojypwtl/image/upload/v1745478918/return-exchange-request/0801fd30ab3845208d63e765996b49e7_xmto8k.jpg",
//     productStatus: "Có mùi lạ hoặc hương vị bất thường",
//     receiveQuantity: null,
//     receiveImage: null,
//     note: null,
//     acceptQuantity: null,
//     refundAmount: null,
//     createdAt: "2023-07-15T10:30:00Z",
//   },
//   {
//     returnExchangeRequestItemId: "d644387b-9e49-46a2-8fef-b1ab69a7e663",
//     orderItem: {
//       id: "69f7215f-00c4-43b6-8085-49b8b941378a",
//       referenceId: "fac8e35a-7f94-4745-aaec-1f4d95b92554",
//       name: "Thanh Long Sấy - Túi lưới - 25g",
//       image:
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918023/sgbqyhyiymuafmbveivt.png",
//       customImages: null,
//       itemType: "Single",
//       quantity: 1,
//       unitPrice: 67000,
//       percentage: 0,
//       discountPrice: 67000,
//       orderItemDetails: null,
//       isCanFeedback: false,
//     },
//     requestItemStatus: "Return",
//     customerQuantity: 1,
//     customerImage:
//       "https://res.cloudinary.com/deojypwtl/image/upload/v1745478917/return-exchange-request/5d65adc2ae614cb0a45dda436983b96c_vayr3r.png",
//     productStatus: "Có mùi lạ hoặc hương vị bất thường",
//     receiveQuantity: null,
//     receiveImage: null,
//     note: null,
//     acceptQuantity: null,
//     refundAmount: null,
//     createdAt: "2023-07-16T14:45:00Z",
//   },
//   {
//     returnExchangeRequestItemId: "e7f6a052-f121-4edb-90df-99eb4ccc80cb",
//     orderItem: {
//       id: "b91531d6-6bc7-4742-9e18-5d22140f2822",
//       referenceId: "9f222ce2-70a9-4b6a-8c45-45bb8c18b1b9",
//       name: "Tùy chọn Combo!",
//       image: null,
//       customImages: [
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918023/al1gdwfe1f1wxw1e4rpl.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/ubifmv9flgck3bwal1qr.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918024/xlsb2tcd4ckqitz1j9gv.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918025/k9yqq3yl7cqlx0evkzlf.png",
//         "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743853070/fqn9qxyxci0bbt382w9m.png",
//       ],
//       itemType: "Custom",
//       quantity: 1,
//       unitPrice: 227280,
//       percentage: 6,
//       discountPrice: 213643.2,
//       orderItemDetails: [
//         {
//           id: "cb9cd22d-197c-4ec4-a099-514a698cd1be",
//           productVariantId: "a397478a-bbd6-42b8-8834-bc3a8a42fa48",
//           name: "Thanh Long Sấy - Túi hút chân không - 30g",
//           image:
//             "https://res.cloudinary.com/dzn4stvrw/image/upload/v1743918025/k9yqq3yl7cqlx0evkzlf.png",
//           quantity: 1,
//           unitPrice: 71000,
//           discountPercentage: 12,
//           discountedPrice: 62480,
//         },
//       ],
//       isCanFeedback: false,
//     },
//     requestItemStatus: "Return",
//     customerQuantity: 1,
//     customerImage:
//       "https://res.cloudinary.com/deojypwtl/image/upload/v1745478922/return-exchange-request/0475af56e6164437b6cf7c0c4a68b1b4_rblvfc.jpg",
//     productStatus: "Đã dùng thử một phần",
//     receiveQuantity: null,
//     receiveImage: null,
//     note: null,
//     acceptQuantity: null,
//     refundAmount: null,
//     createdAt: "2023-07-15T10:30:00Z",
//   },
// ];

// export default function ReturnExchangeRequestPage() {
//   const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
//     {}
//   );
//   const [activeTab, setActiveTab] = useState("all");
//   const groupedItems = groupItemsByOrder(returnExchangeItems);

//   const toggleOrderExpand = (orderId: string) => {
//     setExpandedOrders((prev) => ({
//       ...prev,
//       [orderId]: !prev[orderId],
//     }));
//   };

//   // Calculate summary statistics
//   const totalItems = returnExchangeItems.length;
//   const totalValue = returnExchangeItems.reduce((sum, item) => {
//     const price =
//       item.orderItem.orderItemDetails?.[0]?.discountedPrice ||
//       item.orderItem.discountPrice;
//     return sum + price;
//   }, 0);

//   const returnCount = returnExchangeItems.filter(
//     (item) => item.requestItemStatus === "Return"
//   ).length;
//   const exchangeCount = returnExchangeItems.filter(
//     (item) => item.requestItemStatus === "Exchange"
//   ).length;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       <div className="container mx-auto py-8 px-4 md:px-6">
//         <PageHeader />

//         <SummaryCards totalItems={totalItems} totalValue={totalValue} />

//         <FilterTabs
//           totalItems={totalItems}
//           returnCount={returnCount}
//           exchangeCount={exchangeCount}
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//         />

//         {/* <div className="space-y-6">
//           {groupedItems.map((group) => (
//             <OrderCard
//               key={group.orderInfo.id}
//               group={group}
//               isExpanded={!!expandedOrders[group.orderInfo.id]}
//               onToggleExpand={() => toggleOrderExpand(group.orderInfo.id)}
//             />
//           ))}
//         </div> */}
//       </div>
//     </div>
//   );
// }
