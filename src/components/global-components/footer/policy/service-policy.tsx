import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Shield, User, CreditCard, Lock, Info } from "lucide-react";
import { format } from "date-fns";

export const ServicePolicy = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-x-1 cursor-pointer hover:scale-105 transition duration-300">
          <FileText className="h-4 w-4" />

          <span className="font-semibold text-moi_moc_green">
            Điều khoản dịch vụ
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <AlertDialogHeader>
          <DialogTitle className="flex items-center gap-1 text-x text-2xl font-bold">
            <FileText className="h-5 w-5" />
            Điều khoản dịch vụ
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Cập nhật lần cuối: {format(new Date(), "dd/MM/yyyy")}
          </DialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="item-1"
              className="border rounded-lg px-2 mb-3"
            >
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2 text-left">
                  <Info className="h-5 w-5 flex-shrink-0" />
                  <span>1. Giới thiệu</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <p className="text-sm text-muted-foreground">
                  Chào mừng bạn đến với Ví An Toàn. Bằng cách truy cập hoặc sử
                  dụng dịch vụ của chúng tôi, bạn đồng ý tuân theo các điều
                  khoản và điều kiện này.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border rounded-lg px-2 mb-3"
            >
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2 text-left">
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span>2. Dịch vụ ví điện tử</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <p className="text-sm text-muted-foreground">
                  Ví An Toàn cung cấp dịch vụ ví điện tử cho phép bạn lưu trữ,
                  gửi và nhận tiền điện tử. Chúng tôi không phải là ngân hàng và
                  không cung cấp dịch vụ ngân hàng.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border rounded-lg px-2 mb-3"
            >
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2 text-left">
                  <User className="h-5 w-5 flex-shrink-0" />
                  <span>3. Tài khoản của bạn</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <p className="text-sm text-muted-foreground">
                  Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản của
                  mình, bao gồm cả mã PIN. Chúng tôi không chịu trách nhiệm về
                  bất kỳ tổn thất nào phát sinh do việc bạn không bảo mật thông
                  tin đăng nhập của mình.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border rounded-lg px-2 mb-3"
            >
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2 text-left">
                  <CreditCard className="h-5 w-5 flex-shrink-0" />
                  <span>4. Phí dịch vụ</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <p className="text-sm text-muted-foreground">
                  Chúng tôi có thể tính phí cho một số dịch vụ nhất định. Bạn sẽ
                  luôn được thông báo về bất kỳ khoản phí nào trước khi hoàn tất
                  giao dịch.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border rounded-lg px-2 mb-3"
            >
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2 text-left">
                  <Lock className="h-5 w-5 flex-shrink-0" />
                  <span>5. Bảo mật</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <p className="text-sm text-muted-foreground">
                  Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ
                  thông tin của bạn, nhưng không thể đảm bảo an ninh tuyệt đối.
                  Bạn nên thực hiện các biện pháp thích hợp để bảo vệ thông tin
                  của mình.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DialogClose asChild>
          <Button
            className="w-full bg-sky-300 hover:bg-sky-500 hoverAnimate"
            variant="outline"
          >
            Đã hiểu
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
