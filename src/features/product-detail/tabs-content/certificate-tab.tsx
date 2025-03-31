import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { vietnameseDate } from "@/utils/date";
import { ShieldCheck } from "lucide-react";
import { memo } from "react";
import { ProductDetailTypes } from "../product-detail.types";

interface ProductCertificationProps {
  certificates: Pick<ProductDetailTypes, "productCertification">;
}
export const CertificateTab = memo(
  ({ ...certificates }: ProductCertificationProps) => {
    const { productCertification } = certificates.certificates;

    return (
      <div className="p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productCertification.map((cert) => (
            <Card
              key={cert.id}
              className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cardStyle"
            >
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 border-b flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-green-600 flex-shrink-0" />
                <h3 className="font-medium">{cert.name}</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Cấp bởi:</p>
                    <p className="font-medium">{cert.agency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hiệu lực:</p>
                    <p>
                      {vietnameseDate(cert.issueDate)} -{" "}
                      {vietnameseDate(cert.expiryDate)}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600">Chi tiết:</p>
                    <p>{cert.details}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10  p-6 rounded-lg shadow-sm cardStyle">
          <h3 className="text-lg font-semibold mb-4">
            Tại sao chứng nhận quan trọng?
          </h3>
          <span className="text-sm text-slate-700 mb-6">
            Các chứng nhận đảm bảo rằng sản phẩm của chúng tôi đáp ứng các tiêu
            chuẩn nghiêm ngặt về chất lượng, an toàn thực phẩm và tính bền vững.
            Chúng tôi cam kết mang đến cho khách hàng những sản phẩm tốt nhất
            với sự minh bạch hoàn toàn về nguồn gốc và quy trình sản xuất.
          </span>
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-lg shadow-sm"
            defaultValue="organic"
          >
            <AccordionItem value="organic" className="border-b">
              <AccordionTrigger className="px-4 py-3 font-medium hover:bg-slate-50  rounded-t-lg">
                Chứng nhận hữu cơ là gì?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                Chứng nhận hữu cơ xác nhận rằng sản phẩm được trồng và chế biến
                mà không sử dụng phân bón tổng hợp, thuốc trừ sâu, kỹ thuật biến
                đổi gen, hoặc bức xạ ion hóa. Các sản phẩm hữu cơ được sản xuất
                với mục tiêu thúc đẩy sự cân bằng sinh thái và bảo tồn đa dạng
                sinh học.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="haccp" className="border-b">
              <AccordionTrigger className="px-4 py-3 font-medium hover:bg-slate-50">
                HACCP là gì?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                HACCP (Hệ thống Phân tích mối nguy và Điểm kiểm soát tới hạn) là
                một hệ thống quản lý an toàn thực phẩm nhằm xác định và kiểm
                soát các mối nguy có thể xảy ra trong quá trình sản xuất thực
                phẩm. Chứng nhận này đảm bảo rằng các biện pháp phòng ngừa đã
                được thực hiện để giảm thiểu rủi ro về an toàn thực phẩm.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="iso" className="border-0">
              <AccordionTrigger className="px-4 py-3 font-medium hover:bg-slate-50 rounded-b-lg">
                ISO 22000 là gì?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                ISO 22000 là tiêu chuẩn quốc tế về hệ thống quản lý an toàn thực
                phẩm. Nó kết hợp các nguyên tắc HACCP với các chương trình tiên
                quyết và các yếu tố khác của hệ thống quản lý để đảm bảo an toàn
                thực phẩm trong toàn bộ chuỗi cung ứng thực phẩm.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }
);

CertificateTab.displayName = "CertificateTab";
