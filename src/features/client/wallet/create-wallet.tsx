import { PrivacyPolicy } from "@/components/global-components/footer/policy/privacy-policy";
import { ServicePolicy } from "@/components/global-components/footer/policy/service-policy";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { CreditCard, Fingerprint, ShieldCheck } from "lucide-react";
import { memo } from "react";

interface CreateWalletProps {
  pin: string;
  setPin: React.Dispatch<React.SetStateAction<string>>;
  pinStrength: "weak" | "medium" | "strong" | "";
  rememberDevice: boolean;
  setRememberDevice: React.Dispatch<React.SetStateAction<boolean>>;
  acceptTerms: boolean;
  setAcceptTerms: React.Dispatch<React.SetStateAction<boolean>>;
}
export const CreateWallet = memo(
  ({
    pin,
    setPin,
    pinStrength,
    rememberDevice,
    setRememberDevice,
    acceptTerms,
    setAcceptTerms,
  }: CreateWalletProps) => {
    const getPinStrengthColor = () => {
      switch (pinStrength) {
        case "weak":
          return "text-red-500";
        case "medium":
          return "text-amber-500";
        case "strong":
          return "text-green-500";
        default:
          return "text-slate-700";
      }
    };

    const getPinStrengthLabel = () => {
      switch (pinStrength) {
        case "weak":
          return "Yếu";
        case "medium":
          return "Trung bình";
        case "strong":
          return "Mạnh";
        default:
          return "";
      }
    };
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="pin"
            className="text-base font-medium flex items-center justify-between"
          >
            <span>Tạo Mã PIN</span>
            {pinStrength && (
              <Badge
                variant="outline"
                className={`${getPinStrengthColor()} text-xs`}
              >
                PIN {getPinStrengthLabel()}
              </Badge>
            )}
          </Label>

          {/* OTP Style PIN Input using shadcn/ui InputOTP */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={pin}
              onChange={setPin}
              pattern="^[0-9]+$"
              inputMode="numeric"
              containerClassName="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
                <InputOTPSlot
                  index={1}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
                <InputOTPSlot
                  index={2}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
                <InputOTPSlot
                  index={4}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
                <InputOTPSlot
                  index={5}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* PIN Strength Indicator */}
          {pin.length > 0 && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    pinStrength === "weak"
                      ? "w-1/3 bg-red-500"
                      : pinStrength === "medium"
                      ? "w-2/3 bg-amber-500"
                      : pinStrength === "strong"
                      ? "w-full bg-green-500"
                      : "w-0"
                  }`}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-700 mt-2">
            <ShieldCheck className="h-4 w-4 text-slate-700" />
            <p>
              Mã PIN của bạn phải có 4-6 chữ số và sẽ được sử dụng để bảo mật ví
              của bạn.
            </p>
          </div>
        </div>

        {/* <div className="bg-muted/30 rounded-lg p-4 space-y-3 border">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-primary" />
              Tính Năng Bảo Mật
            </h4>
            <Badge variant="outline" className="text-xs">
              Cao cấp
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background rounded p-3 border flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded">
                  <Fingerprint className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium">
                  Xác thực sinh trắc học
                </span>
              </div>
              <p className="text-[10px] text-slate-700">Mở khóa bằng vân tay</p>
            </div>
            <div className="bg-background rounded p-3 border flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium">Bảo vệ 2FA</span>
              </div>
              <p className="text-[10px] text-slate-700">Lớp bảo mật bổ sung</p>
            </div>
          </div>
        </div> */}

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="remember"
              checked={rememberDevice}
              onCheckedChange={(checked) =>
                setRememberDevice(checked as boolean)
              }
              className="rounded-md"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="remember"
                className="text-sm font-medium cursor-progress leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ghi nhớ thiết bị này
              </label>
              <p className="text-xs text-slate-700">
                Bỏ qua xác minh PIN trong 30 ngày trên thiết bị này.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              required
              className="rounded-md"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-progress "
              >
                Tôi chấp nhận điều khoản và điều kiện
              </label>
              <div className="text-xs text-slate-700 flex items-center gap-1">
                Bằng cách tạo ví, bạn đồng ý với <ServicePolicy /> và{" "}
                <PrivacyPolicy />.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CreateWallet.displayName = "CreateWallet";
