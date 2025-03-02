"use client";

import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormPassword } from "@/components/global-components/form/form-password";
import { FormValues } from "@/components/global-components/form/form-values";
import { Logo } from "@/components/global-components/logo";
import { LoginSafeTypes } from "@/zod-safe-types/auth-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogFooter } from "@/components/ui/dialog";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { loginAction } from "@/actions/auth";
import { useRegisterDialog } from "@/hooks/use-register-dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForgetPasswordDialog } from "@/hooks/use-forget-password-dialog";
import { FormForgetPassword } from "@/features/auth/forget-password/form-forget-password";
import { useAuth } from "@/providers/auth-provider";

export const LoginDialog = () => {
  const form = useForm<z.infer<typeof LoginSafeTypes>>({
    resolver: zodResolver(LoginSafeTypes),
  });
  const registerDialog = useRegisterDialog();
  const loginDialog = useLoginDialog();
  const forgetPasswordDialog = useForgetPasswordDialog();

  const queryClient = useQueryClient();

  const { setToken } = useAuth();

  const { isPending, mutate: loginMutation } = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      try {
        const response: any = await loginAction({ username, password });
        if (!response?.isSuccess) {
          if (response?.status === 400 || response?.status === 404) {
            if (response?.message.includes("banned.")) {
              throw new Error("Tài khoản của bạn đã bị khóa");
            }
            throw new Error("Tài khoản hoặc mật khẩu không đúng");
          }
          throw new Error(response?.message || "Lỗi hệ thống");
        }

        setToken(response.accessToken);
      } catch (error: any) {
        throw new Error(error?.message ?? "");
      }
    },
    onSuccess: () => {
      toast.success("Đăng nhập thành công", {
        duration: 1000,
      });

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      registerDialog.onClose();
      loginDialog.onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSafeTypes>) => {
    loginMutation({ username: values.username, password: values?.password });
  };

  const title = (
    <div className="text-center">
      <Logo height={50} width={50} />
    </div>
  );

  const trigger = (
    <button
      disabled={isPending}
      onClick={loginDialog.onOpen}
      className="relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer"
    >
      <LogIn className="size-4 mr-1" /> Đăng nhập
    </button>
  );

  const toggle = () => {
    loginDialog.onClose();
    registerDialog.onOpen();
  };

  const body = (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>
        <FormInputControl
          form={form}
          name="username"
          disabled={isPending}
          label="Tài khoản"
          placeholder="Email hoặc số điện thoại"
        />

        <FormPassword
          form={form}
          name="password"
          disabled={isPending}
          label="Mật khẩu"
          placeholder="Mật khẩu"
        />
        <div className="flex">
          <button
            type="button"
            onClick={() => {
              forgetPasswordDialog.onOpen();
            }}
            className="ml-auto text-base font-semibold hover:scale-105 cursor-pointer 
              hover:font-bold hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>
        <DialogFooter className="py-6">
          <ButtonCustomized
            type="submit"
            className="bg-sky-500 hover:bg-sky-700 hover:font-semibold duration-300 transition"
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
        </DialogFooter>
      </FormValues>
      {forgetPasswordDialog.isOpen && <FormForgetPassword />}
      <div className="mt-6">
        <h2 className="flex font-semibold items-center justify-center gap-x-1">
          Bạn chưa có tài khoản?{" "}
          <button
            disabled={isPending}
            onClick={toggle}
            className="text-base font-semibold hover:scale-105 cursor-pointer hover:font-bold hover:underline transition duration-300 hover:motion-preset-confetti  text-violet-500"
          >
            Đăng kí ở đây
          </button>
        </h2>
      </div>
    </div>
  );

  return (
    <DialogReused
      content={body}
      asChild
      trigger={trigger}
      title={title}
      open={loginDialog.isOpen}
      onClose={loginDialog.onClose}
      description="Hãy đăng nhập để mua hàng!"
    />
  );
};
