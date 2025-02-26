"use client";

import { loginAction } from "@/actions/auth";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormPassword } from "@/components/global-components/form/form-password";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { useAuth } from "@/providers/auth-provider";
import { LoginSafeTypesHaveEmail } from "@/zod-safe-types/auth-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const AdminFormLogin = () => {
  const form = useForm<z.infer<typeof LoginSafeTypesHaveEmail>>({
    resolver: zodResolver(LoginSafeTypesHaveEmail),
  });

  const { setToken } = useAuth();

  const { isOpen, onOpen, onChange } = useLoginDialog();

  const onSubmit = async (values: z.infer<typeof LoginSafeTypesHaveEmail>) => {
    try {
      console.log({ values });

      const response: any = await loginAction<{
        username: string;
        password: string;
      }>({
        username: values.email,
        password: values.password,
      });

      console.log({ response });

      if (response?.isSuccess) {
        toast.success("Login successfully");

        setToken(response.token as any);

        return;
      }

      toast.error("Login failed");

      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  };

  const styleInput =
    "block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-amber-500 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm";

  return (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>
        {/* <FormInputControl
          form={form}
          name="phone"
          disabled={form.formState.isSubmitting}
          label="Phone"
          placeholder="+84..."
        /> */}

        <FormInputControl
          form={form}
          name="email"
          disabled={form.formState.isSubmitting}
          label="Email"
          placeholder="mail@example.com."
          classNameInput={styleInput}
        />

        <FormPassword
          form={form}
          name="password"
          disabled={form.formState.isSubmitting}
          label="Password"
          placeholder="your password"
          className={styleInput}
        />

        <div>
          {/* <DialogClose asChild> */}
          {/* <ButtonCustomized
            className="w-32 bg-slate-100 text-slate-900 hover:bg-slate-300"
            variant="outline"
            label="Cancel"
          /> */}
          {/* </DialogClose> */}

          <ButtonCustomized
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-700"
            variant="secondary"
            disabled={form.formState.isSubmitting}
            label={
              form.formState.isSubmitting ? (
                <WaitingSpinner
                  variant="pinwheel"
                  label="Registering..."
                  className="font-semibold "
                  classNameLabel="font-semibold text-sm"
                />
              ) : (
                "Login"
              )
            }
          />

          {/* <ButtonCustomized
            type="submit"
            className="w-32 bg-sky-500 hover:bg-sky-700"
            variant="secondary"
            label="Login"
          /> */}
        </div>
      </FormValues>
    </div>
  );
};
