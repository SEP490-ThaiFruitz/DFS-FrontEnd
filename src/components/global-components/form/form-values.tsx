"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  UseFormReturn,
  FieldValues,
  Path,
  UseFormWatch,
} from "react-hook-form";
import { ZodType } from "zod";
import { cn } from "@/lib/utils";

interface FormValuesProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  classNameForm?: string;
  name?: Path<T>;
  placeholder?: string;
  label?: string;
  formSubmit?: React.ReactNode;
  formItems?: React.ReactNode;
}

export const FormValues = <T extends FieldValues>({
  form,
  onSubmit,
  name,
  placeholder,
  label,
  formSubmit,
  formItems,
  children,
  classNameForm,
}: FormValuesProps<T>) => {
  const onSubmitError = (errors: any) => {
    console.log("Form Errors: ", errors); // This will log validation errors, if any
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
        className={cn("space-y-5", classNameForm)}
      >
        {children}
      </form>
    </Form>
  );
};