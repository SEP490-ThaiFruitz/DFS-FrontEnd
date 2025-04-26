"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"

// Interface provided by user
interface ProductBatch {
    productBatchNumber: string
    quantity: number
    expirationDate: string
}

interface ProductBatchCellProps {
    batches: ProductBatch[]
}

export default function ProductBatchCell({ batches }: Readonly<ProductBatchCellProps>) {
    const [open, setOpen] = useState(false)

    const today = new Date()

    const nearExpirationBatches = batches.filter((batch) => {
        const expirationDate = new Date(batch.expirationDate)
        const diffDays = (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        return diffDays <= 60 && diffDays >= 0
    })

    const hasWarning = nearExpirationBatches.length > 0
    const getExpirationBadge = (daysLeft: number) => {
        if (daysLeft < 0) {
            return {
                color: "bg-red-100 text-red-800",
                label: "Đã hết hạn",
            }
        }
        if (daysLeft === 0) {
            return {
                color: "bg-yellow-100 text-yellow-800",
                label: "Hết hạn hôm nay",
            }
        }
        if (daysLeft <= 7) {
            return {
                color: "bg-red-200 text-red-900",
                label: `${daysLeft} ngày`,
            }
        }
        if (daysLeft <= 15) {
            return {
                color: "bg-orange-200 text-orange-900",
                label: `${daysLeft} ngày`,
            }
        }
        if (daysLeft <= 30) {
            return {
                color: "bg-yellow-200 text-yellow-900",
                label: `${daysLeft} ngày`,
            }
        }
        if (daysLeft <= 60) {
            return {
                color: "bg-blue-100 text-blue-800",
                label: `${daysLeft} ngày`,
            }
        }
        return {
            color: "bg-gray-100 text-gray-800",
            label: `${daysLeft} ngày`,
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {hasWarning && (
                    <Button variant="ghost" className="flex justify-center items-center gap-1.5 h-auto p-1">
                        <span className="text-base text-red-500 w-5 h-5 flex items-center justify-center">
                            {nearExpirationBatches.length}
                        </span>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Danh sách lô</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã lô</TableHead>
                                <TableHead>Số lượng còn lại</TableHead>
                                <TableHead>Ngày hết hạn</TableHead>
                                <TableHead>Thời lượng</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batches.map((batch) => {
                                return (
                                    <TableRow key={batch.productBatchNumber}>
                                        <TableCell>{batch.productBatchNumber}</TableCell>
                                        <TableCell>{batch.quantity}</TableCell>
                                        <TableCell>{formatTimeVietNam(new Date(batch.expirationDate))}</TableCell>
                                        <TableCell>
                                            {(() => {
                                                const expirationDate = new Date(batch.expirationDate)
                                                const diffDays = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                                                return diffDays > 0 && <Badge className={`${getExpirationBadge(diffDays).color} px-3 py-1 mr-10`}>
                                                    {getExpirationBadge(diffDays).label}
                                                </Badge>
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
