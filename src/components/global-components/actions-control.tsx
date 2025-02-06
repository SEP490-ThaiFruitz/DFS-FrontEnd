import { JSX } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

interface ActionControlProps<T = any> {
  children: React.ReactNode;
  className?: string;

  label: string;

  trigger: React.ReactNode | string | number | JSX.Element;

  props?: T;

  asChild?: boolean;
}

export const ActionControl = ({
  children,
  className,
  label,
  trigger = <EllipsisVertical size={6} />,
  asChild,
  ...props
}: ActionControlProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={asChild}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {children}
        {/* <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
