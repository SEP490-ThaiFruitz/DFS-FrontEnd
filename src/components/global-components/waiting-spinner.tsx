import { LucideProps } from "lucide-react";
import { Spinner } from "./spinner";

interface WaitingSpinnerProps {
  label: string;
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
export const WaitingSpinner = ({ variant, label, ...props }: SpinnerProps) => {
  return (
    <div className="flex items-center gap-x-1">
      <Spinner variant={variant} {...props} />
      <span>{label}</span>
    </div>
  );
};
