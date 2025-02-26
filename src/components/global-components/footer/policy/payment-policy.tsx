"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreditCard, CheckCircle, RefreshCcw, FileText } from "lucide-react";

export function PaymentPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-x-1 cursor-pointer hover:scale-105 transition duration-300">
          <CreditCard className="size-5" />
          <span className="font-semibold text-moi_moc_green">
            Chính Sách Thanh Toán
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chính sách thanh toán
          </DialogTitle>
          <DialogDescription>
            Chi tiết về phương thức và quy trình thanh toán tại Môi Mộc
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Phương thức thanh toán</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Hiện tại, Môi Mộc hỗ trợ một hình thức thanh toán duy nhất
                      là chuyển khoản ngân hàng. Khi thanh toán, khách hàng có
                      thể quét mã QR ngân hàng hiển thị tại bước thanh toán để
                      thực hiện chuyển khoản một cách nhanh chóng và tiện lợi.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Thanh toán an toàn và bảo mật</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Xác nhận thanh toán</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sau khi khách hàng hoàn tất chuyển khoản, hệ thống sẽ tự
                    động kiểm tra tình trạng giao dịch. Nếu thanh toán được xác
                    nhận thành công, Môi Mộc sẽ gửi tin nhắn xác nhận qua SMS
                    đến số điện thoại của khách hàng để xác nhận đơn hàng đã
                    được ghi nhận và chuẩn bị xử lý.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Kiểm tra tự động</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Xác nhận qua SMS</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5" />
                  <span>Chính sách hoàn tiền</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Trong trường hợp xảy ra lỗi thanh toán hoặc đơn hàng bị hủy,
                    Môi Mộc cam kết sẽ hoàn lại toàn bộ số tiền cho khách hàng.
                    Quy trình hoàn tiền sẽ được thực hiện nhanh chóng để đảm bảo
                    quyền lợi và sự hài lòng của khách hàng.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Yêu cầu về thông tin thanh toán</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Đối với các thông tin thanh toán, Môi Mộc không yêu cầu tên
                    chủ thẻ hoặc tài khoản ngân hàng phải trùng khớp với người
                    nhận hàng. Điều này giúp khách hàng linh hoạt hơn trong việc
                    lựa chọn phương thức thanh toán.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium text-yellow-500">
                      Lưu ý: Mặc dù không yêu cầu trùng khớp thông tin, khách
                      hàng vẫn cần đảm bảo thực hiện thanh toán đúng số tiền và
                      thông tin đơn hàng.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
