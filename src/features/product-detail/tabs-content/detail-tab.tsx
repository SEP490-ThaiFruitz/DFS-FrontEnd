import { memo } from "react";
import { AlertCircle, Check, Info } from "lucide-react"; // Ensure this import exists
import { ProductDetailTypes } from "../product-detail.types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DetailProps {
  product: Pick<
    ProductDetailTypes,
    "description" | "dryingMethod" | "moistureContent"
  >;
}
export const DetailTab = memo(({ product }: DetailProps) => {
  return (
    <div className="p-6 lg:p-8  space-y-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl">
      <div className="prose max-w-none">
        <span className="text-lg text-gray-700 leading-relaxed">
          {product.description}
        </span>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <Info className="h-5 w-5" />
          Đặc điểm sản phẩm
        </h3>

        <ul className="mt-4 grid gap-3">
          {[
            { text: "Sản phẩm hữu cơ từ Việt Nam" },
            {
              text: `Phương pháp sấy: ${
                product.dryingMethod === "InfraredDrying"
                  ? "Sấy hồng ngoại"
                  : product.dryingMethod
              }`,
            },
            { text: `Độ ẩm: ${Number(product.moistureContent) * 100}%` },
            { text: "Giàu chất chống oxy hóa và vitamin" },
            {
              text: "Lý tưởng để trộn trong ngũ cốc, thêm vào bánh, salad hoặc ăn vặt",
            },
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <div
                className={`flex-shrink-0 rounded-full w-6 h-6 flex items-center justify-center text-green-500 bg-slate-100`}
              >
                <Check className="h-4 w-4" />
              </div>
              <span className="text-slate-700 font-light text-sm">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="text-xl font-semibold mb-6 text-primary">
          Cách sử dụng
        </h3>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Ăn trực tiếp",
              description:
                "Thưởng thức như một món ăn nhẹ lành mạnh bất cứ lúc nào",
              gradient: "from-blue-50 to-indigo-50",
            },
            {
              title: "Trộn với ngũ cốc",
              description:
                "Thêm vào ngũ cốc, sữa chua hoặc bột yến mạch buổi sáng",
              gradient: "from-indigo-50 to-purple-50",
            },
            {
              title: "Làm bánh",
              description:
                "Thêm vào các công thức bánh nướng, muffin hoặc bánh quy",
              gradient: "from-purple-50 to-pink-50",
            },
          ].map((item, index) => (
            <Card
              key={index}
              className={`overflow-hidden border-none shadow-md bg-gradient-to-br ${item.gradient} cardStyle`}
            >
              <CardContent className="p-6">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm mx-auto">
                  <span className="text-xl font-bold text-slate-700">
                    {index + 1}
                  </span>
                </div>
                <h4 className="font-semibold text-lg text-center mb-3">
                  {item.title}
                </h4>
                <span className="text-slate-600 text-center text-sm">
                  {item.description}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary">Bảo quản</h3>

        <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 cardStyle">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col items-start gap-2">
              <Badge variant="outline" className="bg-amber-100 text-amber-800">
                Quan trọng
              </Badge>
              <span className="text-amber-800 leading-relaxed">
                Bảo quản ở nơi khô ráo, thoáng mát. Sau khi mở gói, nên bảo quản
                trong hộp kín hoặc túi zip và để trong tủ lạnh để giữ độ tươi
                ngon.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DetailTab.displayName = "DetailTab";
