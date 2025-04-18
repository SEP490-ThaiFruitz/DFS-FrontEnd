"use client";

import type React from "react";

import { JSX, useEffect, useState } from "react";
import {
  MapPin,
  Edit,
  Trash2,
  PlusCircle,
  FileUser,
  HouseIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddressTypes } from "@/types/address.types";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";
import { useAuth } from "@/providers/auth-provider";
import { DecodeData } from "@/actions/checkrole";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import {
  FormRadioControl,
  RadioItem,
} from "@/components/global-components/form/form-radio-control";
import { FormControl, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import AddressTab from "../profile/address/address-tab";
import { DialogReused } from "@/components/global-components/dialog-reused";
// import { token } from "@/lib/token";
import { useLoginDialog } from "@/hooks/use-login-dialog";

import Cookies from "js-cookie";

type Address = {
  id?: string;
  name: string;
  street: string;
  district: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
};

interface AddressChoicesProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  addressData: {
    isAddressPending?: boolean;
    addresses: AddressTypes[] | undefined;
  };
}
export default function AddressChoices<T extends FieldValues>({
  addressData,
  form,
}: AddressChoicesProps<T>) {
  const [activeTab, setActiveTab] = useState("base-info");

  const token = Cookies.get("accessToken");

  // console.log({ token });

  const { isAddressPending, addresses: addressApi } = addressData;

  const { value } = useAuth() as { value: DecodeData };

  const [openDialogAddress, setOpenDialogAddress] = useState(false);

  const [addressReceive, setAddressReceive] = useState<
    Omit<AddressTypes, "id">
  >({
    tagName: "",
    userId: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    longitude: null,
    latitude: null,
    isDefault: false,
    provinceID: 0,
    districtID: 0,
    wardID: 0,
  });

  const InfoRow = ({
    label,
    value,
    className,
  }: {
    label: string;
    value: string | number;
    className?: string;

    classNameValue?: string;
  }) => {
    return (
      <div className="flex items-center gap-1">
        <h1 className={cn("font-normal text-slate-800", className)}>
          {label}:{" "}
        </h1>

        <h2 className={cn("font-bold text-slate-700 text-wrap", className)}>
          {value}
        </h2>
      </div>
    );
  };

  const addressIdWatch = form.watch("addressId" as Path<T>);

  const isAuth = Boolean(token);

  // console.log(isAuth);

  const loginDialog = useLoginDialog();

  useEffect(() => {
    if (addressApi && addressApi?.length > 0) {
      const defaultAddress = addressApi.find(
        (address) => address.isDefault
      )?.id;

      if (defaultAddress) {
        form.setValue(
          "addressId" as Path<T>,
          defaultAddress as PathValue<T, Path<T>>
        );
      }
    }
  }, [addressApi]);

  return (
    <>
      <div className="w-full max-w-3xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full "
        >
          <TabsList className="grid grid-cols-2 mb-4 rounded-xl text-center">
            <TabsTrigger
              value="base-info"
              className="flex items-center gap-1 font-semibold"
            >
              <FileUser className="size-6" />
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="flex items-center gap-1 font-semibold"
            >
              <MapPin className="size-6" />
              Địa chỉ giao hàng
            </TabsTrigger>
          </TabsList>

          <TabsContent value="base-info">
            <Card className="cardStyle">
              <CardHeader>
                {/* <CardTitle> */}

                <CardTitle className="flex items-center gap-2">
                  <HouseIcon className="size-8" />
                  Thông tin cơ bản của bạn
                </CardTitle>
                <CardDescription>
                  Hãy đảm bảo thông tin cơ bản của bạn chính xác
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Tên người nhận"
                    value={
                      !addressReceive.receiverName
                        ? value?.Name
                        : addressReceive.receiverName
                    }
                  />

                  <InfoRow label="Email" value={value?.Email} />
                  <InfoRow
                    label="Số điện thoại"
                    value={addressReceive.receiverPhone}
                  />
                </div>
                <InfoRow
                  className="min-w-10"
                  label="Địa chỉ"
                  value={addressReceive.receiverAddress}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card className="cardStyle">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-8" />
                      Địa chỉ giao hàng
                    </CardTitle>
                    <CardDescription>
                      Chọn địa chỉ giao hàng hoặc tạo địa chỉ mới
                    </CardDescription>
                  </div>

                  <DialogAddress
                    open={openDialogAddress}
                    onClose={(state) => setOpenDialogAddress(state)}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          isAuth
                            ? setOpenDialogAddress(true)
                            : loginDialog.onOpen();
                        }}
                        type="button"
                        className="flex items-center gap-1"
                      >
                        <PlusCircle className="h-4 w-4" /> Thêm địa chỉ mới
                      </Button>
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <>
                  {addressApi?.length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <FormRadioControl
                        form={form}
                        label="Chọn địa chỉ của bạn"
                        name={"addressId" as Path<T>}
                      >
                        {addressApi?.map((address: AddressTypes) => {
                          return (
                            <div
                              className={`relative flex flex-col p-4 border  rounded-md transition-all cardStyle ${
                                addressIdWatch === address.id
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-muted-foreground/20"
                              }`}
                              key={address.id}
                              onClick={() => setAddressReceive(address)}
                            >
                              <div className="absolute right-4 top-4 flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // handleEditAddress(address as any);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {addressApi.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // handleDeleteAddress(address.id || "");
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              <RadioItem
                                key={address.id}
                                className="items-start -space-y-1"
                                // onClick={() => setAddressReceive(address)}
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    disabled={form.formState.isSubmitting}
                                    value={address.id}
                                  />
                                </FormControl>

                                <FormLabel className="flex-1 flex cursor-pointer flex-col items-start">
                                  <div className="flex items-center  gap-2 mb-1">
                                    <FormLabel
                                      // htmlFor={`address-${address.id}`}
                                      className="font-semibold text-base cursor-pointer text-sky-600"
                                    >
                                      {address.receiverName}
                                    </FormLabel>

                                    {address.isDefault && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Mặc định
                                      </Badge>
                                    )}
                                  </div>
                                  <FormLabel className="text-sm text-slate-600 mb-1 cursor-pointer">
                                    {address.receiverAddress}
                                    {/* {address.city} {address.postalCode} */}
                                  </FormLabel>

                                  <FormLabel className="text-sm text-slate-700 cursor-pointer underline">
                                    SĐT:{" "}
                                    {formatVietnamesePhoneNumber(
                                      address.receiverPhone
                                    )}
                                  </FormLabel>

                                  {!address.isDefault &&
                                    addressIdWatch === address.id && (
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="p-0 h-auto mt-2 text-xs"
                                        // onClick={() =>
                                        //   handleSetDefaultAddress(
                                        //     address.id || ""
                                        //   )
                                        // }
                                      >
                                        Đặt làm địa chỉ mặc định
                                      </Button>
                                    )}
                                </FormLabel>
                              </RadioItem>
                            </div>
                          );
                        })}
                      </FormRadioControl>
                    </div>
                  )}
                </>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

const DialogAddress = ({
  open,
  onClose,
  trigger,
}: {
  open: boolean;
  trigger: React.ReactNode | JSX.Element;
  onClose: (state: boolean) => void;
}) => {
  const title = "Thêm địa chỉ mới";
  const description = "Vui lòng nhập thông tin địa chỉ mới của bạn";

  // const trigger =

  const content = <AddressTab />;

  return (
    <DialogReused
      title={title}
      description={description}
      content={content}
      open={open}
      trigger={trigger}
      onClose={onClose}
      className="max-w-[70%]"
    />
  );
};
