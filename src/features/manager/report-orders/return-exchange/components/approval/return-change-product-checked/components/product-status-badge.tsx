import { Badge } from "@/components/ui/badge";

interface ProductStatusBadgeProps {
  status: string;
}

export default function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  if (status.includes("mùi lạ") || status.includes("bất thường")) {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200"
      >
        Vấn đề chất lượng
      </Badge>
    );
  } else if (status.includes("dùng thử")) {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200"
      >
        Đã dùng thử
      </Badge>
    );
  } else if (status.includes("mở bao bì")) {
    return (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-200"
      >
        Đã mở bao bì
      </Badge>
    );
  } else {
    return <Badge variant="outline">Khác</Badge>;
  }
}
