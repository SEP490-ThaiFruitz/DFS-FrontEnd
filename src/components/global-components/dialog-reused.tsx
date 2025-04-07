"use client";

import { JSX, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogReusedProps {
  title: string | JSX.Element;
  description?: string | JSX.Element;
  trigger?: React.ReactNode | string | number | JSX.Element;

  content: string | JSX.Element;

  icon?: LucideIcon | React.ReactNode;

  open?: boolean;

  className?: string;
  onClose?: (state: boolean) => void;

  asChild?: boolean;
  hiddenClose?: boolean,
}

export const DialogReused = ({
  title,
  description,
  trigger,
  content,
  open = false,
  asChild,
  onClose,
  className,
  hiddenClose
}: DialogReusedProps) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* <DialogTrigger asChild={asChild}>{trigger}</DialogTrigger> */}
      {trigger}
      <DialogContent hidden={hiddenClose} className={cn("", className)}>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
};
