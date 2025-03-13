"use client"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import JoditEditor from 'jodit-react';


interface FormTextEditorControlProps<T extends FieldValues, K> {
    form: UseFormReturn<T>;
    name: Path<T>;
    placeholder?: string;
    label?: string;
    classNameLabel?: string;
    disabled?: boolean;
    value?: any;
    defaultValue?: any,
    icon?: React.ReactElement;
    require?: boolean,
    height?: number
}
export const FormTextEditorControl = <T extends FieldValues, K>({
    form,
    name,
    placeholder,
    label,
    classNameLabel,
    disabled,
    value,
    icon,
    defaultValue,
    require,
    height
}: FormTextEditorControlProps<T, K>) => {
    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder ?? 'Nhập nội dung...',
            height: height ?? 400,
            disabled: disabled ?? false
        }),
        [placeholder, height, disabled]
    );
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
                    <FormItem>
                        <FormLabel className={cn("text-text-foreground", require ? "after:content-['(*)'] after:text-red-500 after:ml-1" : "", classNameLabel)}>
                            {icon}
                            {label}
                        </FormLabel>
                        <FormControl>
                            <JoditEditor
                                {...field}
                                config={config}
                                value={defaultValue ?? ""}
                            />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                );
            }}
        />
    );
};

export default FormTextEditorControl
