"use client";
import { updateNewPassword } from "@/actions/auth";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { FormPassword } from "@/components/global-components/form/form-password";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogFooter } from "@/components/ui/dialog";
import { NewPasswordSafeTypes } from "@/zod-safe-types/auth-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UserForgetPassword } from "./form-forget-password";

interface FormUpdateNewForgetPasswordProps {
  user: UserForgetPassword;
  returnButton?: React.ReactNode;
  handlerSucess: () => void;
}

export const FormUpdateNewForgetPassword = ({
  user,
  returnButton,
  handlerSucess,
}: FormUpdateNewForgetPasswordProps) => {
  const form = useForm<z.infer<typeof NewPasswordSafeTypes>>({
    resolver: zodResolver(NewPasswordSafeTypes),
  });

  const { isPending, mutate: updateNewPasswordMutation } = useMutation({
    mutationFn: async (newPassword: string) => {
      try {
        const response = await updateNewPassword({ ...user, newPassword });

        if (!response?.isSuccess) {
          if (response?.status === 404) {
            throw new Error("Không tìm thấy tài khoản");
          }
          if (response?.status === 400) {
            if (response?.detail.includes("Invalid otp")) {
              throw new Error("Mã OTP không đúng");
            }
            if (response?.detail.includes("OTP has expired")) {
              throw new Error("Mã OTP đã hết hạn");
            }
            throw new Error("Lỗi hệ thống");
          }
          throw new Error(response?.message || "Lỗi hệ thống");
        }
      } catch (error: unknown) {
        throw new Error(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
    onSuccess: () => {
      form.reset();
      toast.success("Cập nhật mật khẩu thành công");
      handlerSucess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSafeTypes>) => {
    updateNewPasswordMutation(values.password);
  };
  return (
    <FormValues form={form} onSubmit={onSubmit}>
      <p className="mt-3 w-96 text-center">Nhập mật khẩu mới.</p>

      <div className="space-y-4">
        <FormPassword
          form={form}
          name="password"
          disabled={isPending}
          label="Mật khẩu mới"
        />

        <FormPassword
          form={form}
          name="confirmPassword"
          disabled={isPending}
          label="Xác nhận mật khẩu"
        />
      </div>

      <DialogFooter>
        {returnButton}
        <ButtonCustomized
          type="submit"
          className="max-w-fit !h-10 bg-green-500 hover:bg-green-700"
          variant="secondary"
          disabled={isPending}
          label={
            isPending ? (
              <WaitingSpinner
                variant="pinwheel"
                label="Đang xác nhận..."
                className="font-semibold "
                classNameLabel="font-semibold text-sm"
              />
            ) : (
              "Xác nhận"
            )
          }
        />
      </DialogFooter>
    </FormValues>
  );
};
