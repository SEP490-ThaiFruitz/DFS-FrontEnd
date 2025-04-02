"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { useFromStore } from "@/hooks/use-from-store";
import { useCartStore } from "@/hooks/use-cart-store";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { omit } from "lodash";
import { API } from "@/app/key/url";
import { ApiResponse, PageResult } from "@/types/types";
import { AddressTypes } from "@/types/address.types";
import { USER_KEY } from "@/app/key/user-key";
import { interactApiClient } from "@/actions/client/interact-api-client";
import { useQuery } from "@tanstack/react-query";

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

  notice: string;
}

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

function PaymentClientPage() {
  const [promoCode, setPromoCode] = useState("");

  const deliveryMethods: DeliveryMethodType[] = [
    {
      id: "standard",
      name: "Chuẩn",
      price: 20000,
      duration: "Khoảng 3-5 ngày",
      notice:
        "Lưu ý giá có thể thay đổi phụ thuộc vào khu vực và khối lượng đơn hàng",
    },
  ];

  const router = useRouter();

  const form = useForm<z.infer<typeof PaymentSafeTypes>>({
    resolver: zodResolver(PaymentSafeTypes),
    defaultValues: {
      paymentMethod: PaymentMethod.VNPAY,
      shipType: DeliveryMethod.STANDARD,

      voucherId: null,
    },
  });

  const addresses = useFetch<ApiResponse<PageResult<AddressTypes>>>(
    "/Addresses",
    [USER_KEY.ADDRESS]
  );

  // this work
  // const test2 = useQuery({
  //   queryKey: ["products"],
  //   queryFn: () =>
  //     interactApiClient.get<ApiResponse<PageResult<AddressTypes>>>("/products"),
  // });

  const paymentMethodWatch = form.watch("paymentMethod");

  console.log(paymentMethodWatch);

  const token = Cookies.get("accessToken");

  const onPaymentSubmit = async (values: z.infer<typeof PaymentSafeTypes>) => {
    console.log({ values });

    const omitValue = {
      ...omit(values, ["shipType"]),
      paymentMethod: paymentMethodWatch,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/Orders`,
        omitValue,
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

  const cart = useFromStore(useCartStore, (state) => state.orders);

  const increaseQuantity = useCartStore((state) => state.addOrder);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const subtotal =
    cart?.reduce(
      (acc, curr) => acc + curr.variant.price * Number(curr?.quantityOrder),
      0
    ) || 0;

  const discount = promoCode === "FRUIT10" ? subtotal * 0.1 : 0;

  const total =
    cart?.reduce(
      (acc, curr) => acc + curr.variant.price * Number(curr?.quantityOrder),
      0
    ) || 0;

  const isAuth = Boolean(token);

  const loginModal = useLoginDialog();

  console.log(cart);

  useEffect(() => {
    if (cart && cart.length > 0) {
      form.setValue(
        "items",

        cart.map((product) => ({
          id: product.variant.productVariantId,
          quantity: Number(product.quantityOrder),
          type: product.type,
        }))
      );
    }
  }, [cart]);

  const [shippingFee, setShippingFee] = useState<{
    totalFee: number;
    expectedDeliveryTime: Date;
  }>();

  const addressId = form.watch("addressId");

  const [calculating, setCalculating] = useState(false);

  const getCalculateShippingFee = useCallback(async () => {
    if ((cart && cart.length === 0) || !token) {
      return;
    }

    const items = cart?.map((product) => ({
      id: product.variant.productVariantId,
      quantity: Number(product.quantityOrder),
      type: product.type,
    }));

    console.log({ items });

    setCalculating(true);
    try {
      const response = await axios.post(
        `${API}/Orders/calculate-ship-fee/${addressId}`,
        items,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setShippingFee(response.data.value);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCalculating(false);
    }
  }, [cart, token, addressId]);

  useEffect(() => {
    const controller = new AbortController();

    const signal = controller.signal;

    getCalculateShippingFee();

    return () => {
      controller.abort();
    };
  }, [getCalculateShippingFee]);

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

            <AddressChoices
              addressData={{
                addresses: addresses.data?.value?.items,
                isAddressPending: addresses.isLoading,
              }}
              form={form}
            />

            {/* Delivery Method */}
            <Card className="cardStyle">
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
                    <RadioItem
                      key={method.id}
                      className="flex items-start justify-between p-4 border rounded-xl"
                    >
                      <div className="flex gap-2">
                        <FormControl>
                          <RadioGroupItem value={method.id} />
                        </FormControl>
                        <div className="flex flex-col items-start gap-2">
                          <FormLabel>{method.name}</FormLabel>
                          <div className="flex items-center gap-1 line-clamp-1">
                            <span className="text-slate-700 text-xs">
                              {method.duration}
                            </span>{" "}
                            <Separator
                              className="h-8 text-slate-800 mx-1"
                              orientation="vertical"
                            />
                            <span className="text-ellipsis text-slate-700 text-xs">
                              {method.notice}
                            </span>
                          </div>
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
            <Card className="cardStyle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormRadioControl
                  form={form}
                  name="paymentMethod"
                  label="Chọn Phương Thức Thanh Toán"
                  disabled={form.formState.isSubmitting}
                  className="space-y-2"
                >
                  {paymentMethods.map((method) => {
                    return (
                      <RadioItem
                        key={method.value}
                        className="flex justify-between"
                        disabled={form.formState.isSubmitting}
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
            <Card className="sticky top-8 cardStyle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Tổng quan đơn hàng của bạn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="space-y-4 max-h-[300px] overflow-auto">
                  {cart?.map((product) => {
                    return (
                      <ViewCardProductActions
                        key={product.variant.productVariantId}
                        product={product}
                        decreaseQuantity={() => decreaseQuantity(product)}
                        increaseQuantity={() => increaseQuantity(product)}
                        removeFromCart={() => removeFromCart(product)}
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
                    <span className="text-green-600 text-sm">
                      10% áp dụng khi có mã giảm giá
                    </span>
                  )}
                </div>

                <div className="mt-6 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vận chuyển</span>
                    <span className="font-medium">
                      {calculating
                        ? "Đang tính..."
                        : formatVND(shippingFee?.totalFee ?? 0)}
                      {/* {formatVND(shippingFee)} */}
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
                    <span>
                      {formatVND(total + Number(shippingFee?.totalFee ?? 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <ButtonCustomized
                  type="submit"
                  // onClick={() => {
                  //   isAuth
                  //     ? () => form.handleSubmit(onPaymentSubmit)()
                  //     : loginModal.onOpen();
                  // }}
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
