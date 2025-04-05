"use client"
import Timeline, { TimelineEvent } from '@/components/global-components/timeline/timeline'
import { ArrowLeft, Copy, FileText, Package, PackageX, Send, Truck, Wallet } from 'lucide-react'
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
    price: number;
    totalPrice: number,
    cancel: Cancel | null;
    orderAddressDelivery: OrderAddressDelivery;
    timeline: Timeline[]
}

interface Timeline {
    status: string,
    date: string,
    details: SubTimeline[]
}

interface SubTimeline {
    statusTime: string,
    content: string
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
    estimateDate: string | null;
}

interface OrderDetailPageProps {
    orderId: string,
    onBack: () => void,
}

const OrderDetailPage = ({ orderId, onBack }: Readonly<OrderDetailPageProps>) => {
    const { data: order, isPending } = useFetch<ApiResponse<Order>>(`/Orders/${orderId}`, ["OrderDetail", orderId])
    const timelineSteps = [
        {
            icon: FileText,
            title: "Đơn Hàng Đã Đặt",
            condition: (t: Timeline) => t.status === "Đơn hàng đã được tạo"
        },
        {
            icon: Wallet,
            title: "Đã Xác Nhận Thông Tin",
            condition: (t: Timeline) => t.details?.some((d: SubTimeline) => d.content === "Đã xác nhận thông tin thanh toán.")
        },
        {
            icon: PackageX,
            title: "Đã hủy",
            condition: (t: Timeline) => t.status === "Đã hủy"
        },
        {
            icon: Truck,
            title: "Đang Vận Chuyển",
            condition: (t: Timeline) => t.status === "Đang vận chuyển"
        },
        {
            icon: Send,
            title: "Đang Giao Hàng",
            condition: (t: Timeline) => t.status === "Đang giao hàng"
        },
        {
            icon: Package,
            title: "Đã Nhận Được Hàng",
            condition: (t: Timeline) => t.details?.some((d: SubTimeline) => d.content === "delivered")
        },
        {
            icon: Copy,
            title: "Đã trả hàng",
            condition: (t: Timeline) => t.status === "Đã trả hàng"
        },
    ];
    
    const steps: TimelineEvent[] = [];

    timelineSteps.forEach(({ icon, title, condition }) => {
        const matched = order?.value?.timeline.find(condition);
        if (matched) {
            steps.push({
                icon,
                title,
                completed: true,
                date: matched.date,
            });
        }
    });
    // const orderCreated = order?.value?.timeline.find((timeline: Timeline) =>
    //     timeline.status === "Đơn hàng đã được tạo"
    // );

    // if (orderCreated) {
    //     steps.push({
    //         icon: FileText,
    //         title: "Đơn Hàng Đã Đặt",
    //         completed: true,
    //         date: orderCreated.date
    //     })
    // }
    // const orderPayment = order?.value?.timeline.find((timeline: Timeline) =>
    //     timeline.details.find((detail: SubTimeline) => detail.content === "Đã xác nhận thông tin thanh toán.")
    // );

    // if (orderPayment) {
    //     steps.push({
    //         icon: Wallet,
    //         title: "Đã Xác Nhận Thông Tin",
    //         completed: true,
    //         date: orderPayment.date
    //     })
    // }

    // const orderCancel = order?.value?.timeline.find((timeline: Timeline) =>
    //     timeline.status === "Đã hủy"
    // );
    // if (orderCancel) {
    //     steps.push({
    //         icon: PackageX,
    //         title: "Đã hủy",
    //         completed: true,
    //         date: orderCancel.date
    //     })
    // }

    // const orderDelivery = order?.value?.timeline.find((timeline: Timeline) =>
    //     timeline.status === "Đang vận chuyển"
    // );

    // if (orderDelivery) {
    //     steps.push({
    //         icon: Truck,
    //         title: "Đang Vận Chuyển",
    //         completed: true,
    //         date: orderDelivery.date
    //     })
    // }


    // const orderDelivering = order?.value?.timeline.find((timeline: Timeline) =>
    //     timeline.status === "Đang giao hàng"
    // );

    // if (orderDelivering) {
    //     steps.push({
    //         icon: Send,
    //         title: "Đang Giao Hàng",
    //         completed: true,
    //         date: orderDelivering.date
    //     })
    // }


    // const orderDelivered = order?.value?.timeline.find((timeline: Timeline) =>
    //     timeline.details.find((detail: SubTimeline) => detail.content === "delivered")
    // );

    // if (orderDelivered) {
    //     steps.push({
    //         icon: Package,
    //         title: "Đã Nhận Được Hàng",
    //         completed: true,
    //         date: orderDelivered.date
    //     })
    // }

    // const orderReturned = order?.value?.timeline.find((timeline: Timeline) =>
    //     timeline.status === "Đã trả hàng"
    // );

    // if (orderReturned) {
    //     steps.push({
    //         icon: Copy,
    //         title: "Đã trả hàng",
    //         completed: true,
    //         date: orderReturned.date
    //     })
    // }


    return (
        <div>
            <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10 border shadow-sm cardStyle">
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
            <div className="my-4 border cardStyle shadow-sm overflow-hidden">
                <Timeline events={steps} orientation="Horizontal" classNameIcon="h-5 w-5" showIcon={true} />
            </div>
            <div className='grid xl:grid-cols-3 gap-5 sm:gap-8'>
                <div className='col-span-1'>
                    <OrderDetailInformation
                        orderDate={order?.value?.buyDate}
                        orderId={order?.value?.orderId}
                        paymentMethod={order?.value?.paymentMethod}
                        orderStatus={order?.value?.orderStatus}
                        paymentStatus={order?.value?.paymentStatus}
                        cancel={order?.value?.cancel ?? null}
                        delivery={order?.value?.delivery}
                        orderAddressDelivery={order?.value?.orderAddressDelivery}
                        timeline={order?.value?.timeline} />
                </div>
                <div className='xl:col-span-2'>
                    <OrderDetaiSummary
                        orderStatus={order?.value?.orderStatus ?? ""}
                        feePrice={order?.value?.delivery.fee ?? 0}
                        orderItems={order?.value?.orderItems ?? []}
                        shipCode={order?.value?.paymentMethod === "ShipCode"}
                        totalPrice={order?.value?.totalPrice ?? 0}
                        usedPoint={order?.value?.pointUsed ?? 0}
                        voucherPrice={order?.value?.voucherPrice ?? null}
                        price={order?.value?.price ?? 0}
                    />
                </div>
            </div>
        </div>

    )
}

export default OrderDetailPage