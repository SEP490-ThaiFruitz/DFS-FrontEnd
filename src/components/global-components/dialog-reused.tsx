"use client";

import { JSX, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { LucideIcon } from "lucide-react";

interface DialogReusedProps {
  title: string | JSX.Element;
  description: string | JSX.Element;
  trigger: React.ReactNode | string | number | JSX.Element;

  content: string | JSX.Element;

  icon?: LucideIcon | React.ReactNode;

  open?: boolean;
}

export const DialogReused = ({
  title,
  description,
  trigger,
  content,
  open = false,
}: DialogReusedProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(open);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
};
