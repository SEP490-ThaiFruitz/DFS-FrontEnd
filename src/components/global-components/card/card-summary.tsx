"use client";

import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import Link from "next/link";
import { CartData } from "@/hooks/use-cart-store";
import { token } from "@/lib/token";
import { useRouter } from "next/navigation";
import { useLoginDialog } from "@/hooks/use-login-dialog";

interface CartSummaryProps {
  cart: CartData[];
  close: () => void;

  customComboPrice: number;
}

export const CartSummary = memo(
  ({ cart, customComboPrice, close }: CartSummaryProps) => {
    const { subtotal, discount, total } = useMemo(() => {
      const subtotal = cart.reduce(
        (acc, item) =>
          acc +
            (item.variant?.promotion?.price || item.variant.price) *
              item.quantityOrder! || 0,
        0
      );
      const total = cart.reduce(
        (acc, item) => acc + item.variant.price * item.quantityOrder!,
        0
      );
      const discount = subtotal - total;

      return { subtotal, discount, total };
    }, [cart]);

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
            <span>{formatPrice(subtotal + customComboPrice)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Giảm giá</span>
              <span className="text-destructive">
                -{formatPrice(discount + customComboPrice)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-medium">
            <span>Tổng tiền</span>
            <span className="text-lg text-primary">
              {formatPrice(total + customComboPrice)}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={"/payment"} onClick={close} className="w-full">
            <ButtonCustomized
              className="w-full bg-sky-500 hover:bg-sky-600/75 transition duration-300 font-bold text-slate-700"
              variant="secondary"
              size="lg"
              label={`Thanh toán (${cart.length} sản phẩm)`}
            />
          </Link>
        </CardFooter>
      </Card>
    );
  }
);

CartSummary.displayName = "CartSummary";
