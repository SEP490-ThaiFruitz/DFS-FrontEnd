import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircleIcon, Clock, LockIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface BlockOTPProps {
  isLocked: boolean;
  setShowError: (show: boolean) => void;
  attempts: number;
  maxAttempts: number;
  timeLeft: number;
  progressValue: number;
}

const lockoutTime = 30; // thời gian chờ tính bằng giây

export const BlockOTP = ({
  // isLocked,
  setShowError,
  attempts,
  maxAttempts,
  // timeLeft,
  progressValue,
}: BlockOTPProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const [timeLeft, setTimeLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLocked, timeLeft]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-end">
          <button
            onClick={() => !isLocked && setShowError(false)}
            className={`text-gray-500 ${
              isLocked ? "opacity-50 cursor-not-allowed" : "hover:text-gray-700"
            }`}
            disabled={isLocked}
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mb-6">
          {isLocked ? (
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <LockIcon size={32} className="text-orange-500" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircleIcon size={32} className="text-red-500" />
            </div>
          )}

          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {isLocked ? "Tài khoản tạm thời bị khóa" : "Mã OTP không chính xác"}
          </h3>

          <p className="text-sm text-gray-500 text-center">
            {isLocked ? (
              <>
                Bạn đã nhập sai mã OTP quá nhiều lần. Vui lòng đợi trước khi thử
                lại.
                <div className="mt-4 w-full">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Thời gian còn lại</span>
                    <span className="font-medium">{formatTime(timeLeft)}</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              </>
            ) : (
              <>
                Mã OTP bạn vừa nhập không đúng. Vui lòng kiểm tra lại và thử
                lại.
                <span className="block mt-2 text-orange-500 font-medium">
                  Cảnh báo: Bạn còn {maxAttempts - attempts} lần thử. Tài khoản
                  sẽ bị tạm khóa sau {maxAttempts} lần thử sai.
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          {isLocked ? (
            <Button
              className="w-full bg-gray-200 text-gray-500 py-2 rounded-md cursor-not-allowed"
              disabled
            >
              <Clock size={16} className="mr-2" />
              Đang đợi {formatTime(timeLeft)}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setShowError(false)}
                variant="outline"
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md"
              >
                Thử lại
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                onClick={() => {
                  setShowError(false);
                  // Thêm logic để gửi lại OTP ở đây
                }}
              >
                Gửi lại mã
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
