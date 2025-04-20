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
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <ScrollArea className="max-h-[210px] overflow-y-auto p-2">
      <Card className="overflow-hidden shadow-sm cardStyle ">
        <CardContent className="p-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div>
              <span className="text-base flex items-center text-slate-700 font-semibold">
                <Calendar className="size-5 mr-1 text-emerald-600 " />
                Ngày yêu cầu
              </span>
              <div className="font-semibold underline gap-1.5">
                {vietnameseDate(requestDate, true)}
              </div>
            </div>

            {processedDate && (
              <div>
                <p className="text-sm text-slate-700 flex items-center font-semibold">
                  <Calendar className="size-5 mr-1 text-emerald-600" />
                  Ngày xử lý
                </p>
                <p className="font-semibold underline flex items-center gap-1.5">
                  {vietnameseDate(processedDate)}
                </p>
              </div>
            )}

            {shippingFeeResponsibility && (
              <div>
                <p className="text-sm text-slate-700 font-semibold">
                  Trách nhiệm phí vận chuyển
                </p>
                <p className="font-semibold flex items-center gap-1.5">
                  <Package className="size-5 mr-1 text-emerald-600" />
                  {shippingFeeResponsibility === "Customer" ? (
                    <span className="text-green-500 font-semibold">
                      Khách hàng
                    </span>
                  ) : (
                    shippingFeeResponsibility === "Platform" && (
                      <span className="text-violet-600 font-semibold">
                        Bên bán
                      </span>
                    )
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-base font-semibold flex items-center text-slate-700">
                <FileText className="size-5 mr-1 text-emerald-600 mt-0.5" />
                Lý do
              </div>
              <p className="font-semibold flex items-start underline gap-1.5 text-violet-600 text-wrap">
                {reason || "Không có"}
              </p>
            </div>

            {reasonReject && (
              <div>
                <p className="text-sm text-muted-foreground">Lý do từ chối</p>
                <p className="font-medium flex items-start gap-1.5">
                  <FileText className="size-5 mr-1 text-rose-600 mt-0.5" />
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
                  <FileText className="size-5 mr-1 text-slate-600 mt-0.5" />
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
                <p className="text-sm font-semibold text-wrap italic">{note}</p>
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
                  <ExternalLink className="size-5 mr-1" />
                  Xem tài liệu
                  <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </LinkPreview>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ScrollArea>
  );
}
