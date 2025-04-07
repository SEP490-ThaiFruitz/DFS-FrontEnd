"use client"

import NotificationCard, { NotificationItem } from "./card-notification"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface NotificationListProps {
    notifications: NotificationItem[]
    isLoading: boolean
    onLoadMore: () => void
    hasMore: boolean
}

const NotificationList = ({ notifications, isLoading, onLoadMore, hasMore }: NotificationListProps) => {
    if (isLoading && !notifications) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    if (!notifications || notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">Bạn chưa có thông báo nào</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            {notifications.map((notification: NotificationItem, index) => (
                <NotificationCard key={notification.id} notification={notification} />
            ))}

            {hasMore && (
                <div className="p-3 flex justify-center">
                    <Button variant="ghost" size="sm" onClick={onLoadMore} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang tải...
                            </>
                        ) : (
                            "Xem thêm"
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default NotificationList

