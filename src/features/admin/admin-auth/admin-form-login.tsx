"use client";

import { loginAction } from "@/actions/auth";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormPassword } from "@/components/global-components/form/form-password";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { FormForgetPassword } from "@/features/auth/forget-password/form-forget-password";
import { useForgetPasswordDialog } from "@/hooks/use-forget-password-dialog";
import { LoginSafeTypesHaveEmail } from "@/zod-safe-types/auth-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const AdminFormLogin = () => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof LoginSafeTypesHaveEmail>>({
    resolver: zodResolver(LoginSafeTypesHaveEmail),
  });
  const forgetPasswordDialog = useForgetPasswordDialog();
  const { isPending, mutate: loginMutation } = useMutation({
    mutationFn: async ({ username, password }: { username: string, password: string }) => {
      try {
        const response = await loginAction({ username, password });

        if (!response?.isSuccess) {
          if (response?.status === 400 || response?.status === 404) {
            if (response?.message.includes("banned.")) {
              throw new Error("Tài khoản của bạn đã bị khóa")
            }
            throw new Error("Tài khoản hoặc mật khẩu không đúng")
          }
          throw new Error(response?.message || "Lỗi hệ thống")
        }
      } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : "Unknown error");
      }
    },
    onSuccess: () => {
      toast.success("Đăng nhập thành công", {
        duration: 1000
      });
      queryClient.invalidateQueries({ queryKey: ["authUser, mange"] })
      window.location.href = "/admin/dashboard"
    },
    onError: (error) => {
      toast.error(error.message)
    }
  });

  const onSubmit = async (values: z.infer<typeof LoginSafeTypesHaveEmail>) => {
    loginMutation({ username: values.email, password: values?.password })
  };

  const styleInput =
    "block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm";

  return (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>
        <FormInputControl
          form={form}
          name="email"
          disabled={isPending}
          label="Email"
          placeholder="mail@example.com."
          classNameInput={styleInput}
        />

        <FormPassword
          form={form}
          name="password"
          disabled={isPending}
          label="Mật khẩu"
          className={styleInput}
        />
        <div className="flex">
          <button
            onClick={() => forgetPasswordDialog.onOpen()}
            type="button"
            className="ml-auto text-base font-semibold hover:scale-105 cursor-pointer 
              hover:font-bold hover:underline">
            Quên mật khẩu?
          </button>
        </div>

        <div>
          <ButtonCustomized
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-700"
            variant="secondary"
            disabled={isPending}
            label={
              isPending ? (
                <WaitingSpinner
                  variant="pinwheel"
                  label="Đang đăng nhập..."
                  className="font-semibold "
                  classNameLabel="font-semibold text-sm"
                />
              ) : (
                "Đăng nhập"
              )
            }
          />
        </div>
      </FormValues>
      {forgetPasswordDialog.isOpen && (<FormForgetPassword />)}
    </div>
  );
};
