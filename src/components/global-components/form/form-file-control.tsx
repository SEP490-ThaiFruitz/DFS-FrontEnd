"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { File, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { type DragEvent, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface FileWithPreview extends File {
  preview: string;
}

interface FormFileControlProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  classNameLabel?: string;
  disabled?: boolean;
  classNameInput?: string;
  value?: any;
  icon?: React.ReactElement;
  type: string;
  mutiple: boolean;
  require?: boolean,
  maxFile?: number
}

export const FormFileControl = <T extends FieldValues>({
  form,
  name,
  label,
  classNameLabel,
  disabled,
  classNameInput,
  value,
  icon,
  type,
  mutiple,
  require,
  maxFile,
}: FormFileControlProps<T>) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formValue = form.watch(name);

  useEffect(() => {
    if (formValue === undefined) {
      setFiles([])
    }
  }, [formValue])

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList: File[]) => {
    form.clearErrors(name);
    if (!mutiple && fileList?.length > 1 || (maxFile && fileList?.length > maxFile)) {
      const errorMessage = maxFile && fileList?.length > maxFile
        ? `Vui lòng chọn tối đa ${maxFile}`
        : 'Vui lòng chọn 1 files';
      form.setError(name, {
        message: errorMessage,
      });
      return;
    }
    const newFiles = fileList.reduce<FileWithPreview[]>((acc, file) => {
      if (!type.includes(file.type)) {
        form.setError(name, { message: `Vui lòng chọn file ${type}` });
        return acc;
      }
      acc.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
      return acc;
    }, []);
    const updatedFiles = mutiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    form.setValue(name as Path<T>, updatedFiles as PathValue<T, Path<T>>);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteFile = (fileToDelete: FileWithPreview) => {
    const newFiles: FileWithPreview[] = files.filter(
      (file) => file !== fileToDelete
    );
    setFiles(newFiles);
    if (newFiles.length == 0)
      form.setValue(name as Path<T>, undefined as PathValue<T, Path<T>>);

    URL.revokeObjectURL(fileToDelete.preview);
  };
  return (
    <FormField
      control={form.control}
      name={name}
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
              <div className={classNameInput}>
                <motion.div
                  className={`relative size-full cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${isDragActive
                    ? "border-blue-500 bg-blue-500/5"
                    : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
                    }`}
                  onClick={handleButtonClick}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    accept={type}
                    className="hidden"
                    multiple={mutiple}
                    disabled={disabled}
                    name={field.name}
                    onChange={handleFileInputChange}
                    ref={fileInputRef}
                    type="file"
                  />
                  <AnimatePresence>
                    {isDragActive ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className=" pointer-events-none select-none"
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Upload className="pointer-events-none mx-auto size-8 select-none text-blue-500" />
                        <p className="pointer-events-none mt-2 select-none text-blue-500 text-sm">
                          Thả file ở đây..
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        initial={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Upload className="mx-auto size-8 text-neutral-400 dark:text-neutral-500" />
                        <p className="mt-2 text-balance font-medium text-neutral-400 text-sm tracking-tighter dark:text-neutral-500">
                          Kéo và thả các tập tin ở đây hoặc nhấp để chọn
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 space-y-2"
                      exit={{ opacity: 0, height: 0 }}
                      initial={{ opacity: 0, height: 0 }}
                    >
                      {files.map((file) => (
                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center rounded-lg bg-neutral-400/10 p-1"
                          exit={{ opacity: 0, x: 20 }}
                          initial={{ opacity: 0, x: -20 }}
                          key={file.name}
                        >
                          {file.type.startsWith("image/") ? (
                            <Image
                              alt={file.name}
                              className="mr-2 size-10 rounded object-cover"
                              height={1000}
                              width={1000}
                              src={file.preview}
                            />
                          ) : (
                            <File className="mr-2 size-10 text-neutral-500" />
                          )}
                          <span className="flex-1 truncate text-neutral-600 text-xs tracking-tighter dark:text-neutral-400">
                            {file.name}
                          </span>
                          <div className="flex gap-3 items-center">
                            <span className="font-medium text-sm">
                              {file.size < 1024 * 1024
                                ? `${(file.size / 1024).toFixed(2)} KB`
                                : `${(file.size / (1024 * 1024)).toFixed(
                                  2
                                )} MB`}
                            </span>
                            <Trash2
                              className="mr-2 size-5 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(file);
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};
