"use client";

import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { FormPassword } from "@/components/global-components/form/form-password";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogFooter } from "@/components/ui/dialog";
import { NewPasswordSafeTypes } from "@/zod-safe-types/auth-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UserForgetPassword } from "./form-forget-password";
import { API } from "@/actions/client/api-config";

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

  const onSubmit = async (values: z.infer<typeof NewPasswordSafeTypes>) => {
    try {
      const response = await API.update("/Auths/reset-password", { ...user, newPassword: values.password });

      if (response) {
        form.reset();
        toast.success("Cập nhật mật khẩu thành công");
        handlerSucess();
      }
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <FormValues form={form} onSubmit={onSubmit}>
      <p className="mt-3 w-96 text-center">Nhập mật khẩu mới.</p>

      <div className="space-y-4">
        <FormPassword
          form={form}
          name="password"
          disabled={form.formState.isSubmitting}
          label="Mật khẩu mới"
        />

        <FormPassword
          form={form}
          name="confirmPassword"
          disabled={form.formState.isSubmitting}
          label="Xác nhận mật khẩu"
        />
      </div>

      <DialogFooter>
        {returnButton}
        <ButtonCustomized
          type="submit"
          className="max-w-fit !h-10 bg-sky-600 hover:bg-sky-700"
          variant="secondary"
          disabled={form.formState.isSubmitting}
          label={
            form.formState.isSubmitting ? (
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
