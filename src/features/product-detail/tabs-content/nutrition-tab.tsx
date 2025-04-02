import { Calendar, Leaf, List, Logs, Scroll, SquareStack } from "lucide-react";
import { memo } from "react";
import { ProductDetailTypes } from "../product-detail.types";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/global-components/empty-state";
import { LinkPreview } from "@/components/global-components/link-preview";

interface NutritionalTabProps {
  nutritionalData: Record<string, string | number>;
}
export const NutritionTab = memo(({ nutritionalData }: NutritionalTabProps) => {
  const nutritionalDummy = {
    servingSize: "28g (1/4 cup)",
    calories: 100,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbohydrate: 24,
    dietaryFiber: 3,
    sugars: 18,
    protein: 1,
    vitaminD: 0,
    calcium: 0,
    iron: 2,
    potassium: 4,
    vitaminC: 2,
  };

  return nutritionalDummy ? (
    <div className="p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl">
      <div className="">
        <h3 className="text-lg  mb-3 flex items-center gap-2  font-semibold">
          <Calendar className="h-5 w-5 text-indigo-500" />
          Thông tin dinh dưỡng
        </h3>
        <div className="border rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-sky-50 p-4 border-b">
            <span className="font-bold">
              Khẩu phần ăn: {nutritionalDummy.servingSize ?? "N/A"}
            </span>
          </div>
          <div className="p-4">
            {Object.entries(nutritionalDummy).map(([key, value]) => (
              <div key={key} className="flex my-1 justify-between">
                <span className="text-slate-700 font-semibold">{key}</span>
                <span className="font-normal text-sky-700">
                  {typeof value === "number" ? `${value}g` : value}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-4  flex flex-col gap-2">
            <span className="text-sm text-slate-700">
              * Phần trăm giá trị hàng ngày dựa trên chế độ ăn 2,000 calories.
            </span>

            <LinkPreview
              url="https://www.pharmacity.vn/day-du-bang-calo-thuc-pham.html"
              className="text-sky-500 hover:text-sky-700 font-semibold text-xs hover:underline  transition duration-300 cursor-pointer flex items-center gap-1"
              height={300}
              width={400}
            >
              <SquareStack className="size-4" />
              Tham khảo thông tin tại đây
            </LinkPreview>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg  mb-3 flex items-center gap-2 font-semibold">
            <Leaf className="h-5 w-5 text-green-600" />
            Lợi ích sức khỏe
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5  border border-blue-100 rounded-3xl">
              <h4 className="font-semibold text-base  text-sky-700 mb-2">
                Giàu chất chống oxy hóa
              </h4>
              <span className="text-sm">
                Việt quất chứa anthocyanin, một loại flavonoid có đặc tính chống
                oxy hóa mạnh mẽ, giúp bảo vệ cơ thể khỏi các gốc tự do.
              </span>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-3xl border border-purple-100">
              <h4 className="font-semibold text-base text-purple-700 mb-2">
                Hỗ trợ sức khỏe não bộ
              </h4>
              <span className="text-sm">
                Các nghiên cứu cho thấy việt quất có thể cải thiện chức năng não
                và làm chậm quá trình suy giảm nhận thức liên quan đến tuổi tác.
              </span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-3xl border border-green-100">
              <h4 className="font-semibold text-base text-green-700 mb-2">
                Tốt cho tim mạch
              </h4>
              <span className="text-sm">
                Việt quất có thể giúp giảm huyết áp và mức cholesterol, từ đó
                giảm nguy cơ mắc bệnh tim.
              </span>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-5 rounded-3xl border border-red-100">
              <h4 className="font-semibold text-base text-red-700 mb-2">
                Kiểm soát đường huyết
              </h4>
              <span className="text-sm">
                Chất xơ và các hợp chất trong việt quất có thể giúp cải thiện độ
                nhạy insulin và kiểm soát lượng đường trong máu.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <EmptyState
      icons={[Logs, Scroll, List]}
      title="Không có dữ liệu dinh dưỡng"
      description="Thông tin dinh dưỡng không khả dụng cho sản phẩm này."
      className="min-w-full mx-auto p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md"
    />
  );
});

NutritionTab.displayName = "NutritionTab";
