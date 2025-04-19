import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatVND } from "@/lib/format-currency";
import { FileTextIcon, InfoIcon } from "lucide-react";
import { memo } from "react";

interface GeneralTabProps {
  requestId: string;
  shippingFeeResponsibility: string;
  setShippingFeeResponsibility: (value: string) => void;
  adminNote: string;
  setAdminNote: (value: string) => void;
  itemsData: {
    returnExchangeRequestItemId: string;
    receiveQuantity: number;
    note: string;
    acceptQuantity: number;
  }[]; // Replace with the actual type of itemsData
  totalRefundAmount: number;
}
export const GeneralTab = memo(
  ({
    requestId,
    shippingFeeResponsibility,
    setShippingFeeResponsibility,
    adminNote,
    setAdminNote,
    itemsData,
    totalRefundAmount,
  }: GeneralTabProps) => {
    return (
      <div className="m-0 p-4 space-y-6 motion-preset-slide-right motion-duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="request-id" className="text-sm font-medium">
                ID yêu cầu
              </Label>
              <div className="flex mt-1.5">
                <Input
                  id="request-id"
                  value={requestId}
                  disabled
                  className="bg-slate-50 border-slate-200 text-slate-800 font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-10 w-10 text-slate-500 hover:text-slate-900"
                  onClick={() => navigator.clipboard.writeText(requestId)}
                >
                  <FileTextIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                ID yêu cầu dùng để tham chiếu trong hệ thống
              </p>
            </div>

            <div>
              <Label htmlFor="shipping-fee" className="text-sm font-medium">
                Trách nhiệm phí vận chuyển
              </Label>
              <Select
                value={shippingFeeResponsibility}
                onValueChange={setShippingFeeResponsibility}
              >
                <SelectTrigger id="shipping-fee" className="mt-1.5">
                  <SelectValue placeholder="Chọn bên chịu phí vận chuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Khách hàng</SelectItem>
                  <SelectItem value="Platform">Người bán</SelectItem>
                  {/* <SelectItem value="Shared">Chia sẻ</SelectItem> */}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1.5">
                Xác định bên chịu trách nhiệm cho phí vận chuyển trả hàng
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="admin-note" className="text-sm font-medium">
              Ghi chú của quản lý
            </Label>
            <Textarea
              id="admin-note"
              placeholder="Nhập ghi chú cho yêu cầu trả hàng này"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="min-h-[150px] mt-1.5 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Ghi chú này sẽ được lưu trong hệ thống và không hiển thị cho khách
              hàng
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 text-amber-800 p-2 rounded-full">
              <InfoIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-sm">
                Tổng quan yêu cầu trả hàng
              </h4>
              <p className="text-sm text-slate-600 mt-1">
                Yêu cầu này bao gồm {itemsData.length} sản phẩm với tổng giá trị
                hoàn tiền là {formatVND(totalRefundAmount)}. Vui lòng xem lại
                thông tin sản phẩm trong tab Sản phẩm trước khi phê duyệt.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

GeneralTab.displayName = "GeneralTab";
