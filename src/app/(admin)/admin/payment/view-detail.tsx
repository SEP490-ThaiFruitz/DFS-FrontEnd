import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ApiResponse } from '@/types/types'
import React from 'react'
import { toast } from 'sonner'

interface ViewDetailProps {
    orderId: string,
    paymentMethod: string,
    isOpen: boolean,
    onClose: () => void
}

const ViewDetail = ({
    orderId,
    paymentMethod,
    isOpen,
    onClose,
}: Readonly<ViewDetailProps>) => {
    const { data: information } = useFetch<ApiResponse<string>>(`/Payments/transaction/${orderId}`, ["transaction", orderId])
    let transactionInfo: any = null
    if (information?.value) {
        try {
            transactionInfo = JSON.parse(information.value)
        } catch (error) {
            console.error("Lỗi parse JSON", error)
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Thông tin thanh toán {paymentMethod}</DialogTitle>
                </DialogHeader>
                {paymentMethod === "VnPay" && transactionInfo ? (
                    <div className="space-y-2">
                        <p><strong>Mã giao dịch:</strong> {transactionInfo.vnp_TxnRef}</p>
                        <p><strong>Mã phản hồi:</strong> {transactionInfo.vnp_ResponseCode}</p>
                        <p><strong>Thông báo:</strong> {transactionInfo.vnp_Message}</p>
                        <p><strong>Mã bảo mật:</strong> {transactionInfo.vnp_SecureHash}</p>
                    </div>
                ) : (
                    <p>Không có dữ liệu giao dịch.</p>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ViewDetail