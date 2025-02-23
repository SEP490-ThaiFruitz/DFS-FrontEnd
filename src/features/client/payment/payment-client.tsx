"use client";

import React, { useState } from "react";
import { CreditCard, Truck, Tag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ViewCardProduct } from "@/components/global-components/card/view-card-product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { Logo } from "@/components/global-components/logo";
import { Separator } from "@/components/ui/separator";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DeliveryMethod {
  id: string;
  name: string;
  price: number;
  duration: string;
}

function PaymentClientPage() {
  const [promoCode, setPromoCode] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("standard");
  const [selectedPayment, setSelectedPayment] = useState<string>("card");

  const cartItems: Product[] = [
    {
      id: 1,
      name: "Dried Mango Slices",
      price: 12.99,
      quantity: 2,
      image: "/images/third-background.png",
    },
    {
      id: 2,
      name: "Mixed Dried Berries",
      price: 15.99,
      quantity: 1,
      image: "/images/third-background.png",
    },
    {
      id: 3,
      name: "Mixed Dried Berries",
      price: 15.99,
      quantity: 1,
      image: "/images/third-background.png",
    },
    {
      id: 4,
      name: "Mixed Dried Berries",
      price: 15.99,
      quantity: 1,
      image: "/images/third-background.png",
    },
    {
      id: 5,
      name: "Mixed Dried Berries",
      price: 15.99,
      quantity: 1,
      image: "/images/third-background.png",
    },
    {
      id: 6,
      name: "Mixed Dried Berries",
      price: 15.99,
      quantity: 1,
      image: "/images/third-background.png",
    },
    {
      id: 7,
      name: "Mixed Dried Berries",
      price: 15.99,
      quantity: 1,
      image: "/images/third-background.png",
    },
  ];

  const deliveryMethods: DeliveryMethod[] = [
    {
      id: "standard",
      name: "Standard Delivery",
      price: 4.99,
      duration: "3-5 business days",
    },
    {
      id: "express",
      name: "Express Delivery",
      price: 9.99,
      duration: "1-2 business days",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryPrice =
    deliveryMethods.find((m) => m.id === selectedDelivery)?.price || 0;
  const discount = promoCode === "FRUIT10" ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryPrice - discount;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center  justify-center gap-x-2 mt-4 mb-16">
          <h1 className="text-4xl font-bold text-slate-700">Thanh Toán</h1>
          <Separator className="h-16 text-gray-800" orientation="vertical" />
          <Logo height={70} width={70} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form and Options */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân của bạn</CardTitle>
                <CardDescription>
                  Hãy đảm bảo thông tin cá nhân của bạn chính xác khi tiến hành
                  thanh toán
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Phương thức giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedDelivery}
                  onValueChange={setSelectedDelivery}
                >
                  {deliveryMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div>
                          <Label htmlFor={method.id}>{method.name}</Label>
                          <p className="text-sm text-muted-foreground">
                            {method.duration}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        ${method.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                </RadioGroup>

                {selectedPayment === "card" && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input className="inputStyle" id="cardNumber" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          className="inputStyle"
                          id="expiry"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="space-y-4 max-h-[300px] overflow-auto">
                  {cartItems.map((item) => (
                    <ViewCardProduct
                      key={item.id}
                      productImage={item.image}
                      productName={item.name}
                      productPrice={item.price}
                      productQuantity={item.quantity}
                    />
                  ))}
                </ScrollArea>

                <div className="mt-6 space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        Mã giảm giá
                      </Label>
                      <Input
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter code"
                        className="inputStyle"
                      />
                    </div>
                    <Button variant="outline">Apply</Button>
                  </div>
                  {promoCode === "FRUIT10" && (
                    <p className="text-green-600 text-sm">
                      10% áp dụng khi có mã giảm giá
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vận chuyển</span>
                    <span className="font-medium">
                      ${deliveryPrice.toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2">
                    <span>Tổng</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <ButtonCustomized
                  className="w-full bg-sky-400/75 hover:bg-sky-600/80 font-semibold text-lg hover:motion-preset-confetti "
                  label="Place Order"
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentClientPage;
