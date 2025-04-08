import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { AlertCircle, Info } from "lucide-react";
import { memo } from "react";

interface ConfirmWalletProps {
  confirmPin: string;
  setConfirmPin: React.Dispatch<React.SetStateAction<string>>;
}

export const ConfirmWallet = memo(
  ({ confirmPin, setConfirmPin }: ConfirmWalletProps) => {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="confirm-pin" className="text-base font-medium">
            Xác Nhận Mã PIN
          </Label>

          {/* OTP Style Confirm PIN Input using shadcn/ui InputOTP */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={confirmPin}
              onChange={setConfirmPin}
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

          <div className="flex items-center gap-2 text-xs text-amber-600 mt-2">
            <AlertCircle className="h-4 w-4" />
            <p>Vui lòng nhập lại cùng mã PIN để xác nhận.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-amber-800">
                Quan trọng
              </h4>
              <p className="text-xs text-amber-700">
                Vui lòng ghi nhớ mã PIN của bạn. Nếu bạn quên, bạn sẽ cần thực
                hiện quy trình khôi phục để lấy lại quyền truy cập vào ví của
                mình.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConfirmWallet.displayName = "ConfirmWallet";
