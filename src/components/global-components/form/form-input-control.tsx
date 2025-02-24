"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface FormInputControlProps<T extends FieldValues, K> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  onSubmit?: (data: T) => void;
  label?: string;
  formSubmit?: React.ReactNode;
  type?: string;
  classNameLabel?: string;
  disabled?: boolean;
  classNameInput?: string;
  // value?: string | PathValue<T, Path<T>> | undefined;
  value?: any;
  defaultValue?: any,
  icon?: React.ReactElement;
  isMinDate?: boolean;
}

export const FormInputControl = <T extends FieldValues, K>({
  form,
  name,
  placeholder,
  label,
  type = "text",
  classNameLabel,
  disabled,
  classNameInput,
  value,
  icon,
  defaultValue,
  isMinDate,
}: FormInputControlProps<T, K>) => {

  return (
    <FormField
      control={form.control}
      name={name}
      defaultValue={defaultValue ?? ""}
      render={({ field, fieldState, formState }) => {
        if (value !== undefined && value !== null && field.value !== value) {
          form.setValue(name, value);
        }
        return (
          <FormItem>
            <FormLabel className={cn("text-text-foreground", classNameLabel)}>
              {icon}
              {label}
            </FormLabel>
            <FormControl>
              <Input
                className={cn("", classNameInput)}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                type={type}
                min={isMinDate ? new Date().toISOString().split('T')[0] : undefined}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};
