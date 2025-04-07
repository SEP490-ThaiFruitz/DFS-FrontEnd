import { formatDistanceToNow } from "date-fns"
import { CreditCard, Info, Package, ShoppingBag, Tag, Ticket, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { vi } from "date-fns/locale"
import { API } from "@/actions/client/api-config"
import { useQueryClient } from "@tanstack/react-query"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { toast } from "sonner"
import { useRef, useState } from "react"


enum NotificationType {
    Info = "Info",
    Warning = "Warning",
    Error = "Error",
    Reminder = "Reminder",
}

enum NotificationCategory {
    Order = "Order",
    Voucher = "Voucher",
    Product = "Product",
    Combo = "Combo",
    System = "System",
    Payment = "Payment",
}

export interface NotificationItem {
    id: string
    title: string
    content: string
    type: NotificationType
    category: NotificationCategory
    status: "Read" | "Unread"
    redirectUrl: string
    createdOnUtc: string
}

interface NotificationCardProps {
    notification: NotificationItem
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
    const timeAgo = formatDistanceToNow(new Date(notification.createdOnUtc), { addSuffix: true, locale: vi })
    const queryClient = useQueryClient()
    const [notificationRemove, setNotificationRemove] = useState<NotificationItem | undefined>(undefined)
    const holdTimer = useRef<NodeJS.Timeout | null>(null)

    const NotificationTypeMap: Record<NotificationType, string> = {
        [NotificationType.Info]: "Thông tin",
        [NotificationType.Warning]: "Cảnh báo",
        [NotificationType.Error]: "Lỗi",
        [NotificationType.Reminder]: "Nhắc nhở",
    };

    const NotificationCategoryMap: Record<NotificationCategory, string> = {
        [NotificationCategory.Order]: "Đơn hàng",
        [NotificationCategory.Voucher]: "Voucher",
        [NotificationCategory.Product]: "Sản phẩm",
        [NotificationCategory.Combo]: "Gói quà",
        [NotificationCategory.System]: "Hệ thống",
        [NotificationCategory.Payment]: "Thanh toán",
    };

    const getCategoryIcon = () => {
        switch (notification.category) {
            case NotificationCategory.Order:
                return <ShoppingBag className="h-5 w-5 text-indigo-500" />
            case NotificationCategory.Voucher:
                return <Ticket className="h-5 w-5 text-green-500" />
            case NotificationCategory.Product:
                return <Package className="h-5 w-5 text-blue-500" />
            case NotificationCategory.Combo:
                return <Tag className="h-5 w-5 text-orange-500" />
            case NotificationCategory.System:
                return <Info className="h-5 w-5 text-gray-500" />
            case NotificationCategory.Payment:
                return <CreditCard className="h-5 w-5 text-emerald-500" />
            default:
                return <Info className="h-5 w-5 text-gray-500" />
        }
    }

    const getBackgroundColor = () => {
        if (notification.status === "Unread") {
            switch (notification.type) {
                case NotificationType.Info:
                    return "bg-blue-50 dark:bg-blue-950/20"
                case NotificationType.Warning:
                    return "bg-amber-50 dark:bg-amber-950/20"
                case NotificationType.Error:
                    return "bg-red-50 dark:bg-red-950/20"
                case NotificationType.Reminder:
                    return "bg-purple-50 dark:bg-purple-950/20"
                default:
                    return "bg-blue-50 dark:bg-blue-950/20"
            }
        }
        return ""
    }

    const handleReadNotification = async (notificationId: string) => {
        if (notification.status === "Unread") {
            await API.patch(`/Notifications/${notificationId}`, "")
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        }
    }

    const handleNotificationRemove = async (id: string) => {
        return await API.remove(`/Notifications/${id}`)
    }

    const handleMouseDown = (notification: NotificationItem) => {
        holdTimer.current = setTimeout(() => {
            setNotificationRemove(notification)
        }, 200)
    }

    const handleMouseUp = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current)
            holdTimer.current = null
        }
    }

    return <>
        {
            notification.redirectUrl ? (
                <Link
                    href={notification.redirectUrl}
                    className={cn("flex gap-3 p-4 border-b hover:bg-muted/50 transition-colors", getBackgroundColor())}
                    onClick={() => handleReadNotification(notification.id)}
                    onMouseDown={() => handleMouseDown(notification)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">{getCategoryIcon()}</div>
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                            <div className="font-medium text-sm"> {NotificationTypeMap[notification.type]} - {NotificationCategoryMap[notification.category]}</div>
                            <div className="flex items-center gap-1">
                                {notification.status === "Unread" && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{notification.content}</div>
                        <div className="text-xs text-muted-foreground">{timeAgo}</div>
                    </div>
                </Link>
            ) : (
                <button
                    onClick={() => handleReadNotification(notification.id)}
                    onMouseDown={() => handleMouseDown(notification)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="flex gap-3 p-4 border-b hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">{getCategoryIcon()}</div>
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                            <div className="font-medium text-sm"> {NotificationTypeMap[notification.type]} - {NotificationCategoryMap[notification.category]}</div>
                            <div className="flex items-center gap-1">
                                {notification.status === "Unread" && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{notification.content}</div>
                        <div className="text-xs text-muted-foreground">{timeAgo}</div>
                    </div>
                </button>
            )
        }
        {notificationRemove !== undefined && (
            <DeleteDialog
                deleteFunction={handleNotificationRemove}
                isOpen={notificationRemove !== undefined}
                onClose={() => setNotificationRemove(undefined)}
                refreshKey={[["notifications"]]}
                name="thông báo"
                id={notification.id}
            />
        )}
    </>

}

export default NotificationCard

