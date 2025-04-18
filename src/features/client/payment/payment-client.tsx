"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import AddressChoices from "./address-choices";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { CartProductTypes } from "@/types/cart.types";
import {
  ViewCardProductActions,
  ViewCardProductActionsSkeleton,
} from "@/components/global-components/card/view-card-product-actions";
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
import { ApiResponse, PageResult, Profile } from "@/types/types";
import { AddressTypes } from "@/types/address.types";
import { USER_KEY } from "@/app/key/user-key";
import { interactApiClient } from "@/actions/client/interact-api-client";
import { useQuery } from "@tanstack/react-query";
import { CustomComboProductCard } from "@/components/global-components/card/custom-combo/card-combo-custom-item";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { ApplyVoucher, VoucherData } from "./vouchers-events";
import { getProfile } from "@/actions/user";
import { ToolTipCustomized } from "@/components/custom/tool-tip-customized";
import { WalletSheet } from "../wallet/wallet-sheet";

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

  {
    value: PaymentMethod.WALLET,
    label: "Ví Của Tôi",
  },
];

function PaymentClientPage() {
  const { customCombo } = useData();

  const [voucher, setVoucher] = useState<VoucherData | undefined>(undefined);

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

  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess,
    status,
  } = useQuery<ApiResponse<Profile>>({
    // queryKey: ["authUser"],
    queryKey: [USER_KEY.PROFILE],
    queryFn: async () => {
      const response = await getProfile();

      if (!response || !response.isSuccess || !response.data) {
        toast.error("Lỗi hệ thống");
        return undefined;
      }
      return response.data;
    },
  });

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

  const balance = user?.value?.balance;

  // this work
  // const test2 = useQuery({
  //   queryKey: ["products"],
  //   queryFn: () =>
  //     interactApiClient.get<ApiResponse<PageResult<AddressTypes>>>("/products"),
  // });

  const paymentMethodWatch = form.watch("paymentMethod");

  const token = Cookies.get("accessToken");

  let customComboPrice = 0;

  if (customCombo.data?.value && customCombo.data.value.length > 0) {
    customComboPrice = customCombo.data.value.reduce(
      (acc, combo) => acc + combo.price,
      0
    );
  }

  // console.log(customCombo.data?.value);

  const customComboItem = useMemo(() => {
    return customCombo.data?.value
      ? customCombo.data.value.map((custom) => ({
          id: custom.id,
          quantity: 1,
          type: "combo",
        }))
      : [];
  }, [customCombo.data?.value]);

  const onPaymentSubmit = async (values: z.infer<typeof PaymentSafeTypes>) => {
    // console.log({ values });

    const mergeValue = [...values.items, ...customComboItem];

    const omitValue = {
      ...omit(values, ["shipType"]),
      items: mergeValue,
      paymentMethod: paymentMethodWatch,
    };

    // console.log({ omitValue });

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

      // console.log({ response });

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

  const total =
    cart?.reduce(
      (acc, curr) =>
        acc +
        (curr.variant.promotion
          ? curr.variant.promotion.price
          : curr.variant.price) *
          Number(curr?.quantityOrder),
      0
    ) || 0;

  // console.log({ total });

  const isAuth = Boolean(token);

  const loginModal = useLoginDialog();

  // console.log(cart);

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

    const items =
      cart?.map((product) => ({
        id: product.variant.productVariantId,
        quantity: Number(product.quantityOrder),
        type: product.type,
      })) || [];

    // console.log({ items });
    // console.log({ customComboValue });

    const values = [...items, ...customComboItem];

    setCalculating(true);
    try {
      const response = await axios.post(
        `${API}/Orders/calculate-ship-fee/${addressId}`,
        // items,
        values,
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
  }, [cart, token, addressId, customComboItem]);

  useEffect(() => {
    const controller = new AbortController();

    const signal = controller.signal;

    getCalculateShippingFee();

    return () => {
      controller.abort();
    };
  }, [getCalculateShippingFee]);

  // handle voucher

  const totalBeforeVoucher = total + customComboPrice;

  const isVoucherValid =
    voucher && totalBeforeVoucher >= voucher.minimumOrderAmount;
  useEffect(() => {
    if (voucher?.id && isVoucherValid) {
      form.setValue("voucherId", voucher.id);
    } else {
      form.setValue("voucherId", null); // không hợp lệ thì không set
    }
  }, [voucher, isVoucherValid]);

  const voucherDiscount = isVoucherValid
    ? (() => {
        let discount = 0;

        if (voucher.discountType.toUpperCase() === "PERCENTAGE") {
          discount = totalBeforeVoucher * (voucher.value / 100);
        } else if (voucher.discountType.toUpperCase() === "AMOUNT") {
          discount = voucher.value;
        }

        return Math.min(discount, voucher.maximumDiscountAmount);
      })()
    : 0;

  const finalTotal =
    totalBeforeVoucher + Number(shippingFee?.totalFee ?? 0) - voucherDiscount;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 ">
      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex items-center  justify-center gap-x-2 mt-4 mb-16">
          <h1 className="text-4xl font-bold text-slate-700">Thanh Toán</h1>
          <Separator className="h-16 text-gray-800" orientation="vertical" />
          <Logo height={100} width={100} classNameLabel="text-2xl" />
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
                  <Truck className="size-8" />
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
                      <span className="font-semibold text-sky-500">
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
                <CardTitle className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-8" />
                    Phương thức thanh toán
                  </div>
                  <ToolTipCustomized
                    trigger={
                      <div className="motion-preset-seesaw rounded-full  bg-slate-50 hover:bg-slate-100/20 cursor-pointer">
                        <WalletSheet
                          user={user}
                          isUserLoading={isUserLoading}
                        />
                      </div>
                    }
                    content={
                      <div className="">
                        {!(balance != null) ? (
                          <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-slate-700">
                              Bạn đã có ví chưa?
                            </h2>
                            <span className="font-sans italic font-semibold">
                              Hãy tạo ví và thanh toán để được hưởng ưu đãi
                              Vouchers!{" "}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-slate-700">
                              Bạn đã có VÍ
                            </h2>

                            <span className="font-sans italic font-semibold">
                              Hãy thanh toán bằng ví để tiện lợi và nhận ưu đãi
                              Vouchers!
                            </span>
                          </div>
                        )}
                      </div>
                    }
                    delayDuration={100}
                    sideOffset={10}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <FormRadioControl
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
                </FormRadioControl> */}

                <FormRadioControl
                  form={form}
                  name="paymentMethod"
                  label="Chọn Phương Thức Thanh Toán"
                  disabled={form.formState.isSubmitting}
                  className="space-y-2"
                >
                  {paymentMethods.map((method) => {
                    const isWallet = method.value === PaymentMethod.WALLET;
                    const isWalletDisabled =
                      isWallet &&
                      balance != null &&
                      balance !== undefined &&
                      balance < finalTotal;

                    return (
                      <RadioItem
                        key={method.value}
                        className="flex justify-between"
                        disabled={
                          form.formState.isSubmitting || isWalletDisabled
                        }
                      >
                        <div className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={method.value}
                              disabled={isWalletDisabled}
                            />
                          </FormControl>
                          <FormLabel
                            className={`font-semibold hover:underline transition cursor-pointer ${
                              paymentMethodWatch === method.value && "underline"
                            } ${
                              isWalletDisabled &&
                              "text-gray-400 line-through cursor-not-allowed"
                            }`}
                          >
                            {method.label}
                            {isWalletDisabled && (
                              <span className="ml-2 text-xs text-rose-500">
                                (Không đủ số dư)
                              </span>
                            )}
                          </FormLabel>
                        </div>

                        {paymentMethodWatch === method.value &&
                          !isWalletDisabled && (
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
                  <ShoppingCart className="size-8" />
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

                  {customCombo.isLoading ? (
                    <ViewCardProductActionsSkeleton />
                  ) : customCombo.data?.value ? (
                    customCombo.data.value.map((custom) => {
                      return (
                        <CustomComboProductCard
                          combo={custom}
                          key={custom.id}
                        />
                      );
                    })
                  ) : null}
                </ScrollArea>

                <ApplyVoucher setVoucher={setVoucher} />

                <div className="mt-6 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700">Tạm tính</span>
                    <span className="font-semibold text-sky-500">
                      {formatVND(subtotal + customComboPrice + voucherDiscount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700">Vận chuyển</span>
                    <span className="font-semibold text-sky-500">
                      {calculating
                        ? "Đang tính..."
                        : formatVND(shippingFee?.totalFee ?? 0)}
                      {/* {formatVND(shippingFee)} */}
                    </span>
                  </div>

                  {voucher?.id && (
                    <div
                      className={`flex justify-between text-sm ${
                        isVoucherValid ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      <span>Giảm giá</span>
                      {isVoucherValid ? (
                        // <span>-{formatVND(voucher.maximumDiscountAmount)}</span>
                        <span>-{formatVND(voucherDiscount)}</span>
                      ) : (
                        <span>
                          Không đủ điều kiện (tối thiểu{" "}
                          {formatVND(voucher.minimumOrderAmount)})
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Tổng</span>
                    <AdvancedColorfulBadges
                      color="amber"
                      className="text-sky-500 text-xl"
                    >
                      {/* {formatVND(
                        total +
                          customComboPrice +
                          Number(shippingFee?.totalFee ?? 0)
                      )} */}

                      {formatVND(finalTotal)}
                    </AdvancedColorfulBadges>
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
