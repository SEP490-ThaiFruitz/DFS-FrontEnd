"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CircleX, ImagePlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface FormImageControlProps<T extends FieldValues, K> {
    form: UseFormReturn<T>;
    name: Path<T>;
    placeholder?: string;
    onSubmit?: (data: T) => void;
    onChooseImage: (data: File[]) => void;
    label?: string;
    formSubmit?: React.ReactNode;
    classNameLabel?: string;
    disabled?: boolean;
    classNameInput?: string;
    // value?: string | PathValue<T, Path<T>> | undefined;
    value?: any;
    icon?: React.ReactElement;
    imageType: string,
    mutiple: boolean
}

export const FormImageControl = <T extends FieldValues, K>({
    form,
    name,
    placeholder,
    label,
    classNameLabel,
    disabled,
    classNameInput,
    value,
    icon,
    imageType,
    mutiple,
    onChooseImage
}: FormImageControlProps<T, K>) => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [files, setFiles] = useState<(string | ArrayBuffer | null)[]>([]);

    const handleFileChange = (e: any) => {
        const selectedFiles: File[] = e.target.files;
        if (selectedFiles) {
            const newFileNames: string[] = [];
            const newFiles: (string | ArrayBuffer | null)[] = [];
            Array.from(selectedFiles).forEach((file: File) => {
                newFileNames.push(file.name);
                const reader = new FileReader();
                reader.onloadend = () => {
                    newFiles.push(reader.result);
                    if (mutiple) {
                        setFileNames((prev) => [...prev, ...newFileNames]);
                        setFiles((prev) => [...prev, ...newFiles]);
                    } else {
                        setFileNames([...newFileNames]);
                        setFiles([...newFiles]);
                    }
                };
                reader.readAsDataURL(file);
            });
            onChooseImage(selectedFiles);
        }
    };

    const handleRemoveImage = (index: number) => {
        setFileNames((prev) => prev.filter((_, i) => i !== index));
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <FormField
            control={form.control}
            name={name}
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
                            <div>
                                <input
                                    id="file-input"
                                    className={cn("", classNameInput)}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    {...field}
                                    multiple={mutiple}
                                    type="file"
                                    accept={imageType}
                                    hidden
                                    onInput={(e) => handleFileChange(e)}
                                />
                                <label
                                    htmlFor="file-input"
                                    className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer p-4"
                                >
                                    <div className="flex items-center w-full gap-4">
                                        <ImagePlus size={30} />
                                        <span className="flex-1 font-light text-center">
                                            {fileNames.length > 0 ? fileNames.join(", ") : "Vui lòng chọn ảnh"}
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </FormControl>
                        <div className="pt-2 grid grid-cols-2 sm:grid-cols-3">
                            {files.map((file, index: number) =>
                                file ? (
                                    <div className="relative w-fit group cursor-pointer" key={index}>
                                        <Image src={file as string} alt="" height={100} width={100} />
                                        <CircleX
                                            className="absolute -top-3 -right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveImage(index)}
                                        />
                                    </div>
                                ) : null
                            )}
                        </div>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                );
            }}
        />
    );
};
