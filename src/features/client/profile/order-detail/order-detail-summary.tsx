"use client"
import { ViewCardProduct } from '@/components/global-components/card/view-card-product'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from '@/components/ui/separator';
import { formatVND } from '@/lib/format-currency';
import { ShoppingCart } from 'lucide-react'
import React from 'react'

const OrderDetaiSummary = () => {
    const cartItems: any[] = [
        {
            id: 1,
            name: "Dried Mango Slices gói 500g",
            price: 12.99,
            quantity: 2,
            image: "/images/third-background.png",
        },
        {
            id: 2,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        },
        {
            id: 3,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        },
        {
            id: 4,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        },
        {
            id: 5,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        },
        {
            id: 6,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        },
        {
            id: 7,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        }, {
            id: 7,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        },
        {
            id: 7,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        },
        {
            id: 7,
            name: "Mixed Dried Berries",
            price: 15.99,
            quantity: 1,
            image: "/images/third-background.png",
        },
    ];
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
                        <span className="text-gray-900 font-semibold">{formatVND(2000000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Phí vận chuyển:</span>
                        <span className="text-gray-900">{`${formatVND(20000)}`}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Số mã giảm giá:</span>
                        <span className="text-gray-900">{`- ${formatVND(2000)} (20%)`}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Số điểm:</span>
                        <span className="text-gray-900">{`- ${formatVND(100)} (100 điểm)`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className='text-gray-900 font-semibold'>Tổng tiền:</span>
                        <span className='text-gray-900 font-semibold'>{formatVND(2000000)}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <p className='text-red-500'>(*)</p>
                        <p className='text-muted-foreground'>{`Vui lòng chuẩn bị ${formatVND(2000000)} thanh toán khi nhận hàng`}</p>
                    </div>
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
                            {cartItems.map((item) => (
                                <ViewCardProduct
                                    key={item.id}
                                    productImage={item.image}
                                    productName={item.name}
                                    productPrice={item.price}
                                    productQuantity={item.quantity}
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