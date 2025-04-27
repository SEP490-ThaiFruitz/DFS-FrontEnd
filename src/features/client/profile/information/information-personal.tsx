"use client";

import { API } from "@/actions/client/api-config";
import { USER_KEY } from "@/app/key/user-key";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { FormDateControl } from "@/components/global-components/form/form-date-control";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { FormControl, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { ApiResponse, Profile } from "@/types/types";
import { ProfileSafeTypes } from "@/zod-safe-types/user-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";

function InformationPersonal() {
  const queryClient = useQueryClient();
  const cookieToken = Cookies.get("accessToken");
  const { data: user } = useQuery<ApiResponse<Profile>>({
    queryKey: [USER_KEY.PROFILE],
    queryFn: async () => {
      try {
        const response = await API.get("/Users/profile");

        if (response) {
          return response;
        }
        throw new Error("Lỗi");
      } catch (error) {
        console.log(error);
      }
    },
    enabled: cookieToken !== undefined,
  });

  const form = useForm<z.infer<typeof ProfileSafeTypes>>({
    resolver: zodResolver(ProfileSafeTypes),
  });

  const onSubmit = async (values: z.infer<typeof ProfileSafeTypes>) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("email", values.email);
    formData.append("birthday", values.birthday.toDateString());
    formData.append("gender", values.gender);
    try {
      const res = await API.update("/Users/profile", formData);
      if (res) {
        toast.success("Cập nhật thông tin thành công");
        queryClient.invalidateQueries({ queryKey: [USER_KEY.PROFILE] });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h4 className="text-xl font-semibold mb-6 text-slate-700">
        Thông tin cá nhân
      </h4>
      <FormValues form={form} onSubmit={onSubmit} classNameForm="space-y-2">
        <div className="grid sm:grid-cols-2 gap-10">
          <FormInputControl
            name="name"
            form={form}
            disabled={form.formState.isSubmitting}
            label="Họ và tên"
            defaultValue={user?.value?.name}
          />
          <FormInputControl
            name="phone"
            form={form}
            disabled={form.formState.isSubmitting}
            label="Số điện thoại"
            defaultValue={user?.value?.phone}
          />
          <FormInputControl
            name="email"
            form={form}
            disabled={form.formState.isSubmitting}
            label="Email"
            defaultValue={user?.value?.email}
          />
          <FormDateControl
            maxDate={new Date(new Date().setHours(0, 0, 0, 0))}
            name="birthday"
            form={form}
            disabled={form.formState.isSubmitting}
            label="Ngày sinh nhật"
            defaultValue={
              user?.value?.birthday
                ? new Date(user?.value?.birthday)
                : undefined
            }
            require
          />
        </div>
        <Controller
          name="gender"
          control={form.control}
          defaultValue={user?.value?.gender}
          render={({ field }) => (
            <FormItem className="grid sm:grid-cols-2 items-center justify-between gap-2 py-5">
              <p className="text-sm font-medium">Giới tính</p>
              <FormControl className="grid sm:grid-cols-3 gap-3 sm:gap-10">
                <RadioGroup
                  onValueChange={(e) => field.onChange(e)}
                  defaultValue={user?.value?.gender}
                >
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="Male" id="r1" />
                    <Label htmlFor="r1">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="Female" id="r2" />
                    <Label htmlFor="r2">Nữ</Label>
                  </div>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="Other" id="r3" />
                    <Label htmlFor="r3">Khác</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <ButtonCustomized
          disabled={form.formState.isSubmitting}
          type="submit"
          label={
            form.formState.isSubmitting ? (
              <WaitingSpinner
                variant="pinwheel"
                label="Đang cập nhật..."
                className="font-semibold "
                classNameLabel="font-semibold text-sm"
              />
            ) : (
              <>
                Lưu thay đổi <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )
          }
          className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        />
      </FormValues>
    </>
  );
}

export default InformationPersonal;
