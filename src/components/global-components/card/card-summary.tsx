"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem } from "./view-card-product-actions";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import Link from "next/link";

interface CartSummaryProps {
  items: CartItem[];
}

export const CartSummary = ({ items }: CartSummaryProps) => {
  const { subtotal, discount, total } = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + (item.originalPrice || item.price) * item.quantity,
      0
    );
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discount = subtotal - total;

    return { subtotal, discount, total };
  }, [items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tổng giỏ hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="text-destructive">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-medium">
          <span>Tổng tiền</span>
          <span className="text-lg text-primary">{formatPrice(total)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={"/payment"} className="w-full">
          <ButtonCustomized
            className="w-full bg-sky-400 hover:bg-sky-600/75 transition duration-300 font-bold text-slate-700"
            variant="secondary"
            size="lg"
            label={`Thanh toán (${items.length} sản phẩm)`}
          />
        </Link>
      </CardFooter>
    </Card>
  );
};
