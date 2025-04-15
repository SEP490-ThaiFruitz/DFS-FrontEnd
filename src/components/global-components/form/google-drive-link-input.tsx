"use client";

import type React from "react";

import { memo, useState } from "react";
import { Check, ExternalLink, FileIcon as FileGoogle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GoogleDriveLinkInputProps {
  setLinkGoogleDrive?: React.Dispatch<React.SetStateAction<string>>;

  linkGoogleDrive?: string;

  label?: string;
}
export const GoogleDriveLinkInput = memo(
  ({
    linkGoogleDrive,
    setLinkGoogleDrive,
    label = `Nếu có link google drive hoặc link ảnh sản phẩm, vui lòng gửi
                kèm theo để chúng tôi có thể hỗ trợ bạn tốt hơn.`,
  }: GoogleDriveLinkInputProps) => {
    const [open, setOpen] = useState(false);
    const [link, setLink] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidGoogleDriveLink(link)) {
        setSubmitted(true);
        // Here you would typically send the link to your backend
        setTimeout(() => {
          setOpen(false);
          // Reset after some time if needed
          setTimeout(() => setSubmitted(false), 500);
        }, 1500);
      }
    };

    const isValidGoogleDriveLink = (url: string) => {
      return (
        url.trim() !== "" &&
        (url.includes("drive.google.com") || url.includes("docs.google.com"))
      );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      console.log(value);

      setLink(value);
      setSubmitted(false); // Reset submitted state when user types
      setLinkGoogleDrive?.(value); // Update the parent component's state

      // if (!isValidGoogleDriveLink(value)) {
      // }

      // toast.info("Link Google Drive không hợp lệ. Vui lòng nhập lại.");
    };

    return (
      <div className="flex items-start space-x-2 max-w-md">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="link"
              className="h-auto p-0 underline text-sm font-semibold text-slate-500 hover:text-slate-700 w-full"
            >
              {!link ? (
                <span className="w-full text-wrap">{label}</span>
              ) : (
                <span className="w-full text-sky-500 text-wrap">
                  Đã liên kết link
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileGoogle className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-sm">Thêm link Google Drive</h4>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={link}
                    onChange={handleChange}
                    className={cn(
                      "w-full",
                      !isValidGoogleDriveLink(link) &&
                        link !== "" &&
                        "border-rose-500"
                    )}
                  />
                  {!isValidGoogleDriveLink(link) && link !== "" && (
                    <p className="text-xs text-rose-500">
                      Vui lòng nhập link Google Drive hợp lệ
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!isValidGoogleDriveLink(link) || submitted}
                    className="relative"
                  >
                    {submitted ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Đã lưu
                      </>
                    ) : (
                      <>Xác nhận</>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t">
                <p className="flex items-center">
                  <ExternalLink className="h-3 w-3 mr-1 inline" />
                  Link sẽ được gửi đến đội ngũ hỗ trợ của chúng tôi
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

GoogleDriveLinkInput.displayName = "GoogleDriveLinkInput";
