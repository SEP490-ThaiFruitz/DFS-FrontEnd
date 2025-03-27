"use client"
import Timeline, { TimelineEvent } from '@/components/global-components/timeline/timeline'
import { ArrowLeft, FileText, Package, Truck, Wallet } from 'lucide-react'
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
    timeline: Timeline[]
}

interface Timeline {
    status: string,
    date: string,
    details: SubTimeline[]
}

interface SubTimeline {
    statusTime: string,
    detailStatus: string,
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
            completed: true,
        },
        {
            icon: Wallet,
            title: "Đã Xác Nhận Thông Tin Thanh Toán",
            completed: false
        },
        {
            icon: Truck,
            title: "Đang Vận Chuyển",
            completed: false,
        },
        {
            icon: Package,
            title: "Đã Nhận Được Hàng",
            completed: false,
        }
    ]

    const OrderCreated = order?.value?.timeline.find((timeline: Timeline) =>
        timeline.details.find((detail: SubTimeline) => detail.detailStatus === "order_created")
    );

    if (OrderCreated) {
        const orderStep = steps.find(step => step.title === "Đơn Hàng Đã Đặt");
        if (orderStep) {
            const subTimeline = OrderCreated.details.find((detail: SubTimeline) => detail.detailStatus === "order_created")
            orderStep.completed = true;
            orderStep.date = subTimeline?.statusTime
        }
    }
    const OrderPayment = order?.value?.timeline.find((timeline: Timeline) =>
        timeline.details.find((detail: SubTimeline) => detail.detailStatus === "payment_received")
    );

    if (OrderPayment) {
        const orderStep = steps.find(step => step.title === "Đã Xác Nhận Thông Tin Thanh Toán");
        if (orderStep) {
            const subTimeline = OrderPayment.details.find((detail: SubTimeline) => detail.detailStatus === "payment_received")
            orderStep.completed = true;
            orderStep.date = subTimeline?.statusTime
        }
    }


    const OrderDelivery = order?.value?.timeline.find((timeline: Timeline) =>
        timeline.details.find((detail: SubTimeline) => detail.detailStatus === "transporting")
    );

    if (OrderDelivery) {
        const orderStep = steps.find(step => step.title === "Đang Vận Chuyển");
        if (orderStep) {
            const subTimeline = OrderDelivery.details.find((detail: SubTimeline) => detail.detailStatus === "transporting")
            orderStep.completed = true;
            orderStep.date = subTimeline?.statusTime
        }
    }


    const OrderDelivered = order?.value?.timeline.find((timeline: Timeline) =>
        timeline.details.find((detail: SubTimeline) => detail.detailStatus === "delivered")
    );

    if (OrderDelivered) {
        const orderStep = steps.find(step => step.title === "Đã Nhận Được Hàng");
        if (orderStep) {
            const subTimeline = OrderDelivered.details.find((detail: SubTimeline) => detail.detailStatus === "delivered")
            orderStep.completed = true;
            orderStep.date = subTimeline?.statusTime
        }
    }


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
                <Timeline events={steps} orientation="Horizontal" classNameIcon="h-5 w-5" showIcon={true} />
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
                        orderAddressDelivery={order?.value?.orderAddressDelivery} 
                        timeline={order?.value?.timeline}/>
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
                    />
                </div>
            </div>
        </div>

    )
}

export default OrderDetailPage