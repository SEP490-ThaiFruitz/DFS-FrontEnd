import { Annoyed, LucideIcon } from "lucide-react";
import { EmptyState } from "./empty-state";

interface NotDataProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };

  className?: string;
  icons?: LucideIcon[];
}

export const NotData = ({
  action,
  className,
  icons = [],
  title = "Không có dữ liệu",
  description = "Vui lòng kiểm tra lại sau",
}: NotDataProps) => {
  return (
    <EmptyState
      icons={icons.length > 0 ? icons : [Annoyed]}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
};
