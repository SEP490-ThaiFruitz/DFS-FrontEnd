"use client"
import Timeline, { TimelineEvent } from '@/components/global-components/timeline/timeline'
import { ArrowLeft, DollarSign, Download, FileText, Star, Truck } from 'lucide-react'
import React from 'react'
import OrderDetailInformation from './order-detail-information'
import OrderDetaiSummary from './order-detail-summary'

const OrderDetailPage = () => {
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
            {/* <div className="flex items-center bg-white">
                <button className="h-fit py-3 px-2 rounded-md flex items-center gap-2 hover:bg-slate-50">
                    <ArrowLeft />
                    <p className="w-fit text-nowrap">Quay lại</p>
                </button>
            </div> */}
            <p className="w-full text-center font-bold text-xl">Order OD CXVADAS1231231231445</p>
            <div className="my-20 rounded-md">
                <Timeline events={steps} orientation="Horizontal" classNameTimelinePositon="left-0 right-0 md:mx-20 h-0.5 top-8" classNameTimeline="h-16 w-16" classNameIcon="h-5 w-5" showIcon={true} />
            </div>
            <div className='grid xl:grid-cols-3 gap-5 sm:gap-16'>
                <div className='col-span-1 space-y-10'>
                    <OrderDetailInformation />
                </div>
                <div className='xl:col-span-2'>
                    <OrderDetaiSummary />
                </div>
            </div>
        </div>

    )
}

export default OrderDetailPage