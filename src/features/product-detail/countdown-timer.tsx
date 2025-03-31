import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import type React from "react";
import { memo } from "react";

type CountdownTimerProps = {
  targetDate: Date;
  className?: string;
  onExpire?: () => void;
  renderExpired?: () => React.ReactNode;
};

export const CountdownTimer = memo(
  ({
    targetDate,
    className = "",
    onExpire,
    renderExpired,
  }: CountdownTimerProps) => {
    const { days, hours, minutes, seconds, isExpired } =
      useCountdownTimer(targetDate);

    const formatNumber = (num: number) => {
      return num < 10 ? `0${num}` : num;
    };

    if (isExpired && onExpire) {
      onExpire();
    }

    if (isExpired && renderExpired) {
      return renderExpired();
    }

    return (
      <div className={`grid grid-cols-4 gap-2 text-center ${className}`}>
        <div className="flex flex-col">
          <div className="rounded-xl bg-primary/10 p-3">
            <span className="text-2xl font-bold text-primary">
              {formatNumber(days)}
            </span>
          </div>
          <span className="mt-1 text-xs text-slate-800">Ngày</span>
        </div>

        <div className="flex flex-col">
          <div className="rounded-xl bg-primary/10 p-3">
            <span className="text-2xl font-bold text-primary">
              {formatNumber(hours)}
            </span>
          </div>
          <span className="mt-1 text-xs text-slate-800">Giờ</span>
        </div>

        <div className="flex flex-col">
          <div className="rounded-xl bg-primary/10 p-3">
            <span className="text-2xl font-bold text-primary">
              {formatNumber(minutes)}
            </span>
          </div>
          <span className="mt-1 text-xs text-slate-800">Phút</span>
        </div>

        <div className="flex flex-col">
          <div className="rounded-xl bg-primary/10 p-3">
            <span className="text-2xl font-bold text-primary">
              {formatNumber(seconds)}
            </span>
          </div>
          <span className="mt-1 text-xs text-slate-800">Giây</span>
        </div>
      </div>
    );
  }
);

CountdownTimer.displayName = "CountdownTimer";
