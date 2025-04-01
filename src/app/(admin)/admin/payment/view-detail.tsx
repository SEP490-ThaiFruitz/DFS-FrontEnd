'use client'

import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ApiResponse } from '@/types/types'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatVND } from '@/lib/format-currency'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'

interface PayOsInfo {
    _id: string
    orderCode: number
    amount: number
    amountPaid: number
    amountRemaining: number
    status: string
    createdAt: Date
    transactions: {
        reference: string
        amount: number
        accountNumber: string
        description: string
        transactionDateTime: Date
        virtualAccountName: string | null
        virtualAccountNumber: string | null
        counterAccountBankId: string
        counterAccountBankName: string | null
        counterAccountName: string | null
        counterAccountNumber: string
    }[]
    canceledAt: Date | null
    cancellationReason: string | null
}

interface VnPayInfo {
    vnp_ResponseId: string
    vnp_Command: string
    vnp_ResponseCode: string
    vnp_Message: string
    vnp_TmnCode: string
    vnp_TxnRef: string
    vnp_Amount: string
    vnp_OrderInfo: string
    vnp_BankCode: string
    vnp_PayDate: string
    vnp_TransactionNo: string
    vnp_TransactionType: string
    vnp_TransactionStatus: string
    vnp_SecureHash: string
}

interface ViewDetailProps {
    transactionNo: string
    paymentMethod: string
    isOpen: boolean
    onClose: () => void
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'PAID':
            return <Badge className="bg-green-500">Đã thanh toán</Badge>
        case 'PENDING':
            return <Badge className="bg-yellow-500">Đang xử lý</Badge>
        case 'CANCELED':
            return <Badge className="bg-red-500">Đã hủy</Badge>
        default:
            return <Badge className="bg-gray-500">{status}</Badge>
    }
}

const ViewDetail = ({
    transactionNo,
    paymentMethod,
    isOpen,
    onClose,
}: Readonly<ViewDetailProps>) => {
    const { data: information, isLoading } = useFetch<ApiResponse<string>>(
        `/Payments/transaction/${transactionNo}`,
        ["transaction", transactionNo],
        {
            staleTime: 60000,
            cacheTime: 120000,
        }
    )

    let transactionInfo: PayOsInfo | VnPayInfo | null = null
    if (information?.value) {
        try {
            transactionInfo = JSON.parse(information.value)
            if (paymentMethod === "VnPay") {
                transactionInfo = JSON.parse(JSON.parse(information.value))
                console.log("date", transactionInfo);
            }
        } catch (error) {
            console.error("Lỗi parse JSON", error)
        }
    }

    function parsePaymentDate(dateString: string): Date | null {
        const regex = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
        const match = dateString.match(regex);

        if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const day = parseInt(match[3]);
            const hour = parseInt(match[4]);
            const minute = parseInt(match[5]);
            const second = parseInt(match[6]);

            return new Date(year, month, day, hour, minute, second);
        } else {
            console.error("Invalid date format");
            return null;
        }
    }


    const renderPayOsInfo = (info: PayOsInfo) => {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Mã đơn hàng</div>
                        <div className="text-lg font-semibold">{info.orderCode}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Trạng thái</div>
                        <div>{getStatusBadge(info.status)}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Tổng tiền</div>
                        <div className="text-lg font-semibold">{formatVND(info.amount)}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Đã thanh toán</div>
                        <div className="text-lg font-semibold">{formatVND(info.amountPaid)}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Còn lại</div>
                        <div className="text-lg font-semibold">{formatVND(info.amountRemaining)}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Ngày tạo</div>
                        <div className="text-lg font-semibold">{formatTimeVietNam(info.createdAt, true)}</div>
                    </div>
                </div>

                {info.canceledAt && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-red-700 text-base">Thông tin hủy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Ngày hủy</div>
                                    <div className="text-base">{formatTimeVietNam(info.canceledAt, true)}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Lý do hủy</div>
                                    <div className="text-base">{info.cancellationReason ?? "Không có"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div>
                    <h3 className="text-lg font-semibold mb-3">Lịch sử giao dịch</h3>
                    {info.transactions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã tham chiếu</TableHead>
                                    <TableHead>Số tiền</TableHead>
                                    <TableHead>Thời gian</TableHead>
                                    <TableHead>Ngân hàng</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {info.transactions.map((transaction, index) => (
                                    <TableRow key={index + 1}>
                                        <TableCell className="font-medium">{transaction.reference}</TableCell>
                                        <TableCell>{formatVND(transaction.amount)}</TableCell>
                                        <TableCell>{formatTimeVietNam(transaction.transactionDateTime, true)}</TableCell>
                                        <TableCell>{transaction.counterAccountBankName ?? transaction.counterAccountBankId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-muted-foreground italic">Chưa có giao dịch nào</div>
                    )}
                </div>
            </div>
        )
    }

    const renderVnPayInfo = (info: VnPayInfo) => {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Mã giao dịch</div>
                        <div className="text-lg font-semibold">{info.vnp_TxnRef}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Mã ngân hàng</div>
                        <div className="text-lg font-semibold">{info.vnp_BankCode}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Số tiền</div>
                        <div className="text-lg font-semibold">{formatVND(parseInt(info.vnp_Amount) / 100)}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Ngày thanh toán</div>
                        <div className="text-lg font-semibold">
                            {info.vnp_PayDate ? formatTimeVietNam(parsePaymentDate(info.vnp_PayDate) ?? new Date(), true) : "N/A"}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Trạng thái</div>
                        <div>
                            {info.vnp_TransactionStatus === "00" ? (
                                <Badge className="bg-green-500">Thành công</Badge>
                            ) : (
                                <Badge className="bg-red-500">Thất bại</Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Thông tin bổ sung</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Mã đơn hàng</div>
                            <div className="text-base">{info.vnp_OrderInfo}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Mã giao dịch VNPay</div>
                            <div className="text-base">{info.vnp_TransactionNo}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Mã Terminal</div>
                            <div className="text-base">{info.vnp_TmnCode}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Thông báo</div>
                            <div className="text-base">{info.vnp_Message}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Đang tải thông tin...</span>
                </div>
            )
        }

        if (!transactionInfo) {
            return (
                <div className="text-center py-8">
                    <div className="text-muted-foreground">Không tìm thấy thông tin giao dịch hoặc có lỗi xảy ra</div>
                </div>
            )
        }

        if (paymentMethod === 'PayOs') {
            return renderPayOsInfo(transactionInfo as PayOsInfo)
        } else if (paymentMethod === 'VnPay') {
            return renderVnPayInfo(transactionInfo as VnPayInfo)
        } else {
            return (
                <div className="text-center py-8">
                    <div className="text-muted-foreground">Phương thức thanh toán không được hỗ trợ</div>
                </div>
            )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Thông tin thanh toán {paymentMethod}
                    </DialogTitle>
                </DialogHeader>
                <Separator />
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewDetail
