"use client";

import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormPassword } from "@/components/global-components/form/form-password";
import { FormValues } from "@/components/global-components/form/form-values";
import { Logo } from "@/components/global-components/logo";
import { RegisterSafeTypes } from "@/zod-safe-types/auth-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRegisterDialog } from "@/hooks/use-register-dialog";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { registerAction } from "@/actions/auth";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { USER_KEY } from "@/app/key/user-key";

interface RegisterUser {
  name: string;
  password: string;
  email?: string;
  phone?: string;
}

const inputOptions = {
  phone: {
    name: "phone",
    label: "Số điện thoại",
    placeholder: "+84...",
    switchTo: "email",
    switchLabel: "Email",
  },
  email: {
    name: "email",
    label: "Email",
    placeholder: "example@mail.com",
    switchTo: "phone",
    switchLabel: "Số điện thoại",
  },
} as const;

type LoginType = keyof typeof inputOptions;

export const RegisterDialog = () => {
  const form = useForm<z.infer<typeof RegisterSafeTypes>>({
    resolver: zodResolver(RegisterSafeTypes),
    defaultValues: {
      type: "phone",
    },
  });

  const registerDialog = useRegisterDialog();
  const loginDialog = useLoginDialog();
  const [loginType, setLoginType] = useState<"phone" | "email">("phone");
  const queryClient = useQueryClient();

  const router = useRouter();

  const { isPending, mutate: registerAccountMutation } = useMutation({
    mutationFn: async (value: RegisterUser) => {
      try {
        const response = await registerAction(value);

        if (!response?.isSuccess) {
          if (response?.detail.includes("Email")) {
            throw new Error("Email đã tồn tại. Vui lòng đăng nhập");
          }
          if (response?.detail.includes("Phone")) {
            throw new Error("Số điện thoại đã tồn tại. Vui lòng đăng nhập");
          }
          throw new Error("Lỗi hệ thống");
        }
      } catch (error: unknown) {
        throw new Error(
          error instanceof Error ? error?.message : "Lỗi hệ thống"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: [USER_KEY.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [USER_KEY.CUSTOM_COMBO] });
      queryClient.invalidateQueries({ queryKey: [USER_KEY.ADDRESS] });
      router.refresh();
      registerDialog.onClose();
      loginDialog.onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSafeTypes>) => {
    // console.log(values);
    registerAccountMutation(values);
  };

  const toggle = () => {
    registerDialog.onClose();
    loginDialog.onOpen();
  };

  const title = (
    <div className="text-center">
      <Logo height={50} width={50} />
    </div>
  );

  const trigger = (
    <button
      disabled={isPending}
      onClick={registerDialog.onOpen}
      className="relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0 before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer"
    >
      <UserPlus className="size-4 mr-1" /> Đăng kí
    </button>
  );

  const handleSwitch = (type: LoginType) => {
    const current = inputOptions[type];
    const opposite = inputOptions[current.switchTo];

    form.resetField(opposite.name);
    form.setValue("type", type);
    form.trigger("type");
    setLoginType(type);

    setTimeout(() => {
      const inputElement = document.querySelector(
        `input[name="${current.name}"]`
      ) as HTMLInputElement;
      inputElement?.focus();
    }, 0);
  };

  const current = inputOptions[loginType];

  const body = (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>
        {/* {loginType === "phone" ? (
          <div className="relative">
            <FormInputControl
              form={form}
              name="phone"
              disabled={isPending}
              label="Số điện thoại"
              placeholder="+84..."
            />
            <button
              type="button"
              onMouseDown={() => {
                setLoginType("email");
                form.resetField("phone");
                form.setValue("type", "email");
              }}
              className="absolute right-2.5 top-1 font-semibold hover:underline hover:cursor-pointer"
            >
              Email
            </button>
          </div>
        ) : (
          <div className="relative">
            <FormInputControl
              form={form}
              name="email"
              disabled={isPending}
              label="Email"
              placeholder="example@mail.com"
            />
            <button
              type="button"
              onMouseDown={() => {
                setLoginType("phone");
                form.resetField("email");
                form.setValue("type", "phone");
              }}
              className="absolute right-2.5 top-1 font-bold hover:underline hover:cursor-pointer"
            >
              Số điện thoại
            </button>
          </div>
        )} */}

        <div className="relative">
          <FormInputControl
            key={current.name}
            form={form}
            name={current.name}
            disabled={isPending}
            label={current.label}
            placeholder={current.placeholder}
          />
          <button
            type="button"
            // onMouseDown={() => handleSwitch(current.switchTo)}
            onClick={(e) => handleSwitch(current.switchTo)}
            className="absolute right-2.5 top-1 font-semibold hover:underline hover:cursor-pointer"
          >
            {current.switchLabel}
          </button>
        </div>

        <FormInputControl
          form={form}
          name="name"
          disabled={isPending}
          label="Họ và tên"
          placeholder="Nguyễn Anh Minh"
        />
        <FormPassword
          form={form}
          name="password"
          disabled={isPending}
          label="Mật Khẩu"
          placeholder="Nhập mật khẩu"
        />

        <FormPassword
          form={form}
          name="confirmPassword"
          disabled={isPending}
          label="Xác Nhận Mật Khẩu"
          placeholder="Nhập lại mật khẩu"
        />

        <DialogFooter className="py-6">
          <ButtonCustomized
            type="submit"
            disabled={isPending}
            className="bg-sky-500 hover:bg-sky-700 hover:font-semibold duration-300 transition"
            variant="secondary"
            label={
              isPending ? (
                <WaitingSpinner
                  variant="pinwheel"
                  label="Đang đăng kí..."
                  className="font-semibold "
                  classNameLabel="font-semibold text-sm"
                />
              ) : (
                "Đăng kí"
              )
            }
          />
        </DialogFooter>
      </FormValues>
      <div className="mt-6">
        <h2 className="flex font-semibold items-center justify-center gap-x-1">
          Bạn đã có tài khoản?{" "}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle();
            }}
            className="text-base font-semibold hover:scale-105 cursor-pointer hover:font-bold hover:underline transition duration-300 hover:motion-preset-confetti text-violet-500"
          >
            Đăng nhập
          </button>
        </h2>
      </div>
    </div>
  );

  return (
    <DialogReused
      content={body}
      open={registerDialog.isOpen}
      onClose={registerDialog.onClose}
      asChild
      trigger={trigger}
      title={title}
      description="Tham gia ngay để có trải nghiệm mua sắm tốt nhất!"
    />
  );
};
