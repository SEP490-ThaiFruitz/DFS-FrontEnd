import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatVND } from "@/lib/format-currency";
import { Clock, DollarSign, ShoppingBag } from "lucide-react";

interface SummaryCardsProps {
  totalItems: number;
  totalValue: number;
}

export default function SummaryCards({
  totalItems,
  totalValue,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
        <CardHeader className="pb-2">
          <CardDescription>Tổng số yêu cầu</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {totalItems}
            <ShoppingBag className="h-5 w-5 ml-2 text-slate-400" />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
        <CardHeader className="pb-2">
          <CardDescription>Tổng giá trị</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {formatVND(totalValue)}
            <DollarSign className="h-5 w-5 ml-2 text-emerald-500" />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
        <CardHeader className="pb-2">
          <CardDescription>Trạng thái</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            Đang xử lý
            <Clock className="h-5 w-5 ml-2 text-amber-500" />
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
