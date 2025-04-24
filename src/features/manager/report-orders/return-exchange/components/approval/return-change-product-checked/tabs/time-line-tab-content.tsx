import { Card, CardContent } from "@/components/ui/card";
import { vietnameseDate } from "@/utils/date";
import {
  getStatusReturnExchangeStep,
  ReturnExchangeFlow,
  returnExchangeLabel,
} from "../../../../return-exchange-status/status";

interface TimelineTabContentProps {
  createdAt: string;

  status: string;
}

const statusDescriptions: Record<string, string> = {
  pending: "Yêu cầu trả/đổi hàng của bạn đã được ghi nhận và đang chờ xử lý.",
  approved: "Yêu cầu của bạn đã được duyệt, đang chờ xử lý tiếp.",
  awaitingcustomerreturn: "Vui lòng gửi lại sản phẩm theo hướng dẫn.",
  productreceived: "Chúng tôi đã nhận được hàng trả từ bạn.",
  processing: "Sản phẩm của bạn đang được kiểm tra.",
  completed: "Yêu cầu đã hoàn tất. Hoàn tiền hoặc đổi hàng đã được xử lý.",
  rejected: "Yêu cầu đã bị từ chối.",
  cancelled: "Yêu cầu đã bị hủy.",
};

export default function TimelineTabContent({
  createdAt,
  status,
}: TimelineTabContentProps) {
  const currentStep = getStatusReturnExchangeStep(status as string);

  return (
    <Card
      className="border border-slate-200 shadow-sm motion-preset-slide-right cardSTyle
"
    >
      <CardContent className="pt-6">
        <div className="relative pl-8 pb-1">
          <div className="absolute left-0 top-0 h-full w-px bg-slate-200" />

          {ReturnExchangeFlow.map((key, index) => {
            const lowerKey = key.toLowerCase();
            const isActive = index === currentStep;
            const isPast = index < currentStep;

            const color = isActive
              ? "bg-violet-500"
              : isPast
              ? "bg-green-500"
              : "bg-slate-300";

            const opacity = isPast || isActive ? "opacity-100" : "opacity-50";

            return (
              <div key={key} className={`mb-8 relative ${opacity}`}>
                <div
                  className={`absolute left-[-8px] top-1 h-4 w-4 rounded-full border-2 border-white ${color}`}
                />
                <div className="bg-slate-50 p-3 rounded-md">
                  <h4 className="text-sm font-semibold">
                    {returnExchangeLabel(key)}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    {index === 0
                      ? vietnameseDate(createdAt)
                      : isActive
                      ? "Đang xử lý"
                      : isPast
                      ? "Đã xong"
                      : "Đang chờ"}
                  </p>
                  <p className="text-sm mt-2">{statusDescriptions[lowerKey]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
