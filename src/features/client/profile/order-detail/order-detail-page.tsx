"use client"
import Timeline, { TimelineEvent } from '@/components/global-components/timeline/timeline'
import { ArrowLeft, DollarSign, Download, FileText, Star, Truck } from 'lucide-react'
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
    role: string,
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
    isFeedback: boolean;
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
            icon: DollarSign,
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
            completed: true,
        },
        {
            icon: Download,
            title: "Đã Nhận Được Hàng",
            date: "12:06 25-02-2025",
            completed: true,
        },
        {
            icon: Star,
            title: "Đơn Hàng Đã Được Đánh Giá",
            date: "18:57 05-03-2025",
            completed: false,
        },
    ]
    return (

        <div className="py-10">
            <div className="flex items-center bg-white">
                <button onClick={onBack} className="h-fit py-3 px-2 rounded-md flex items-center gap-2 hover:bg-slate-50">
                    <ArrowLeft />
                    <p className="w-fit text-nowrap">Quay lại</p>
                </button>
                <p className="w-full text-center font-bold text-xl">Mã đơn hàng: {order?.value?.orderId}</p>
            </div>
            <div className="my-20 rounded-md">
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