import { LucideProps } from "lucide-react";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

interface WaitingSpinnerProps {
  label: string;

  classNameLabel?: string;
}

export type SpinnerProps = LucideProps & {
  variant?:
    | "default"
    | "circle"
    | "pinwheel"
    | "circle-filled"
    | "ellipsis"
    | "ring"
    | "bars"
    | "infinite";
} & WaitingSpinnerProps;
export const WaitingSpinner = ({
  variant,
  label,
  classNameLabel,
  ...props
}: SpinnerProps) => {
  return (
    <div className="flex items-center gap-x-1">
      <Spinner variant={variant} {...props} />
      <span className={cn("", classNameLabel)}>{label}</span>
    </div>
  );
};
