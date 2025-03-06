import Timeline, { TimelineEvent } from "@/components/global-components/timeline/timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { fail } from "assert";
import React from "react";

interface OrderDetailsProps {
  orderId?: string;
  orderDate?: string;
  deliveryType?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}

const OrderDetailInformation: React.FC<Readonly<OrderDetailsProps>> = ({
  orderId = "#983912",
  orderDate = "2025-01-16 12:00:00+00",
  deliveryType = "GHN",
  orderStatus = "waiting",
  paymentStatus = "unpaid",
  paymentMethod = "Tiền mặt ",
}) => {
  const orderStatusColors: Record<string, { color: string; text: string }> = {
    waiting: { color: "bg-amber-100 text-amber-800", text: "Chờ xác nhận" },
    packing: { color: "bg-blue-100 text-blue-800", text: "Đang đóng gói" },
    delivering: { color: "bg-blue-100 text-blue-800", text: "Đang vận chuyển" },
    delivered: { color: "bg-green-100 text-green-800", text: "Đã giao hàng" },
    feedbacked: { color: "bg-green-100 text-green-800", text: "Đã đánh giá" },
    canceled: { color: "bg-gray-100 text-gray-800", text: "Đã hủy" },
  };

  const paymentStatusColors: Record<string, { color: string; text: string }> = {
    paid: { color: "bg-green-100 text-green-800", text: "Đã thanh toán" },
    unpaid: { color: "bg-red-100 text-red-700", text: "Chưa thanh toán" },
    refunded: { color: "bg-purple-100 text-purple-800", text: "Đã hoàn tiền" },
  };
  const steps: TimelineEvent[] = [
    {
      title: "Đơn Hàng Đã Đặt",
      date: "19:47 23-02-2025",
      completed: true,
      subEvents: [
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }, {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }, {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }, {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }, {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
      ]
    },
    {
      title: "Đã Xác Nhận Thông Tin Thanh Toán",
      date: "20:18 23-02-2025",
      completed: true,
      subEvents: [
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }, {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }, {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }, {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        }, {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
        {
          title: "Đơn Hàng Đã Đặt",
          date: "19:47 23-02-2025",
        },
      ]
    },
    {
      title: "Đã Giao Cho ĐVVC",
      date: "10:24 24-02-2025",
      completed: true,
    },
    {
      title: "Đã Nhận Được Hàng",
      date: "12:06 25-02-2025",
      completed: true,
    },
    {
      title: "Đơn Hàng Đã Được Đánh Giá",
      date: "18:57 05-03-2025",
      completed: false,
    },
  ]
  return (
    <>
      <Card className="pt-5">
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Mã đơn:</span>
            <span className="text-gray-900 font-semibold">{orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Ngày đặt:</span>
            <span className="text-gray-900">{orderDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Bên vận chuyển:</span>
            <span className="text-gray-900">{deliveryType}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Trạng thái đơn hàng:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${orderStatusColors[orderStatus]?.color || "bg-gray-100 text-gray-800"
                }`}
            >
              {orderStatusColors[orderStatus]?.text || "Không xác định"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Trạng thái thanh toán:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentStatusColors[paymentStatus]?.color || "bg-gray-100 text-gray-800"
                }`}
            >
              {paymentStatusColors[paymentStatus]?.text || "Không xác định"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Phương thức thanh toán:</span>
            <span className="text-gray-900">{paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Người hủy đơn:</span>
            <span className="text-gray-900">Khách hàng</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Thời gian hủy đơn:</span>
            <span className="text-gray-900 text-right">{formatTimeVietNam(new Date(), true)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-semibold">Lí do hủy:</span>
            <span className="text-gray-900 border p-2 rounded-md mt-2">
              Tôi đã đặt sân vào thời gian này nhưng do có việc đột xuất nên không thể tham gia. Mong chủ sân thông cảm và hỗ trợ hoàn tiền nếu có thể. Xin cảm ơn!
            </span>
          </div>
        </CardContent>
        <CardFooter className="space-x-5">
          <Button className="ml-auto" variant={"destructive"}>Hoàn trả</Button>
          <Button variant={"destructive"}>Huỷ đơn hàng</Button>
        </CardFooter>
      </Card>
      <Card className="pt-5">
        <CardTitle className="text-center mb-8 text-2xl">
          Địa chỉ giao hàng
        </CardTitle>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Tên:</span>
            <span className="text-gray-900 font-semibold">Nguyễn văn minh</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Số điện thoại:</span>
            <span className="text-gray-900">0931287525</span>
          </div>

          <div className="flex justify-between items-start space-x-6">
            <span className="text-gray-700 font-semibold min-w-fit">Địa chỉ:</span>
            <span className="text-gray-900">Quốc lộ 1K, Đông Hoà, Dĩ An, Bình Dương, Vietnam</span>
          </div>
        </CardContent>
        <Separator />
        <div className="w-full mx-auto py-5">
          <ScrollArea className="max-h-[500px] overflow-auto px-5">
            <Timeline
              events={steps}
              orientation="Vertical"
              classNameTimelinePositon="top-0 bottom-0 left-3.5 w-0.5 my-10"
              classNameTimeline="h-7 w-7"
              className=""
              showIcon={false}
            />
          </ScrollArea>
        </div>
      </Card>
    </>
  );
};

export default OrderDetailInformation;
