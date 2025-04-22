"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import Link from "next/link"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Package } from "lucide-react"
import type { ApiResponse } from "@/types/types"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { PRODUCT_BATCH_KEY } from "@/app/key/comm-key"

interface ProductBatchItem {
    productId: string
    productName: string
    productVariantId: string
    productVariantImage: string
    packagingType: string
    netWeight: number
    quantity: number
    remaining: number
    preservationMethod: string
    productionDate: string
    expirationDate: string
}

interface Document {
    name: string
    type: string
    attachment: string
}

interface ProductBatch {
    id: number
    number: string
    requestName: string
    productBatchItems: ProductBatchItem[]
    documents: Document[]
}

interface DialogProductBatchDetailProps {
    isOpen: boolean
    onClose: () => void
    id: number
}

const DialogProductBatchDetail = ({ onClose, isOpen, id }: Readonly<DialogProductBatchDetailProps>) => {
    const { data: productBatch } = useFetch<ApiResponse<ProductBatch>>(`/ProductBatches/${id}`, [PRODUCT_BATCH_KEY.PRODUCT_BATCH_DETAIL, id.toString()])

    const totalQuantity = productBatch?.value?.productBatchItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
    const totalWeight =
        productBatch?.value?.productBatchItems?.reduce((sum, item) => sum + item.netWeight * item.quantity, 0) ?? 0
    const getRemainingTime = (endDate: string) => {
        const remainingMilliseconds =
            new Date(endDate).getTime() - new Date().getTime();
        const remainingDays = Math.ceil(
            remainingMilliseconds / (1000 * 60 * 60 * 24)
        );
        if (remainingMilliseconds <= 0)
            return (
                <div className="px-2 py-1 bg-red-50 w-fit rounded-md text-red-700 font-bold text-center">
                    Đã hết hạn
                </div>
            );

        return (
            <div
                className={`px-2 py-1  w-fit rounded-md font-bold text-center ${remainingDays > 3
                    ? "bg-green-50 text-green-700 "
                    : "bg-yellow-50 text-yellow-700 "
                    }`}
            >
                {remainingDays} ngày
            </div>
        );
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[460px] md:min-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>{productBatch?.value?.number}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="pb-3 overflow-y-auto max-h-[600px] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-medium">Mã lô:</span>
                            <span className="text-sm font-semibold">{productBatch?.value?.number}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-muted-foreground font-medium">Tên yêu cầu:</span>
                            <span className="text-sm font-semibold">{productBatch?.value?.requestName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium">Số loại  sản phẩm:</span>
                            <Badge variant="outline" className="px-2">
                                {productBatch?.value?.productBatchItems?.length ?? 0} loại
                            </Badge>
                        </div>

                        {productBatch?.value?.documents && productBatch.value.documents.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground font-medium">Tài liệu:</span>
                                <Badge variant="outline" className="px-2">
                                    {productBatch.value.documents.length} tài liệu
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium">Tổng số lượng:</span>
                            <span className="font-semibold">{totalQuantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium">Tổng trọng lượng:</span>
                            <span className="font-semibold">{(totalWeight / 1000).toFixed(2)} kg</span>
                        </div>
                    </div>
                    {productBatch?.value?.documents && productBatch.value.documents.length > 0 && (
                        <div className="py-3 border-b">
                            <h3 className="text-muted-foreground font-medium mb-2">Tài liệu đính kèm</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {productBatch.value.documents.map((doc, index) => (
                                    <div key={doc.name} className="flex items-center gap-2 p-2 border rounded-md">
                                        <span className="text-sm font-medium w-fit">{doc.name}</span>

                                        {doc.type === "Image" ? (
                                            <>
                                                <ImagePreview images={[doc.attachment]} className="object-cover h-20 hover:cursor-pointer" />

                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={doc.attachment.replace('/upload/', `/upload/fl_attachment:${doc.name}/`)} download>
                                                        <Download />
                                                    </a>
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Badge variant="outline" className="ml-auto">
                                                    Tài liệu
                                                </Badge>

                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={doc.attachment} target="_blank" rel="noopener noreferrer">
                                                        Xem
                                                    </a>
                                                </Button>

                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={doc.attachment.replace('/upload/', `/upload/fl_attachment:${doc.name}/`)} download>
                                                        <Download />
                                                    </a>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="">
                        {productBatch?.value?.productBatchItems?.map((item) => (
                            <Card key={item.productVariantId} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow mb-6">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="h-52 sm:h-auto sm:w-52 md:w-64 bg-muted/20">
                                        <ImagePreview images={[item.productVariantImage]} className="object-cover h-full" />
                                    </div>
                                    <CardContent className="p-4 md:p-6 flex-1">
                                        <div className="flex flex-col h-full">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                                                <Link href={`/admin/product/${item.productId}`} className="font-medium text-lg hover:underline">
                                                    {item.productName} - {item.packagingType}
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm mt-2">
                                                <div className="space-y-1.5">
                                                    <div className="text-muted-foreground font-medium">Trọng lượng</div>
                                                    <div className="font-semibold text-xl text-primary">{item.netWeight}g</div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="text-muted-foreground font-medium">Số lượng</div>
                                                    <div className="font-semibold text-xl text-primary">{item.quantity}</div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="text-muted-foreground font-medium">Phương pháp bảo quản</div>
                                                    <div className="font-semibold text-primary">{item.preservationMethod}</div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="text-muted-foreground font-medium">Ngày sản xuất</div>
                                                    <div className="font-semibold text-primary">
                                                        {formatTimeVietNam(new Date(item.productionDate))}
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="text-muted-foreground font-medium">Ngày hết hạn</div>
                                                    <div className="font-semibold text-primary">
                                                        {formatTimeVietNam(new Date(item.expirationDate))}
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="text-muted-foreground font-medium">Thời hạn</div>
                                                    <div className="font-semibold text-primary">
                                                        {getRemainingTime(item.expirationDate)}
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
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

export default DialogProductBatchDetail
