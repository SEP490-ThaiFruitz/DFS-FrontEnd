import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ImagePreview from '@/components/custom/_custom-image/image-preview'
import Link from 'next/link'
import { ProductVariant, Request } from './page'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DialogProductDetailProps {
    isOpen: boolean,
    onClose: () => void,
    request: Request
}

const DialogProductDetail = ({ onClose, isOpen, request }: Readonly<DialogProductDetailProps>) => {
    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            Pending: { color: "bg-yellow-100 hover:bg-yellow-100/80 text-yellow-800", label: "Chờ xác nhận" },
            Processing: { color: "bg-green-100 hover:bg-green-100/80 text-green-800", label: "Đang xử lí" },
            Declined: { color: "bg-red-100 hover:bg-red-100/80 text-red-800", label: "Từ chối" },
            Approved: { color: "bg-blue-100 hover:bg-blue-100/80 text-blue-800", label: "Hoàn thành" },
        }

        return statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status }
    }
    const totalQuantity = request.productVariants.reduce((sum, variant) => sum + variant.quantity, 0)
    const totalWeight = request.productVariants.reduce((sum, variant) => sum + variant.netWeight * variant.quantity, 0)
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[460px] md:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="text-lg font-semibold flex items-center gap-10">Yêu cầu: {request.name}
                            <Badge className={`${getStatusBadge(request.status).color} px-3 py-1 mr-10`}>
                                {getStatusBadge(request.status).label}
                            </Badge>
                        </div>

                    </DialogTitle>
                </DialogHeader>
                <div className="pb-3 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-medium">Ngày yêu cầu:</span>
                            <span className="text-sm font-semibold">{formatTimeVietNam(new Date(request.requestDate))}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-medium">Ngày dự kiến:</span>
                            <span className="text-sm font-semibold">{formatTimeVietNam(new Date(request.expectedDate))}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium">Loại yêu cầu:</span>
                            <Badge variant="outline" className="px-2">
                                {request.requestType === "Import" ? "Nhập kho" : "Trả hàng"}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium">Người yêu cầu:</span>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={request.user.avatar} alt={request.user.name} />
                                    <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{request.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{request.user.role}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    {request.description && (
                        <div className="space-y-2 mt-4">
                            <div className="text-sm text-muted-foreground font-medium">Mô tả:</div>
                            <span className="text-sm font-semibold">{request.description}</span>
                        </div>
                    )}


                    {request.status === "Canceled" && request.reasonDeclined && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-400 rounded-md">
                            <div className="text-sm text-red-700 font-medium">Lý do từ chối:</div>
                            <p className="text-sm text-red-700">{request.reasonDeclined}</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium">Tổng số lượng:</span>
                            <span className="font-semibold">{totalQuantity} sản phẩm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium">Tổng trọng lượng:</span>
                            <span className="font-semibold">{(totalWeight / 1000).toFixed(2)} kg</span>
                        </div>
                    </div>
                </div>
                <ScrollArea className="w-full max-h-[300px] py-3 px-5">

                    {request.productVariants.map((variant: ProductVariant) => (
                        <Card key={variant.productVariantId} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow mb-6">
                            <div className="flex flex-col sm:flex-row">
                                <div className="h-52 sm:h-auto sm:w-52 md:w-64 bg-muted/20">
                                    <ImagePreview
                                        images={[variant.image]}
                                        className="object-cover h-40"
                                    />
                                </div>
                                <CardContent className="p-4 md:p-6 flex-1">
                                    <div className="flex flex-col h-full">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                                            <Link href={`/admin/product/${variant.productId}`} className="font-medium text-lg hover:underline">
                                                {variant.name} - {variant.packageType}
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mt-2">
                                            <div className="space-y-1.5">
                                                <div className="text-muted-foreground font-medium">Trọng lượng</div>
                                                <div className="font-semibold text-xl text-primary">{variant.netWeight}g</div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="text-muted-foreground font-medium">Số lượng</div>
                                                <div className="font-semibold text-xl text-primary">{variant.quantity}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Thoát
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogProductDetail