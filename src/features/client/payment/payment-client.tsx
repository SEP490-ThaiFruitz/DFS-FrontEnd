"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Truck, Tag, ShoppingCart, Check } from "lucide-react";
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
import Maps from "@/components/global-components/maps";
import { useAuth } from "@/providers/auth-provider";
import AddressChoices from "./address-choices";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { CartProductTypes } from "@/types/cart.types";
import { ViewCardProductActions } from "@/components/global-components/card/view-card-product-actions";
import { CART_KEY } from "@/app/key/comm-key";
import { useData } from "@/providers/data-provider";
import { useForm } from "react-hook-form";
import {
  DeliveryMethod,
  PaymentMethod,
  PaymentSafeTypes,
} from "@/zod-safe-types/payment-safe-types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues } from "@/components/global-components/form/form-values";
import {
  FormRadioControl,
  RadioItem,
} from "@/components/global-components/form/form-radio-control";
import { FormControl, FormLabel } from "@/components/ui/form";
import { formatVND } from "@/lib/format-currency";

import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DeliveryMethodType {
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

  const deliveryMethods: DeliveryMethodType[] = [
    {
      id: "standard",
      name: "Standard Delivery",
      price: 30000,
      duration: "Khoảng 3-5 ngày",
    },
    {
      id: "fast",
      name: "Giao hàng nhanh",
      price: 3000,
      duration: "Khoảng 1-2 ngày",
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

  const { user } = useAuth();

  const router = useRouter();

  const form = useForm<z.infer<typeof PaymentSafeTypes>>({
    resolver: zodResolver(PaymentSafeTypes),
    defaultValues: {
      paymentType: PaymentMethod.VNPAY,
      shipType: DeliveryMethod.STANDARD,

      shippingUnitId: "fc744060-00f1-47a0-a138-afd849f9aff6",
      voucherId: null,
    },
  });

  const {
    isLoading,
    data: productCart,
    error,
  } = useFetch<{ value: { items: CartProductTypes[] } }>("Carts/", [
    CART_KEY.CARTS,
  ]);

  const { addressData } = useData();

  const { value } = useAuth();

  const paymentMethods: { value: string; label: string }[] = [
    {
      value: PaymentMethod.VNPAY,
      label: "VNPAY",
    },
    {
      value: PaymentMethod.PAYOS,
      label: "PayOS",
    },
  ];

  const paymentMethodWatch = form.watch("paymentType");

  useEffect(() => {
    if (productCart && productCart?.value?.items?.length > 0) {
      form.setValue(
        "cartItemIds",
        productCart.value.items.map((item) => item.cartItemId)
      );
    }
  }, [productCart]);

  const token = Cookies.get("accessToken");

  const onPaymentSubmit = async (values: z.infer<typeof PaymentSafeTypes>) => {
    console.log({ values });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/Orders`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log({ response });

      if (response.status === 200) {
        toast.success("Đặt hàng thành công");
        router.push(response.data.value.orderPaymentUrl);

        return;
      }
    } catch (error) {
      console.log({ error });

      toast.error("Đặt hàng thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 ">
      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex items-center  justify-center gap-x-2 mt-4 mb-16">
          <h1 className="text-4xl font-bold text-slate-700">Thanh Toán</h1>
          <Separator className="h-16 text-gray-800" orientation="vertical" />
          <Logo height={70} width={70} />
        </div>

        <FormValues
          form={form}
          onSubmit={onPaymentSubmit}
          classNameForm="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Form and Options */}
          <div className="space-y-6">
            {/* Personal Information */}

            <AddressChoices addressData={addressData} form={form} />

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Phương thức giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormRadioControl
                  // value={selectedDelivery}
                  // onValueChange={setSelectedDelivery}
                  form={form}
                  name="shipType"
                  label="Chọn Phương Thức Giao Hàng"
                  className="space-y-4"
                >
                  {deliveryMethods.map((method) => (
                    // <div
                    //   key={method.id}
                    //   className="flex items-center justify-between p-4 border rounded-lg"
                    // >
                    //   <div className="flex items-center gap-2">
                    //     <RadioGroupItem value={method.id} id={method.id} />
                    //     <div>
                    //       <Label htmlFor={method.id}>{method.name}</Label>
                    //       <p className="text-sm text-muted-foreground">
                    //         {method.duration}
                    //       </p>
                    //     </div>
                    //   </div>
                    //   <span className="font-medium">
                    //     ${method.price.toFixed(2)}
                    //   </span>
                    // </div>

                    <RadioItem
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-xl"
                    >
                      <div className="flex gap-2">
                        <FormControl>
                          <RadioGroupItem value={method.id} />
                        </FormControl>
                        <div className="flex flex-col items-center gap-2">
                          <FormLabel>{method.name}</FormLabel>
                          <CardDescription>{method.duration}</CardDescription>
                        </div>
                      </div>
                      <span className="font-medium">
                        {formatVND(String(method.price))}
                      </span>
                    </RadioItem>
                  ))}
                </FormRadioControl>
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
                <FormRadioControl
                  form={form}
                  name="paymentType"
                  label="Chọn Phương Thức Thanh Toán"
                  disabled={form.formState.isSubmitting}
                  className="space-y-2"
                >
                  {paymentMethods.map((method) => {
                    return (
                      <RadioItem
                        key={method.value}
                        className="flex justify-between"
                      >
                        <div className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={method.value} />
                          </FormControl>
                          <FormLabel
                            className={`font-semibold hover:underline transition cursor-pointer ${
                              paymentMethodWatch === method.value && "underline"
                            }`}
                          >
                            {method.label}
                          </FormLabel>
                        </div>

                        {paymentMethodWatch === method.value && (
                          <Check className="text-green-500 mr-2" />
                        )}
                      </RadioItem>
                    );
                  })}
                </FormRadioControl>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="pt-9">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="space-y-4 max-h-[300px] overflow-auto">
                  {/* {cartItems.map((item) => (
                    <ViewCardProduct
                      key={item.id}
                      productImage={item.image}
                      productName={item.name}
                      productPrice={item.price}
                      productQuantity={item.quantity}
                    />
                  ))} */}

                  {productCart?.value?.items.map((product) => {
                    return (
                      <ViewCardProductActions
                        key={product.productId}
                        product={product}
                      />
                    );
                  })}
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
                  type="submit"
                  className="w-full bg-sky-400/75 hover:bg-sky-600/80 font-semibold text-lg hover:motion-preset-confetti "
                  label="Tiến hành thanh toán"
                />
              </CardFooter>
            </Card>
          </div>
        </FormValues>
      </div>
    </div>
  );
}

export default PaymentClientPage;
