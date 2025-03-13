"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface FormSwitchControlProps<T extends FieldValues, K> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    classNameLabel?: string;
    disabled?: boolean;
    classNameInput?: string;
    classNameForm: string,
    value?: any;
    defaultValue?: any,
    icon?: React.ReactElement;
    require?: boolean
}

export const FormSwitchControl = <T extends FieldValues, K>({
    form,
    name,
    label,
    classNameLabel,
    disabled,
    classNameInput,
    classNameForm,
    value,
    icon,
    defaultValue,
    require
}: FormSwitchControlProps<T, K>) => {

    return (
        <FormField
            control={form.control}
            name={name}
            defaultValue={defaultValue ?? ""}
            render={({ field, fieldState }) => {
                if (value !== undefined && value !== null && field.value !== value) {
                    form.setValue(name, value);
                }

                return (
                    <FormItem className={classNameForm}>
                        <FormLabel className={cn("text-text-foreground", require ? "after:content-['(*)'] after:text-red-500 after:ml-1" : "", classNameLabel)}>
                            {icon}
                            {label}
                        </FormLabel>
                        <FormControl>
                            <Switch
                                disabled={disabled}
                                className={cn(`${field.value ? "!bg-green-500" : "!bg-red-500"}`, classNameInput)}
                                checked={field.value ?? false}
                                {...field}
                                onCheckedChange={(checked) => field.onChange(checked)}
                            />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                );
            }}
        />
    );
};
