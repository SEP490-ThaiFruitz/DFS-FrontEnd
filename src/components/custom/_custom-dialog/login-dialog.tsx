"use client";

import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormPassword } from "@/components/global-components/form/form-password";
import { FormValues } from "@/components/global-components/form/form-values";
import { Logo } from "@/components/global-components/logo";
import {
  LoginSafeTypesHaveEmail,
} from "@/zod-safe-types/auth-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogFooter } from "@/components/ui/dialog";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { loginAction } from "@/actions/login";
import { useRegisterDialog } from "@/hooks/use-register-dialog";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

export const LoginDialog = () => {
  const form = useForm<z.infer<typeof LoginSafeTypesHaveEmail>>({
    resolver: zodResolver(LoginSafeTypesHaveEmail),
  });

  const { setToken } = useAuth();

  const onSubmit = async (values: z.infer<typeof LoginSafeTypesHaveEmail>) => {
    try {
      console.log({ values });

      const response: any = await loginAction({
        username: values.email,
        password: values.password,
      });

      console.log({ response });

      if (response?.isSuccess) {
        // loginDialog.onClose();
        toast.success("Login successful");
        setToken(response.token as any);
        return;
      }

      toast.error("Login failed");

      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  };

  const registerDialog = useRegisterDialog();
  const loginDialog = useLoginDialog();

  const title = (
    <div className="text-center">
      <Logo height={50} width={50} />
    </div>
  );

  const trigger = (
    <div
      onClick={loginDialog.onOpen}
      className="relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer"
    >
      <LogIn className="size-4 mr-1" /> Đăng nhập
    </div>
  );

  const toggle = () => {
    loginDialog.onClose();
    registerDialog.onOpen();
  };

  console.log("login dialog: ", loginDialog.isOpen);

  const body = (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>

        <FormInputControl
          form={form}
          name="email"
          disabled={form.formState.isSubmitting}
          label="Email"
          placeholder="mail@example.com."
        />

        <FormPassword
          form={form}
          name="password"
          disabled={form.formState.isSubmitting}
          label="Password"
          placeholder="Mật khẩu"
        />

        <DialogFooter>
          <ButtonCustomized
            type="submit"
            className="max-w-32 bg-sky-500 hover:bg-sky-700"
            variant="secondary"
            disabled={form.formState.isSubmitting}
            label={
              form.formState.isSubmitting ? (
                <WaitingSpinner
                  variant="pinwheel"
                  label="Đang đăng kí..."
                  className="font-semibold "
                  classNameLabel="font-semibold text-sm"
                />
              ) : (
                "Đăng nhập"
              )
            }
          />

          {/* <ButtonCustomized
            type="submit"
            className="w-32 bg-sky-500 hover:bg-sky-700"
            variant="secondary"
            label="Login"
          /> */}
        </DialogFooter>

        <div className="my-2">
          <h2 className="flex font-semibold items-center justify-center gap-x-1">
            Bạn chưa có tài khoản?{" "}
            <h3
              // onClick={handleOpenRegister}
              onClick={toggle}
              className="text-base font-semibold hover:scale-105 cursor-pointer hover:font-bold hover:underline transition duration-300 hover:motion-preset-confetti  text-violet-500"
            >
              Đăng kí ở đây
            </h3>
          </h2>
        </div>
      </FormValues>
    </div>
  );

  return (
    <DialogReused
      content={body}
      asChild
      trigger={trigger}
      title={title}
      // open={isLoginOpen}

      open={loginDialog.isOpen}
      onClose={loginDialog.onClose}
      // onOpen={onOpenLogin}
      description="Hãy đăng nhập để mua hàng!"
    />
  );
};
