"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { format, isAfter, isBefore, isSameDay } from "date-fns"
import { vi } from "date-fns/locale/vi";

interface FormDateControlProps<T extends FieldValues, K> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    classNameLabel?: string;
    disabled?: boolean;
    classNameInput?: string;
    classNameForm?: string,
    value?: any;
    defaultValue?: any,
    icon?: React.ReactElement;
    require?: boolean,
    placeholder?: string,
    minDate?: Date,
    maxDate?: Date,
    disabledDates?: Date[];
    mode?: "single" | "multiple" | "range" | "default"
}

export const FormDateControl = <T extends FieldValues, K>({
    form,
    name,
    label,
    classNameLabel,
    disabled,
    classNameInput,
    classNameForm,
    value,
    icon,
    mode = "single",
    defaultValue,
    require,
    placeholder,
    minDate,
    maxDate,
    disabledDates = []
}: FormDateControlProps<T, K>) => {

    return (
        <FormField
            control={form.control}
            name={name}
            defaultValue={defaultValue ?? undefined}
            render={({ field, fieldState }) => {
                if (value !== undefined && value !== null && field.value !== value) {
                    form.setValue(name, value);
                }

                return (
                    <FormItem className={classNameForm}>
                        <FormLabel className={cn("text-text-foreground", require ? "after:content-['*'] after:text-red-500 after:ml-1" : "", classNameLabel)}>
                            {icon}
                            {label}
                        </FormLabel>
                        <FormControl>
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            disabled={disabled}
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground",
                                                classNameInput
                                            )}
                                        >
                                            <CalendarIcon />
                                            {field.value ? format(field.value, "PPP", { locale: vi }) : <span>{placeholder ?? "Chọn ngày"}</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode={mode}
                                            {...field}
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            locale={vi}
                                            disabled={(date) =>
                                                (minDate && isBefore(date, minDate)) ||
                                                (maxDate && isAfter(date, maxDate)) ||
                                                disabledDates.some((d) => isSameDay(d, date))
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                );
            }}
        />
    );
};
