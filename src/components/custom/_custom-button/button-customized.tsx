import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JSX } from "react";

interface ButtonCustomizedProps {
  label: string | JSX.Element;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "secondary"
    | "link";
}
export const ButtonCustomized = ({
  label,
  variant = "default",
  onClick,
  className,
  type = "button",
}: ButtonCustomizedProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white duration-200 hover:bg-neutral-700 focus:ring-2 focus:ring-black focus:ring-offset-2",
        className
      )}
      type={type}
    >
      {label}
    </Button>
  );
};
