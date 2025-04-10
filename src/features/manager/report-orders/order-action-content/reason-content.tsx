import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { BookCheck, CircleDot, Package } from "lucide-react";
import { memo } from "react";

interface ReturnReasonContentProps {
  selectedReason: string;
  setSelectedReason: React.Dispatch<React.SetStateAction<string>>;

  additionalComments: string;
  setAdditionalComments: React.Dispatch<React.SetStateAction<string>>;

  preferredAction: string;
  setPreferredAction: React.Dispatch<React.SetStateAction<string>>;

  reasons: {
    id: string;
    reason: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

// const returnReasons = [
//   {
//     id: "wrong-size",
//     reason: "Sai kích thước",
//     description: "Sản phẩm quá lớn hoặc quá nhỏ",
//     icon: <Package className="h-4 w-4" />,
//   },
//   {
//     id: "damaged",
//     reason: "Sản phẩm bị hư hỏng",
//     description: "Sản phẩm bị hỏng khi nhận được",
//     icon: <AlertCircle className="h-4 w-4" />,
//   },
//   {
//     id: "not-as-described",
//     reason: "Không đúng như mô tả",
//     description: "Sản phẩm khác với mô tả trên website",
//     icon: <ShoppingBag className="h-4 w-4" />,
//   },
//   {
//     id: "defective",
//     reason: "Sản phẩm bị lỗi",
//     description: "Sản phẩm không hoạt động đúng",
//     icon: <X className="h-4 w-4" />,
//   },
//   {
//     id: "wrong-item",
//     reason: "Nhận sai sản phẩm",
//     description: "Sản phẩm nhận được không phải sản phẩm đã đặt",
//     icon: <Package className="h-4 w-4" />,
//   },
//   {
//     id: "changed-mind",
//     reason: "Đổi ý",
//     description: "Không còn muốn sản phẩm này nữa",
//     icon: <RefreshCw className="h-4 w-4" />,
//   },
//   {
//     id: "other",
//     reason: "Khác (vui lòng ghi rõ)",
//     description: "Lý do khác không được liệt kê ở trên",
//     icon: <AlertCircle className="h-4 w-4" />,
//   },
// ];
export const ReasonContent = memo(
  ({
    reasons,
    selectedReason,
    additionalComments,
    setAdditionalComments,

    preferredAction,
    setPreferredAction,
    setSelectedReason,
  }: ReturnReasonContentProps) => {
    const isOtherSelected = selectedReason === "Khác (vui lòng ghi rõ)";

    return (
      <div className="mb-6">
        <h3 className="text-base flex items-center gap-1 font-bold text-slate-700 mb-2">
          <BookCheck className="size-6" />
          Lý do trả hàng
        </h3>
        <RadioGroup
          value={selectedReason}
          onValueChange={setSelectedReason}
          className="space-y-3"
        >
          {reasons.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative flex flex-col rounded-lg border p-4 transition-all duration-200",
                selectedReason === item.reason
                  ? "border-blue-200 bg-blue-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className="flex  gap-3">
                <RadioGroupItem
                  value={item.reason}
                  id={item.id}
                  className={cn(
                    "transition-colors duration-200 mt-1",
                    selectedReason === item.reason
                      ? "border-sky-500 text-sky-500"
                      : ""
                  )}
                />

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        "p-1.5 rounded-full transition-colors font-semibold duration-200",
                        selectedReason === item.reason
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      )}
                    >
                      {item.icon}
                    </div>

                    <Label
                      htmlFor={item.id}
                      className={cn(
                        "font-semibold text-base cursor-pointer transition-colors duration-200",
                        selectedReason === item.reason
                          ? "text-sky-700"
                          : "text-slate-700"
                      )}
                    >
                      {item.reason}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 ml-8">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        {preferredAction && setPreferredAction && (
          <div className="mb-6 mt-4">
            <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-1">
              <CircleDot className="size-6" />
              Bạn muốn
            </h3>
            <RadioGroup
              value={preferredAction}
              onValueChange={setPreferredAction}
              className="flex gap-4"
            >
              <div
                className={cn(
                  "flex-1 relative flex flex-col rounded-lg border p-4 transition-all duration-200",
                  preferredAction === "return"
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="return" id="return" />
                  <Label
                    htmlFor="return"
                    className="font-semibold cursor-pointer"
                  >
                    Trả lại sản phẩm
                  </Label>
                </div>
              </div>
              <div
                className={cn(
                  "flex-1 relative flex flex-col rounded-lg border p-4 transition-all duration-200",
                  preferredAction === "exchange"
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="exchange" id="exchange" />
                  <Label
                    htmlFor="exchange"
                    className="font-semibold cursor-pointer"
                  >
                    Đổi sản phẩm
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {isOtherSelected && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="comments" className="text-sm font-semibold">
              Vui lòng cung cấp thêm thông tin
            </Label>
            <Textarea
              id="comments"
              placeholder="Nhập lý do trả hàng của bạn..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        )}
      </div>
    );
  }
);

ReasonContent.displayName = "ReasonContent";
