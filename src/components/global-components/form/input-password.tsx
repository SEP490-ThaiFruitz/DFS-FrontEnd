import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

interface InputPasswordProps {
  typeInputPassword: string;
  id: string;
  placeholder?: string;
  defaultValue?: string;
  iconClassName?: string;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
  onToggle?: (e: React.MouseEvent<SVGElement>) => void;
  field?: ControllerRenderProps<any, any>;
  disabled?: boolean;
}

export const InputPassword = ({
  typeInputPassword,
  id,
  placeholder,
  defaultValue,
  iconClassName,
  required,
  field,
  disabled,
  className,

  ref,
  onToggle,
}: InputPasswordProps) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4",
          iconClassName
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {typeInputPassword === "password" ? (
          <EyeOff
            className="size-6 cursor-pointer"
            onClick={(e: React.MouseEvent<SVGElement>) => onToggle?.(e)}
          />
        ) : (
          <Eye
            className="size-6 cursor-pointer"
            onClick={(e: React.MouseEvent<SVGElement>) => onToggle?.(e)}
          />
        )}
      </div>
      <Input
        ref={ref}
        type={typeInputPassword}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        {...field}
        id={id}
        name={id}
        defaultValue={defaultValue}
        className={cn("h-7 w-full py-1 text-sm", className)}
        aria-describedby={`${id}-error`}
      />
    </div>
  );
};
