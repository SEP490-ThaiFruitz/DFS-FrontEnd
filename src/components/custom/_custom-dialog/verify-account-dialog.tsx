"use client";
import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { VerifySafeTypes } from "@/zod-safe-types/auth-safe-types";
import { logOut } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Profile } from "@/types/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API } from "@/actions/client/api-config";
import { USER_KEY } from "@/app/key/user-key";


interface VerifyDialogProps {
  user: Profile | undefined;
}
export const VerifyDialog = ({ user }: VerifyDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [time]);

  //   const user = queryClient.getQueryData<Profile>(["authUser"]);

  // const { data: user, isLoading: isUserLoading } = useQuery<Profile>({
  //   queryKey: ["authUser"],
  //   queryFn: async () => {
  //     const response = await getProfile();
  //     if (!response || !response.isSuccess || !response.data) {
  //       toast.error("Lỗi hệ thống");
  //       return undefined;
  //     }
  //     return response.data;
  //   },
  // });

  const [type, setType] = useState<string>("email");

  const { isPending, mutate: verifyMutation } = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      try {
        const response = await API.post("/Auths/confirm-otp-verification", code);

        if (response) {
          queryClient.invalidateQueries({ queryKey: [USER_KEY.PROFILE] });
          setIsOpen(false);
          toast.success("Xác thực thành công");
          form.reset();
          router.refresh();
        }
      } catch (error: unknown) {
        console.log(error)
      }
    },
  });

  const { isPending: isSending, mutate: sendVerifyCodeMutation } = useMutation({
    mutationFn: async () => {
      try {
        const response = await API.post("/Auths/send-otp-verification", { type });

        if (response) {
          toast.success("Đã gửi lại mã xác thực");
        }
      } catch (error) {
        console.log(error)
      }
    }
  });

  const form = useForm<z.infer<typeof VerifySafeTypes>>({
    resolver: zodResolver(VerifySafeTypes),
  });

  const onSubmit = async (values: z.infer<typeof VerifySafeTypes>) => {
    verifyMutation({ code: values.otp });
  };

  const title = <div className="text-center">Xác nhận tài khoản</div>;

  const body = (
    <FormValues form={form} onSubmit={onSubmit}>
      <p className="mt-3 w-96 text-center">
        Nhập mã OTP để xác thực tài khoản. Mã OTP đã được gửi về email hoặc số
        điện thoại mà bạn đã đăng kí.
      </p>
      <Controller
        name="otp"
        control={form.control}
        render={({ field }) => (
          <div className="pt-8">
            <div className="flex justify-center gap-x-2">
              <InputOTP
                disabled={isPending || isSending}
                {...field}
                maxLength={6}
                className="gap-x-2"
              >
                <InputOTPGroup className="grid grid-cols-6 gap-5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index + 1}
                      index={index}
                      className="w-12 h-12 text-xl text-center border border-gray-300 rounded-md"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        )}
      />
      <div className="flex gap-2 mt-5 items-center pb-8">
        <button
          disabled={time > 0}
          onClick={() => {
            sendVerifyCodeMutation();
            setTime(30);
          }}
          className={`${time > 0 || isPending
            ? "hover:cursor-not-allowed"
            : "hover:font-bold hover:underline hover:cursor-pointer "
            }`}
        >
          Gửi lại OTP
        </button>

        <Select
          disabled={isSending || isPending}
          defaultValue={user?.email ? "email" : "phone"}
          onValueChange={(value) => setType(value)}
        >
          <SelectTrigger disabled={isSending || isPending} className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {user?.email && (
                <SelectItem value={"email"}>{user?.email}</SelectItem>
              )}
              {user?.phone && (
                <SelectItem value={"phone"}>{user?.phone}</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* {!isUserLoading ? (
          <Select
            disabled={isSending || isPending}
            defaultValue={user?.email ? "email" : "phone"}
            onValueChange={(value) => setType(value)}
          >
            <SelectTrigger disabled={isSending || isPending} className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {user?.email && (
                  <SelectItem value={"email"}>{user?.email}</SelectItem>
                )}
                {user?.phone && (
                  <SelectItem value={"phone"}>{user?.phone}</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Skeleton className="w-32 h-10" />
        )} */}

        <div className={`${time > 0 ? "visible" : "invisible"} ml-5`}>
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute w-10 h-10 border-4  border-r-red-500 border-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <p className="absolute">{time}</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <ButtonCustomized
            disabled={isPending || isSending}
            onClick={async () => {
              await logOut();
              queryClient.removeQueries({ queryKey: [USER_KEY.PROFILE] });
              router.push("/");
              setIsOpen(false);
            }}
            className="w-32 !h-10 bg-slate-100 text-slate-900 hover:bg-slate-300"
            variant="outline"
            label="Thoát"
          />
        </DialogClose>

        <ButtonCustomized
          type="submit"
          className="max-w-fit !h-10 bg-green-500 hover:bg-green-700"
          variant="secondary"
          disabled={isPending || isSending}
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
  return (
    <DialogReused
      content={body}
      title={title}
      open={isOpen}
      hiddenClose
      className="max-w-fit px-10"
    />
  );
};
