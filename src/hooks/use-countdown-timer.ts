// "use client";

import { useState, useEffect } from "react";

type CountdownTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
};

/**
 * A hook that calculates the time remaining until a target date
 * @param targetDate The date to count down to (Date object or timestamp in milliseconds)
 * @returns An object containing days, hours, minutes, seconds, isExpired flag, and totalSeconds remaining
 */
export function useCountdownTimer(targetDate: Date | number): CountdownTime {
  const getTimeLeft = (): CountdownTime => {
    const now = new Date().getTime();
    const target =
      typeof targetDate === "number" ? targetDate : targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        totalSeconds: 0,
      };
    }

    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const totalSeconds = Math.floor(difference / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      totalSeconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(getTimeLeft());

  useEffect(() => {
    // Calculate immediately on mount or when targetDate changes
    setTimeLeft(getTimeLeft());

    // Don't set up interval if already expired
    if (timeLeft.isExpired) return undefined;

    const interval = setInterval(() => {
      const updatedTimeLeft = getTimeLeft();
      setTimeLeft(updatedTimeLeft);

      // Clear interval when countdown expires
      if (updatedTimeLeft.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup on unmount or when targetDate changes
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}
