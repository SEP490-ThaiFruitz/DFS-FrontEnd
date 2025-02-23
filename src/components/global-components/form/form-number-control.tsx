"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatVND } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { KeyboardCode } from "@dnd-kit/core";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface FormNumberInputControlProps<T extends FieldValues, K> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  classNameLabel?: string;
  disabled?: boolean;
  classNameInput?: string;
  value?: any;
  isMoney?: boolean;
  defaultValue?: any;
  icon?: React.ReactElement;
}

export const FormNumberInputControl = <T extends FieldValues, K>({
  form,
  name,
  label,
  classNameLabel,
  disabled,
  classNameInput,
  value,
  icon,
  isMoney,
  defaultValue,
}: FormNumberInputControlProps<T, K>) => {
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
                disabled={disabled}
                {...field}
                type={"text"}
                value={isMoney ? formatVND(field.value) : formatVND(field.value).replace("₫", "")}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    const newValue = field.value.slice(0, -1);
                    field.onChange(newValue);
                  }
                }}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/\D/g, "");
                  field.onChange(cleanValue);
                }}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>  
          </FormItem>
        );
      }}
    />
  );
};
