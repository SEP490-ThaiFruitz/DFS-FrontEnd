"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface FormTextareaControlProps<T extends FieldValues, K> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  onSubmit?: (data: T) => void;
  label?: string;
  formSubmit?: React.ReactNode;
  classNameLabel?: string;
  disabled?: boolean;
  classNameInput?: string;
  // value?: string | PathValue<T, Path<T>> | undefined;
  value?: any;
  defaultValue?: any,
  icon?: React.ReactElement;
  row?: number,
  require?: boolean
}

export const FormTextareaControl = <T extends FieldValues, K>({
  form,
  name,
  placeholder,
  label,
  classNameLabel,
  disabled,
  classNameInput,
  value,
  icon,
  row,
  defaultValue,
  require
}: FormTextareaControlProps<T, K>) => {
  // console.log({ value });
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
            <FormLabel className={cn("text-text-foreground", require ? "after:content-['(*)'] after:text-red-500 after:ml-1" : "", classNameLabel)}>
              {icon}
              {label}
            </FormLabel>
            <FormControl>
              <Textarea
                className={cn("", classNameInput)}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                rows={row}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};
