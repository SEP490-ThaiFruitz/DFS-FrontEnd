import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { JSX } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface FormRadioControlProps<T extends FieldValues, K> {
  form: UseFormReturn<T>;

  name: Path<T>;
  label: string;

  disabled?: boolean;

  children: React.ReactNode | JSX.Element;
  className?: string;

  classNameLabel?: string;
}

export const FormRadioControl = <T extends FieldValues, K>({
  form,
  name,
  label,
  disabled,
  children,
  className,
  classNameLabel,
}: FormRadioControlProps<T, K>) => {
  return (
    <FormField
      name={name}
      control={form.control}
      // shouldUnregister

      disabled={disabled}
      render={({ field, fieldState, formState }) => {
        return (
          <FormItem>
            <FormLabel className={cn(classNameLabel)}>{label}</FormLabel>
            <FormControl>
              <RadioGroup
                disabled={formState.isSubmitting || disabled}
                onValueChange={field.onChange}
                defaultValue={field.value}
                className={cn("", className)}
              >
                {children}
              </RadioGroup>
            </FormControl>

            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};

interface RadioGroupItemProps {
  label?: string;
  value?: string | number | boolean | null;

  className?: string;
  disabled?: boolean;
  checked?: boolean;

  children?: React.ReactNode;

  onClick?: () => void;
}
export const RadioItem = ({
  label,
  value,
  className,
  disabled,
  checked,

  children,

  onClick,
}: RadioGroupItemProps) => {
  const castValue = value as string;

  return (
    <FormItem
      className={cn("flex items-center space-x-3 space-y-0", className)}
      onClick={onClick}
    >
      {children ? (
        <>{children}</>
      ) : (
        <>
          <FormControl>
            <RadioGroupItem disabled={disabled} value={castValue} />
          </FormControl>

          <FormLabel aria-disabled={disabled} className="font-normal">
            {label}
          </FormLabel>
        </>
      )}
    </FormItem>
  );
};
