import { animate } from "framer-motion";
import { MotionCard } from "../profile-client";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BadgeAlertIcon,
  Box,
  Plane,
  ScrollTextIcon,
  Truck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewCardProduct } from "@/components/global-components/card/view-card-product";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const OrderTrackingClientPage = () => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[500px] "
    >
      <CardHeader>
        <AdvancedColorfulBadges color="green">
          Delivering
        </AdvancedColorfulBadges>
        <div className="flex items-center justify-between">
          <CardTitle>Order Id: OR12C31</CardTitle>

          <div className="space-x-1">
            <Button size="sm" variant="outline">
              <ScrollTextIcon className="size-6" /> Hoá Đơn
            </Button>

            <Button size="sm" variant="outline">
              <ScrollTextIcon className="size-6" /> In
            </Button>
          </div>
        </div>

        <CardDescription className="flex items-center gap-2">
          <span className="font-semibold text-base">Ngày mua: 22-02-2025</span>

          <Separator className="h-7 text-slate-700" orientation="vertical" />

          <span className="text-green-600 font-semibold flex items-center gap-x-1">
            <Plane className="size-6" /> Ước tính vận chuyển:{" "}
            <span>25-02-2025</span>
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* <ScrollArea className="max-h-[150px] overflow-auto">
          {cartItems.map((item) => (
            <ViewCardProduct
              key={item.id}
              productImage={item.image}
              productName={item.name}
              productPrice={item.price}
              productQuantity={item.quantity}
            />
          ))}
        </ScrollArea> */}

        <Separator className="my-4 h-2 w-full" orientation="horizontal" />

        {/* <div className="flex gap-x-1"> */}
        <div className="flex gap-x-1 justify-between">
          <div>
            Thanh toán: <span className="font-semibold">$100.00</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2>Vận chuyển</h2>

            <div>
              <h3>Địa chỉ: </h3>
              <span className="text-wrap truncate">
                1234, Phường 1, Quận 1, TP.HCM
              </span>
            </div>

            <div>
              <h3>Phương thức vận chuyển: </h3>
              <span className="text-wrap truncate">Giao hàng tiêu chuẩn</span>
            </div>
          </div>
        </div>

        <Separator className="my-4 h-2 w-full" orientation="horizontal" />

        <div className="flex gap-x-1 justify-between">
          <div className="flex flex-col space-y-4">
            <h2 className="font-semibold">Chính sách quan tâm</h2>

            <div className="space-y-1">
              <div className="flex items-center gap-x-1">
                <BadgeAlertIcon className="size-6" />
                <span>Vấn đề về sản phẩm</span>
              </div>

              <div className="flex items-center gap-x-1">
                <Truck className="size-6" />
                <span>Phương thức giao hàng</span>
              </div>

              <div className="flex items-center gap-x-1">
                <Box className="size-6" />
                <span>Đổi trả</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h2>Tổng quan đơn hàng</h2>

            <div className="flex items-center gap-x-1">
              <h3>Tạm tính: </h3>
              <span className="text-wrap truncate">523</span>
            </div>

            <div className="flex items-center gap-x-1">
              <h3>Giảm giá?: </h3>
              <span className="text-wrap truncate">10% 520</span>
            </div>

            <div className="flex items-center gap-x-1">
              <h4>Vận chuyển: </h4>
              <span className="text-wrap truncate">30.000đ</span>
            </div>

            <div className="flex items-center gap-x-1">
              <h2>Tổng: </h2>
              <span className="text-wrap truncate">550.000đ</span>
            </div>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
};
