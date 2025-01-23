import { JSX } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { LucideIcon } from "lucide-react";

interface DialogReusedProps {
  title: string;
  description: string;
  trigger: React.ReactNode | string | number | JSX.Element;

  icon?: LucideIcon | React.ReactNode;
}

export const DialogReused = ({
  title,
  description,
  trigger,
}: DialogReusedProps) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>{title}</DialogHeader>
          <DialogDescription>
            <p>
              This is a reusable dialog component. It can be used to display
              important messages to the user.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div>
          <button className="btn btn-primary">Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
