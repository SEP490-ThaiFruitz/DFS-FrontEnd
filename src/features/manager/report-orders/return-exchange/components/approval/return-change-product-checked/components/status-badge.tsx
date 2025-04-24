import { Badge } from "@/components/ui/badge";
import { RefreshCw, RotateCcw } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Return":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Exchange":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Return":
        return <RotateCcw className="size-5" />;
      case "Exchange":
        return <RefreshCw className="size-5" />;
      default:
        return null;
    }
  };

  return (
    <Badge
      className={`${getStatusColor(
        status
      )} flex items-center gap-1 px-2 py-1 text-xs font-semibold`}
    >
      {getStatusIcon(status)}
      {status === "Return" ? "Trả hàng" : "Đổi hàng"}
    </Badge>
  );
}
