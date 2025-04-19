"use client";

import { CheckCircle2, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/format-currency";

interface ApprovalActionsProps {
  totalRefundAmount: number;
  onApproveClick: () => void;
}

export function ApprovalActions({
  totalRefundAmount,
  onApproveClick,
}: ApprovalActionsProps) {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader>
        <CardTitle className="text-base">Quyết định yêu cầu trả hàng</CardTitle>
        <CardDescription>
          Phê duyệt hoặc từ chối yêu cầu trả hàng này
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                <h3 className="font-medium">Phê duyệt trả hàng</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Phê duyệt yêu cầu trả hàng này sẽ bắt đầu quy trình hoàn tiền
                cho khách hàng. Tổng số tiền hoàn lại sẽ là{" "}
                {formatVND(totalRefundAmount)}.
              </p>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={onApproveClick}
              >
                Phê duyệt trả hàng
              </Button>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center mb-4">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="font-medium">Từ chối trả hàng</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Từ chối yêu cầu trả hàng này sẽ thông báo cho khách hàng rằng
                yêu cầu của họ đã bị từ chối. Vui lòng cung cấp lý do trong phần
                ghi chú của quản trị viên.
              </p>
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Từ chối trả hàng
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
