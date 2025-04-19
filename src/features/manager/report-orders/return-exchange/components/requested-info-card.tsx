import {
  Calendar,
  FileText,
  Package,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { vietnameseDate } from "@/utils/date";
import { OrderReturnData } from "@/types/order-detail.types";
import { LinkPreview } from "@/components/global-components/link-preview";

interface RequestInfoCardProps {
  requestData: Pick<
    OrderReturnData,
    | "requestDate"
    | "processedDate"
    | "reason"
    | "reasonReject"
    | "reasonCancel"
    | "note"
    | "linkDocument"
    | "shippingFeeResponsibility"
  >;
}

export function RequestInfoCard({ requestData }: RequestInfoCardProps) {
  const {
    requestDate,
    processedDate,
    reason,
    reasonReject,
    reasonCancel,
    note,
    linkDocument,
    shippingFeeResponsibility,
  } = requestData;

  return (
    <>
      <Card className="overflow-hidden shadow-sm cardStyle">
        <CardContent className="p-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div>
              <span className="text-base text-slate-700 font-semibold">
                Ngày yêu cầu
              </span>
              <p className="font-semibold flex items-center gap-1.5">
                <Calendar className="size-8 text-emerald-600" />
                {vietnameseDate(requestDate, true)}
              </p>
            </div>

            {processedDate && (
              <div>
                <p className="text-sm text-slate-700 font-semibold">
                  Ngày xử lý
                </p>
                <p className="font-medium flex items-center gap-1.5">
                  <Calendar className="size-8 text-emerald-600" />
                  {vietnameseDate(processedDate)}
                </p>
              </div>
            )}

            {shippingFeeResponsibility && (
              <div>
                <p className="text-sm text-slate-700 font-semibold">
                  Trách nhiệm phí vận chuyển
                </p>
                <p className="font-medium flex items-center gap-1.5">
                  <Package className="size-8 text-emerald-600" />
                  {shippingFeeResponsibility}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Lý do</p>
              <p className="font-semibold flex items-start gap-1.5 text-violet-600 text-wrap">
                <FileText className="size-8 text-emerald-600 mt-0.5" />
                {reason || "Không có"}
              </p>
            </div>

            {reasonReject && (
              <div>
                <p className="text-sm text-muted-foreground">Lý do từ chối</p>
                <p className="font-medium flex items-start gap-1.5">
                  <FileText className="size-8 text-red-600 mt-0.5" />
                  {reasonReject}
                </p>
              </div>
            )}

            {reasonCancel && (
              <div>
                <p className="text-sm text-slate-700 font-semibold">
                  Lý do hủy
                </p>
                <p className="font-medium flex items-start gap-1.5">
                  <FileText className="size-8 text-slate-600 mt-0.5" />
                  {reasonCancel}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {(note || linkDocument) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {note && (
            <Card className="border-slate-200 shadow-sm cardStyle">
              <CardContent className="p-4">
                <p className="text-sm text-slate-700 font-semibold mb-1">
                  Ghi chú
                </p>
                <p className="text-sm">{note}</p>
              </CardContent>
            </Card>
          )}

          {linkDocument && (
            <Card className="border-slate-200 shadow-sm cardStyle">
              <CardContent className="p-4">
                <p className="text-sm text-slate-700 font-semibold mb-1">
                  Tài liệu đính kèm
                </p>
                <LinkPreview
                  url={linkDocument}
                  target="_blank"
                  className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 text-sm font-medium group"
                >
                  <ExternalLink className="size-8" />
                  Xem tài liệu
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </LinkPreview>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
