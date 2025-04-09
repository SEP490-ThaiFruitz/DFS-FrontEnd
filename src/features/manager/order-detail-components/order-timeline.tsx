import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/date";
import { Clock } from "lucide-react";

interface OrderTimelineProps {
  timeline: any[];
}

export default function OrderTimeline({ timeline }: OrderTimelineProps) {
  return (
    <Card className="overflow-hidden cardStyle">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-amber-600" />
          Lịch Sử Đơn Hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="space-y-5">
          {timeline.map((event, index) => (
            <div key={index} className="relative pl-6 pb-5 last:pb-0">
              {/* Timeline connector */}
              {index < timeline.length - 1 && (
                <div className="absolute left-[9px] top-[24px] bottom-0 w-0.5 bg-amber-200"></div>
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 h-[18px] w-[18px] rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              </div>

              {/* Event content */}
              <div>
                <h4 className="font-medium text-amber-800">{event.status}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(event.date)}
                </p>

                {/* Event details */}
                {event.details && event.details.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {event.details.map((detail: any, detailIndex: number) => (
                      <div
                        key={detailIndex}
                        className="text-sm bg-amber-50 p-3 rounded-lg border border-amber-100"
                      >
                        <p>{detail.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(detail.statusTime)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {timeline.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              Chưa có cập nhật nào
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
