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
import {
  RefreshCcw,
  Calendar,
  Truck,
  ListChecks,
  Shield,
  Phone,
  MessageSquare,
  Globe,
  Package,
} from "lucide-react";

export const ReturnPolicy = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-x-1 cursor-pointer hover:scale-105 transition duration-300">
          <Package className="size-5" />
          <span className="font-semibold text-moi_moc_green">
            Chính Sách Đổi Trả
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chính sách đổi trả
          </DialogTitle>
          <DialogDescription>
            Chi tiết về điều kiện và quy trình đổi trả sản phẩm của Môi Mộc
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
                  <RefreshCcw className="w-5 h-5" />
                  <span>Điều kiện đổi trả sản phẩm</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Khách hàng có thể đổi hoặc trả lại sản phẩm trong các trường
                    hợp sau:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                    <li>
                      Sản phẩm chưa được bóc bao bì, tem nhãn hoặc sử dụng.
                    </li>
                    <li>
                      Sản phẩm phải còn nguyên vẹn, chưa có dấu hiệu can thiệp,
                      đảm bảo tình trạng như ban đầu khi nhận.
                    </li>
                  </ul>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium text-yellow-600">
                      Lưu ý: Nếu sản phẩm đã bóc tem, nhãn hoặc đã qua sử dụng,
                      Môi Mộc sẽ không hỗ trợ đổi trả.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Thời hạn đổi trả</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Thời gian áp dụng cho chính sách đổi trả là trong vòng 7
                    ngày kể từ ngày khách hàng nhận được sản phẩm. Sau thời hạn
                    này, Môi Mộc sẽ không tiếp nhận yêu cầu đổi trả.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  <span>Chi phí vận chuyển đổi trả</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Trong tất cả các trường hợp đổi trả hợp lệ, Môi Mộc sẽ chịu
                    hoàn toàn chi phí vận chuyển, giúp khách hàng an tâm và
                    thuận tiện hơn trong quá trình đổi trả.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5" />
                  <span>Quy trình đổi trả</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Để đổi hoặc trả sản phẩm, khách hàng vui lòng thực hiện các
                    bước sau:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">
                        Điện thoại: 0777.499.897
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">
                        Nhắn tin qua fanpage Môi Mộc
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">
                        Gửi yêu cầu qua thông tin liên hệ trên website
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Chuẩn bị sản phẩm để đổi trả: Đóng gói sản phẩm lại như
                      lúc mới nhận, đảm bảo an toàn trong quá trình vận chuyển.
                      Sau đó, Môi Mộc sẽ liên hệ với Viettel Post để đến lấy
                      hàng tại địa chỉ của khách hàng.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Chính sách bảo đảm chất lượng</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Trong trường hợp sản phẩm bị lỗi do nhà sản xuất, Môi Mộc
                    cam kết đổi mới hoàn toàn sản phẩm mà không phát sinh bất kỳ
                    chi phí nào cho khách hàng. Sản phẩm thay thế sẽ được kiểm
                    tra kỹ lưỡng, đảm bảo chất lượng trước khi giao lại đến tay
                    khách hàng.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
