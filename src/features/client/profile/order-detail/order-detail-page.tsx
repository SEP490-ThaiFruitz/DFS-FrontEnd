"use client"
import Timeline, { TimelineEvent } from '@/components/global-components/timeline/timeline'
import { ArrowLeft, DollarSign, Download, FileText, Package, Star, Truck, Wallet } from 'lucide-react'
import React from 'react'
import OrderDetailInformation from './order-detail-information'
import OrderDetaiSummary from './order-detail-summary'
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { ApiResponse } from '@/types/types'
import { OrderAddressDelivery } from '../order-tracking/shipping-info'

interface Order {
    orderId: string;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    buyDate: string;
    orderItems: OrderItem[];
    delivery: Delivery;
    voucherPrice: number | null;
    pointUsed: number;
    totalPrice: number,
    cancel: Cancel | null;
    orderAddressDelivery: OrderAddressDelivery;
}

interface Cancel {
    cancelBy: string,
    date: string,
    reason: string
}

interface OrderItem {
    id: string;
    referenceId: string;
    name: string;
    image: string;
    itemType: string;
    quantity: number;
    unitPrice: number;
    percentage: number;
    discountPrice: number;
    isCanFeedback: boolean;
}

interface Delivery {
    fee: number;
    estimateDate: string;
}

interface OrderDetailPageProps {
    orderId: string,
    onBack: () => void,
}

const OrderDetailPage = ({ orderId, onBack }: Readonly<OrderDetailPageProps>) => {
    const { data: order, isPending } = useFetch<ApiResponse<Order>>(`/Orders/${orderId}`, ["OrderDetail", orderId])

    const steps: TimelineEvent[] = [
        {
            icon: FileText,
            title: "Đơn Hàng Đã Đặt",
            date: "19:47 23-02-2025",
            completed: true,
            subEvents: [
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                }, {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                }, {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                }, {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                }, {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
            ]
        },
        {
            icon: Wallet,
            title: "Đã Xác Nhận Thông Tin Thanh Toán",
            date: "20:18 23-02-2025",
            completed: true,
            subEvents: [
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                }, {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                }, {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                }, {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                }, {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
                {
                    title: "Đơn Hàng Đã Đặt",
                    date: "19:47 23-02-2025",
                },
            ]
        },
        {
            icon: Truck,
            title: "Đã Giao Cho ĐVVC",
            date: "10:24 24-02-2025",
            completed: false,
        },
        {
            icon: Package,
            title: "Đã Nhận Được Hàng",
            date: "12:06 25-02-2025",
            completed: false,
        }
    ]
    return (

        <div className="py-10">
            <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10 border rounded-lg shadow-sm">
                <button 
                    onClick={onBack}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </button>
                <h1 className="text-lg font-semibold">
                    Mã đơn hàng: <span className="text-primary">{order?.value?.orderId}</span>
                </h1>
                <div></div>
            </div>
            <div className="my-20 border rounded-lg shadow-sm overflow-hidden">
                <Timeline events={steps} orientation="Horizontal" classNameTimelinePositon="left-0 right-0 md:mx-20 h-0.5 top-8" classNameTimeline="h-16 w-16" classNameIcon="h-5 w-5" showIcon={true} />
            </div>
            <div className='grid xl:grid-cols-3 gap-5 sm:gap-16'>
                <div className='col-span-1 space-y-10'>
                    <OrderDetailInformation
                        orderDate={order?.value?.buyDate}
                        orderId={order?.value?.orderId}
                        paymentMethod={order?.value?.paymentMethod}
                        orderStatus={order?.value?.orderStatus}
                        paymentStatus={order?.value?.paymentStatus}
                        cancel={order?.value?.cancel ?? null}
                        delivery={order?.value?.delivery}
                        orderAddressDelivery={order?.value?.orderAddressDelivery} />
                </div>
                <div className='xl:col-span-2'>
                    <OrderDetaiSummary
                        orderStatus={order?.value?.orderStatus ?? ""}
                        feePrice={order?.value?.delivery.fee ?? 0}
                        orderItems={order?.value?.orderItems ?? []}
                        shipCode={order?.value?.paymentMethod === "COD"}
                        totalPrice={order?.value?.totalPrice ?? 0}
                        usedPoint={order?.value?.pointUsed ?? 0}
                        voucherPrice={order?.value?.voucherPrice ?? null}
                    />
                </div>
            </div>
        </div>

    )
}

export default OrderDetailPage