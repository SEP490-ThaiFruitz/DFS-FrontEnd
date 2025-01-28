"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { InputPassword } from "./input-password";

interface FormItemsControlProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit?: (data: T) => void;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  formSubmit?: React.ReactNode;
  type?: string;
  classNameLabel?: string;
  disabled?: boolean;
}

type User = {
  email: string;

  address: User1;
};

type User1 = {
  street: string;
};

export const FormPassword = <T extends FieldValues>({
  form,
  name,
  placeholder,
  label,
  type,
  classNameLabel,
  disabled,
}: FormItemsControlProps<T>) => {
  const [typeInput, setTypeInput] = useState<string>("password");

  const onToggleType = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setTypeInput((prev: string): "text" | "password" =>
      prev === "text" ? "password" : "text"
    );
  };

  const formError = form.formState.errors[""];

  const getErrorMessage = (error: unknown): string | undefined => {
    if (typeof error === "object" && error !== null && "message" in error) {
      return (error as { message?: string }).message;
    }
    return undefined;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const errorMessage =
          getErrorMessage(fieldState.error) || getErrorMessage(formError);
        return (
          <FormItem>
            <FormLabel className={cn("text-moi_moc_green", classNameLabel)}>
              {label}
            </FormLabel>
            <FormControl>
              <InputPassword
                id={name}
                typeInputPassword={typeInput}
                onToggle={onToggleType}
                field={field}
                disabled={disabled}
                className="h-10"
                placeholder={placeholder}
              />
            </FormControl>
            <FormMessage>{errorMessage}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};
