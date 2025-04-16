"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  CreditCard,
  Fingerprint,
  Info,
  Check,
  ArrowRight,
  LockKeyhole,
  HelpCircle,
  BarChart3,
  PlayIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { interactApiClient } from "@/actions/client/interact-api-client";
import { toast } from "sonner";

import { ApiResponse, Profile } from "@/types/types";
import { CreateWallet } from "./create-wallet";
import { ConfirmWallet } from "./confirm-wallet";
import { useQueryClient } from "@tanstack/react-query";
import { USER_KEY } from "@/app/key/user-key";
import { SuccessWallet } from "./success-wallet";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface WalletSheetProps {
  user: ApiResponse<Profile> | undefined;
  isUserLoading: boolean;
}
export const WalletSheet = ({ user, isUserLoading }: WalletSheetProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"create" | "confirm" | "success" | "error">(
    "create"
  );
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [error, setError] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [pinStrength, setPinStrength] = useState<
    "weak" | "medium" | "strong" | ""
  >("");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (pin?.length < 4) {
      setPinStrength("");
      return;
    }

    // Check for sequential numbers (e.g., 1234, 4321)
    const isSequential = (pinStr: string): boolean => {
      let isAscending = true;
      let isDescending = true;

      for (let i = 1; i < pinStr.length; i++) {
        if (Number.parseInt(pinStr[i]) !== Number.parseInt(pinStr[i - 1]) + 1) {
          isAscending = false;
        }
        if (Number.parseInt(pinStr[i]) !== Number.parseInt(pinStr[i - 1]) - 1) {
          isDescending = false;
        }
      }

      return isAscending || isDescending;
    };

    // Check for repeated digits (e.g., 1111, 2222)
    const isRepeated = (pinStr: string): boolean => {
      return new Set(pinStr.split("")).size === 1;
    };

    if (isSequential(pin) || isRepeated(pin)) {
      setPinStrength("weak");
    } else if (pin.length < 6) {
      setPinStrength("medium");
    } else {
      setPinStrength("strong");
    }
  }, [pin]);

  const handleCreatePin = () => {
    if (pin.length < 4) {
      setError("Mã PIN phải có ít nhất 4 chữ số");
      return;
    }

    if (pinStrength === "weak" && pin.length < 6) {
      setError("Vui lòng chọn mã PIN mạnh hơn để bảo mật tốt hơn");
      return;
    }

    if (!acceptTerms) {
      setError("Bạn phải chấp nhận điều khoản và điều kiện để tiếp tục");
      return;
    }

    setStep("confirm");
  };

  console.log({ pin });

  const handleConfirmPin = async () => {
    if (pin !== confirmPin) {
      setError("Mã PIN không khớp");
      return;
    }

    try {
      const response = await interactApiClient.post<
        { isSuccess: boolean },
        { pin: string }
      >("/Wallets", { pin: confirmPin });

      if (response?.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: [USER_KEY.PROFILE],
        });

        toast.success("Tạo ví thành công");

        setPin("");
        setConfirmPin("");
        setError("");
        setRememberDevice(false);
        setAcceptTerms(false);
        setStep("success");
      } else {
        console.error("Tạo ví thất bại", response);
        toast.error("Đã xảy ra lỗi khi tạo ví của bạn");
      }
    } catch (error) {
      console.error("Gọi API thất bại", error);
      toast.error("Đã xảy ra lỗi khi tạo ví của bạn");
    }
  };

  const handleReset = () => {
    setStep("create");
    setConfirmPin("");
    setError("");
  };

  const steps = ["Tạo PIN", "Xác nhận PIN", "Hoàn thành"];
  const currentStepIndex = step === "create" ? 0 : step === "confirm" ? 1 : 2;

  useEffect(() => {
    const balance = user?.value?.balance;

    if (balance == null || balance === undefined) {
      setStep("create");
    } else if (typeof balance === "number" && balance >= 0) {
      setStep("success");
    }

    setPin("");
    setConfirmPin("");
    setError("");
    setRememberDevice(false);
    setAcceptTerms(false);
  }, [user?.value?.balance]);

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="sm" className="w-full" variant="outline">
            <Wallet className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="min-w-full sm:min-w-[400px] md:max-w-[500px] lg:min-w-[40%] p-0 border-r rounded-3xl ml-2"
        >
          <div className="h-full flex flex-col rounded-3xl overflow-hidden">
            {/* Branded Header */}
            <div className="bg-gradient-to-br from-amber-100 via-sky-50 to-green-50 p-6 text-slate-800">
              <div className="flex items-center gap-3">
                <div className="bg-primary-foreground/20 p-2 rounded-lg">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">
                    Ví Của{" "}
                    <span className="underline text-sky-600">
                      {user?.value?.name}
                    </span>
                  </h2>
                  <p className="text-xs opacity-80">
                    Nhanh chóng, an toàn, đáng tin cậy
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                {steps.map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                        index < currentStepIndex
                          ? "bg-green-500 text-white border-2 border-green-600"
                          : index === currentStepIndex
                          ? "bg-green-500 text-white border-2 border-green-600"
                          : "bg-muted text-slate-800"
                      }`}
                    >
                      {index < currentStepIndex ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium ml-2 ${
                        index === currentStepIndex
                          ? "text-primary"
                          : "text-slate-800"
                      }`}
                    >
                      {stepName}
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight className="h-4 w-4 mx-1 text-slate-800" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <SheetHeader className="pb-4 pt-6 px-6 border-b">
              <div className="flex items-center gap-3 mb-2">
                {step === "create" && (
                  <LockKeyhole className="h-6 w-6 text-primary" />
                )}
                {step === "confirm" && (
                  <ShieldCheck className="h-6 w-6 text-amber-500" />
                )}
                {step === "success" && (
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                )}
                {step === "error" && (
                  <AlertCircle className="h-6 w-6 text-destructive" />
                )}
                <SheetTitle className="text-xl">
                  {step === "create" && "Tạo Ví Của Bạn"}
                  {step === "confirm" && "Xác Nhận Mã PIN"}
                  {step === "success" && "Đã Tạo Ví!"}
                  {step === "error" && "Lỗi"}
                </SheetTitle>
              </div>
              <SheetDescription className="text-sm">
                {step === "create" &&
                  "Thiết lập mã PIN an toàn để bảo vệ ví và giao dịch của bạn."}
                {step === "confirm" &&
                  "Vui lòng xác nhận mã PIN của bạn để đảm bảo chính xác."}
                {step === "success" && "Ví của bạn đã được tạo thành công."}
                {step === "error" && "Đã xảy ra lỗi khi tạo ví của bạn."}
              </SheetDescription>
            </SheetHeader>

            <div className="p-6 flex-1 overflow-auto">
              {error && (
                <Alert
                  variant="destructive"
                  className="mb-6 animate-in fade-in-50 slide-in-from-top-5"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === "create" && (
                <CreateWallet
                  acceptTerms={acceptTerms}
                  setAcceptTerms={setAcceptTerms}
                  pin={pin}
                  setPin={setPin}
                  pinStrength={pinStrength}
                  setRememberDevice={setRememberDevice}
                  rememberDevice={rememberDevice}
                />

                // <div className="flex justify-center">
                //   <InputOTP
                //     maxLength={6}
                //     value={pin}
                //     onChange={setPin}
                //     pattern="^[0-9]+$"
                //     inputMode="numeric"
                //     containerClassName="gap-2"
                //     autoFocus
                //   >
                //     <InputOTPGroup>
                //       <InputOTPSlot
                //         index={0}
                //         className="h-14 w-14 text-center text-xl font-medium"
                //         // ref={firstSlotRef}
                //         autoFocus={true}
                //       />
                //       <InputOTPSlot
                //         index={1}
                //         className="h-14 w-14 text-center text-xl font-medium"
                //       />
                //       <InputOTPSlot
                //         index={2}
                //         className="h-14 w-14 text-center text-xl font-medium"
                //       />
                //     </InputOTPGroup>
                //     <InputOTPSeparator />
                //     <InputOTPGroup>
                //       <InputOTPSlot
                //         index={3}
                //         className="h-14 w-14 text-center text-xl font-medium"
                //       />
                //       <InputOTPSlot
                //         index={4}
                //         className="h-14 w-14 text-center text-xl font-medium"
                //       />
                //       <InputOTPSlot
                //         index={5}
                //         className="h-14 w-14 text-center text-xl font-medium"
                //       />
                //     </InputOTPGroup>
                //   </InputOTP>
                // </div>
              )}

              {step === "confirm" && (
                <ConfirmWallet
                  confirmPin={confirmPin}
                  setConfirmPin={setConfirmPin}
                />
              )}

              {step === "success" && (
                <SuccessWallet user={user} />
                // <div className="flex flex-col items-center justify-center py-8 space-y-6">
                //   <div className="rounded-full bg-green-100 p-6">
                //     <ShieldCheck className="h-12 w-12 text-green-600" />
                //   </div>
                //   <div className="text-center space-y-2">
                //     <h3 className="font-semibold text-slate-700 text-lg">
                //       Ví Đã Sẵn Sàng!
                //     </h3>
                //     <p className="text-slate-500">
                //       Ví của bạn đã được tạo thành công và sẵn sàng để sử dụng.
                //     </p>
                //   </div>

                //   {/* Wallet Overview */}
                //   <div className="w-full bg-gradient-to-br from-sky-50 via-amber-50 to-slate-400 cardStyle p-5 text-slate-700">
                //     <div className="flex justify-between items-start mb-6">
                //       <div>
                //         <h3 className="text-lg font-bold"> Ví Của Bạn</h3>
                //       </div>
                //       <CreditCard className="h-8 w-8 " />
                //     </div>
                //     <div className="mb-4">
                //       <span className="text-sm font-semibold ">
                //         Số Dư Khả Dụng
                //       </span>
                //       <h2 className="text-2xl font-bold text-sky-500">
                //         {formatVND(user?.value?.balance ?? 0)}
                //       </h2>
                //     </div>
                //     <div className="flex justify-between items-center">
                //       <span className="text-sm font-semibold">
                //         Mã Ví: <span className="text-base">•••• 4589</span>
                //       </span>
                //       <AdvancedColorfulBadges
                //         color="green"
                //         size="md"
                //         className="rounded-full"
                //       >
                //         Sẵn sàng
                //       </AdvancedColorfulBadges>
                //     </div>
                //   </div>

                //   <Separator />

                //   <div className="w-full space-y-4">
                //     <h4 className="font-semibold text-base flex items-center gap-1">
                //       <PlayIcon className="size-6" />
                //       Bắt Đầu
                //     </h4>

                //     <div className="grid gap-3">
                //       <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                //         <div className="bg-primary/10 p-2 rounded">
                //           <BarChart3 className="h-5 w-5 text-primary" />
                //         </div>
                //         <div className="flex-1">
                //           <h5 className="font-medium text-sm">Nạp Tiền</h5>
                //           <p className="text-sm font-semibold text-muted-foreground">
                //             Nạp tiền vào ví của bạn
                //           </p>
                //         </div>
                //         <ArrowRight className="h-4 w-4 text-muted-foreground" />
                //       </div>

                //       <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                //         <div className="bg-primary/10 p-2 rounded">
                //           <CreditCard className="h-5 w-5 text-primary" />
                //         </div>
                //         <div className="flex-1">
                //           <h5 className="font-medium text-sm">
                //             Liên Kết Phương Thức Thanh Toán
                //           </h5>
                //           <p className="text-xs text-muted-foreground">
                //             Kết nối ngân hàng hoặc thẻ của bạn
                //           </p>
                //         </div>
                //         <ArrowRight className="h-4 w-4 text-muted-foreground" />
                //       </div>

                //       <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                //         <div className="bg-primary/10 p-2 rounded">
                //           <Fingerprint className="h-5 w-5 text-primary" />
                //         </div>
                //         <div className="flex-1">
                //           <h5 className="font-medium text-sm">
                //             Bật Tính Năng Bảo Mật
                //           </h5>
                //           <p className="text-xs text-muted-foreground">
                //             Thiết lập bảo vệ bổ sung
                //           </p>
                //         </div>
                //         <ArrowRight className="h-4 w-4 text-muted-foreground" />
                //       </div>
                //     </div>
                //   </div>
                // </div>
              )}
            </div>

            <SheetFooter className="border-t pt-6 pb-8 px-6 mt-auto">
              {step === "create" && (
                <div className="space-y-3 w-full">
                  <Button
                    onClick={handleCreatePin}
                    disabled={pin?.length < 4 || !acceptTerms}
                    className="w-full h-12 text-base bg-sky-600 hover:bg-sky-500 hoverAnimate"
                  >
                    Tiếp tục
                  </Button>
                  <div className="flex justify-center">
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-700 w-full"
                      >
                        Hủy
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              )}

              {step === "confirm" && (
                <div className="space-y-3 w-full">
                  <Button
                    onClick={handleConfirmPin}
                    disabled={confirmPin?.length < 4}
                    className="w-full h-12 text-base bg-sky-600 hover:bg-sky-500 hoverAnimate"
                  >
                    Tạo Ví
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Quay lại
                    </Button>
                    <SheetClose asChild>
                      <Button variant="outline" className="flex-1 w-full">
                        Hủy
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className="space-y-3 w-full">
                  <Button
                    variant="default"
                    onClick={() => setOpen(false)}
                    className="w-full h-12 text-base"
                  >
                    Bắt Đầu Sử Dụng
                  </Button>
                  <div className="flex justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs flex items-center gap-1"
                        >
                          <HelpCircle className="h-3 w-3" />
                          Cần trợ giúp?
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Liên hệ đội hỗ trợ của chúng tôi
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};
