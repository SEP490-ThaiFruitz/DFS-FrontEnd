"use client"
import { ViewCardProduct } from '@/components/global-components/card/view-card-product'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from '@/components/ui/separator';
import { formatVND } from '@/lib/format-currency';
import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { OrderItem } from '../order-tracking/product-list';



interface OrderDetaiSummaryProps {
    totalPrice: number,
    feePrice: number,
    voucherPrice: number | null,
    usedPoint: number,
    orderItems: OrderItem[],
    shipCode: boolean,
    orderStatus: string,
}
const OrderDetaiSummary = ({ orderItems, totalPrice, feePrice, usedPoint, voucherPrice, shipCode, orderStatus }: Readonly<OrderDetaiSummaryProps>) => {
    const price = orderItems.reduce((total: number, item: OrderItem) =>
        total + ((item.discountPrice ?? item.unitPrice) * item.quantity),
        0);
    return (
        <div className='flex flex-col-reverse lg:flex-col gap-10'>
            <Card className="top-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Thông tin thanh toán
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Số tiền hàng:</span>
                        <span className="text-gray-900 font-semibold">{formatVND(price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Phí vận chuyển:</span>
                        <span className="text-gray-900">{`${formatVND(feePrice)}`}</span>
                    </div>
                    {voucherPrice && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-semibold">Số mã giảm giá:</span>
                            <span className="text-gray-900">{`- ${formatVND(voucherPrice)}`}</span>
                        </div>
                    )}
                    {usedPoint > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-semibold">Số điểm:</span>
                            <span className="text-gray-900">{`- ${formatVND(usedPoint)}`}</span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className='text-gray-900 font-semibold'>Tổng tiền:</span>
                        <span className='text-gray-900 font-semibold'>{formatVND(totalPrice)}</span>
                    </div>
                    {shipCode && (
                        <div className='flex items-center space-x-2'>
                            <p className='text-red-500'>(*)</p>
                            <p className='text-muted-foreground'>{`Vui lòng chuẩn bị ${formatVND(totalPrice)} thanh toán khi nhận hàng`}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="top-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6" />
                        Chi tiết đơn hàng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="max-h-fit overflow-auto">
                        <div className='mr-5'>
                            {orderItems.map((item: OrderItem) => (
                                <ViewCardProduct
                                    key={item.referenceId}
                                    orderItemId={item.id}
                                    productName={item.name}
                                    isFeedback={item.isFeedback}
                                    orderStatus={orderStatus}
                                    productPrice={item.unitPrice}
                                    productQuantity={item.quantity}
                                    productImage={item.image}
                                    productPercentage={item.percentage}
                                    productDiscountPrice={item.discountPrice}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderDetaiSummary