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
import { UserCircle, Target, Settings, Shield, Cookie } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-x-1 cursor-pointer hover:scale-105 transition duration-300">
          <Cookie className="size-5" />
          <span className="font-semibold text-moi_moc_green">
            Chính Sách Bảo Mật
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chính sách bảo mật
          </DialogTitle>
          <DialogDescription>
            Chi tiết về cách chúng tôi bảo vệ thông tin của khách hàng tại Mói
            Mọc
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
                  <UserCircle className="w-5 h-5" />
                  <span>Thu thập thông tin cá nhân</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Để tạo tài khoản và trải nghiệm mua sắm thuận tiện tại Mói
                    Mọc, khách hàng cần cung cấp một số thông tin cá nhân cơ
                    bản, bao gồm:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                    <li>
                      Tên và số điện thoại: Được thu thập trong quá trình tạo
                      tài khoản và quản lý dữ liệu người dùng.
                    </li>
                    <li>
                      Địa chỉ giao hàng: Được bổ sung trong quá trình thanh toán
                      để hỗ trợ giao sản phẩm đến đúng địa chỉ của khách hàng.
                    </li>
                  </ul>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      Các thông tin này đảm bảo rằng khách hàng có thể tạo tài
                      khoản và Môi Mộc có thể xử lý đơn hàng một cách nhanh
                      chóng và chính xác.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>Mục đích sử dụng thông tin</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Thông tin cá nhân của khách hàng được sử dụng nhằm phục vụ
                    các mục đích sau:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                    <li>
                      Quản lý dữ liệu người dùng: Dữ liệu giúp Môi Mộc xây dựng
                      dịch vụ cá nhân hóa và hỗ trợ khách hàng tốt hơn.
                    </li>
                    <li>
                      Xử lý đơn hàng: Thông tin giao hàng được chuyển cho đối
                      tác vận chuyển là Viettel Post trong trường hợp giao hàng
                      ngoại tỉnh.
                    </li>
                  </ul>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium">
                      Môi Mộc cam kết không chia sẻ thông tin cá nhân của khách
                      hàng với bất kỳ bên thứ ba nào ngoài đối tác vận chuyển
                      cần thiết để hoàn thành đơn hàng.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  <span>Quyền truy cập và chỉnh sửa thông tin</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Khách hàng hoàn toàn có thể tự do truy cập, chỉnh sửa hoặc
                    xóa thông tin cá nhân của mình. Để thực hiện, khách hàng chỉ
                    cần:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      Truy cập vào mục "User" trên thanh điều hướng của website,
                      nơi có sẵn các tùy chọn chỉnh sửa hoặc xóa thông tin.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Các thao tác đều nhanh chóng và thuận tiện, giúp khách hàng
                    quản lý thông tin cá nhân một cách an toàn và dễ dàng.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Biện pháp bảo mật thông tin</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Môi Mộc áp dụng các biện pháp bảo mật cao cấp để bảo vệ
                    thông tin cá nhân của khách hàng, bao gồm:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                    <li>
                      Bảo mật trong thanh toán: Khách hàng tự quét mã QR khi
                      thanh toán, đảm bảo quy trình hoàn toàn do khách hàng chủ
                      động và an toàn.
                    </li>
                    <li>
                      Bảo mật dữ liệu: Hệ thống website Môi Mộc được trang bị
                      các lớp bảo mật tiên tiến để đảm bảo an toàn cho dữ liệu
                      cá nhân của khách hàng.
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Cookie className="w-5 h-5" />
                  <span>Chính sách cookie</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Môi Mộc cam kết không thu thập cookie từ khách hàng khi truy
                    cập vào trang web, đảm bảo quyền riêng tư và không lưu trữ
                    bất kỳ thông tin không cần thiết nào của người dùng.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
