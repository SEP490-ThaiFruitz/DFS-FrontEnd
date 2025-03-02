"use client";
import { verifyForgetPassword } from "@/actions/auth";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogFooter } from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { TabType, UserForgetPassword } from "./form-forget-password";

interface FormVerifyProps {
  user: UserForgetPassword;
  setOtpValue: (value: UserForgetPassword, tabName: TabType) => void;
  returnButton?: React.ReactNode;
}

export const FormVerify = ({
  user,
  setOtpValue,
  returnButton,
}: FormVerifyProps) => {
  const { isPending, mutate: sendForgetPasswordCodeMutation } = useMutation({
    mutationKey: ["ForgetPassword", "Mange"],
  });
  const [otp, setOtp] = useState<string>("");
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [time]);

  const { isPending: isVerifying, mutate: verifyMutation } = useMutation({
    mutationFn: async () => {
      try {
        const response = await verifyForgetPassword({ ...user, otp });

        if (!response?.isSuccess) {
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
      } catch (error: any) {
        throw new Error(error?.message ?? "");
      }
    },
    onSuccess: () => {
      setOtpValue({ ...user, otp }, "new");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <>
      <p className="mt-3 w-96 text-center">
        Nhập mã OTP để xác thực tài khoản. Mã OTP đã được gửi về email hoặc số
        điện thoại mà bạn đã đăng kí.
      </p>

      <div className="pt-8">
        <div className="flex justify-center gap-x-2">
          <InputOTP
            onChange={(e) => setOtp(e)}
            disabled={isPending || isVerifying}
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

      <div className="flex gap-2 mt-5 items-center pb-8">
        <button
          disabled={time > 0}
          onClick={() => {
            sendForgetPasswordCodeMutation();
            setTime(30);
          }}
          className={`${
            time > 0 || isPending || isVerifying
              ? "hover:cursor-not-allowed"
              : "hover:font-bold hover:underline hover:cursor-pointer "
          }`}
        >
          Gửi lại OTP
        </button>
        <p className="font-semibold">{user.email ?? user.phone}</p>
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
        {returnButton}
        <ButtonCustomized
          className="max-w-fit !h-10 bg-green-500 hover:bg-green-700"
          variant="secondary"
          onClick={verifyMutation}
          disabled={isPending || isVerifying}
          label={
            isPending || isVerifying ? (
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
    </>
  );
};
