"use client"

import { Skeleton } from '@/components/ui/skeleton'
import React, { useState } from 'react'
import { ApiResponse, PageResult } from '@/types/types';
import { formatTimeVietNam } from '@/lib/format-time-vietnam';
import { Button } from '@/components/ui/button';
import { Images, Pencil } from 'lucide-react';
import { FeedbackDialog } from '@/components/custom/_custom-dialog/feedback-dialog';
import ImagePreview from '@/components/custom/_custom-image/image-preview';

interface Feedback {
    id: string,
    orderItemId: string,
    productId: string,
    productName: string,
    variant: {
        type: string,
        weight: string,
        variantImage: string,
    }
    quantity: number,
    content: string,
    rating: number,
    images?: string[]
    createDate: string,
}
const FeedbackTab = () => {
    const feedbacks: Feedback[] = [
        {
            id: "1",
            productId: "P001",
            productName: "Product A",
            orderItemId: "312312"
            , variant: {
                type: "Size M",
                weight: "500g",
                variantImage: "https://nuts.com/images/rackcdn/ed910ae2d60f0d25bcb8-80550f96b5feb12604f4f720bfefb46d.ssl.cf1.rackcdn.com/a92bbd2b803dd598-2te3sYn--medium.jpg",
            },
            quantity: 1,
            content: "Great product! Really satisfied with the quality.",
            rating: 5,
            createDate: "2025-03-03T10:00:00Z",
        },
        {
            id: "2",
            productId: "P002",
            productName: "Product B",
            orderItemId: "312312"
            , variant: {
                type: "Size L",
                weight: "300g",
                variantImage: "https://nuts.com/images/rackcdn/ed910ae2d60f0d25bcb8-80550f96b5feb12604f4f720bfefb46d.ssl.cf1.rackcdn.com/a92bbd2b803dd598-2te3sYn--medium.jpg",
            },
            quantity: 2,
            content: "Good product, but the packaging could be improved.",
            rating: 4,
            createDate: "2025-03-02T15:30:00Z",
        },
        {
            id: "3",
            productId: "P003",
            productName: "Product C",
            orderItemId: "312312"
            , variant: {
                type: "Size S",
                weight: "200g",
                variantImage: "https://nuts.com/images/rackcdn/ed910ae2d60f0d25bcb8-80550f96b5feb12604f4f720bfefb46d.ssl.cf1.rackcdn.com/a92bbd2b803dd598-2te3sYn--medium.jpg",
            },
            quantity: 3,
            content: "Not as expected. The quality is below average.",
            rating: 2,
            createDate: "2025-03-01T12:15:00Z",
        },
        {
            id: "4",
            productId: "P004",
            productName: "Product D",
            orderItemId: "312312"
            , variant: {
                type: "Size XL",
                weight: "700g",
                variantImage: "https://nuts.com/images/rackcdn/ed910ae2d60f0d25bcb8-80550f96b5feb12604f4f720bfefb46d.ssl.cf1.rackcdn.com/a92bbd2b803dd598-2te3sYn--medium.jpg",
            },
            quantity: 1,
            content: "Excellent value for the price. Highly recommended!",
            rating: 5,
            createDate: "2025-02-28T18:00:00Z",
        },
        {
            id: "5",
            productId: "P005",
            productName: "Product E",
            orderItemId: "312312"
            , variant: {
                type: "Size M",
                weight: "400g",
                variantImage: "https://nuts.com/images/rackcdn/ed910ae2d60f0d25bcb8-80550f96b5feb12604f4f720bfefb46d.ssl.cf1.rackcdn.com/a92bbd2b803dd598-2te3sYn--medium.jpg",
            },
            quantity: 2,
            content: "Average experience. Could improve the delivery time.",
            rating: 3,
            createDate: "2025-02-25T08:45:00Z",
        },
    ];
    const isPending = false;
    const [feedback, setFeedback] = useState<Feedback | undefined>(undefined)
    return (
        <>
            {isPending ?
                Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index + 1}
                        className="p-4 flex justify-between items-center gap-6"
                    >
                        <Skeleton className='h-32 w-32 bg-white animate-pulse shadow-md' />
                        <Skeleton className='h-10 w-80 bg-white animate-pulse shadow-md' />
                        <Skeleton className='h-10 w-40 bg-white animate-pulse shadow-md' />
                        <Skeleton className='h-10 w-40 bg-white animate-pulse shadow-md' />
                    </div>
                ))
                :
                <div className="space-y-2">
                    <div className="hidden p-4 sm:grid grid-cols-1 md:grid-cols-6 lg:grid-cols-7 items-center gap-4 bg-white">
                        <div>
                            Ảnh sản phẩm
                        </div>
                        <div>
                            Tên sản phẩm
                        </div>
                        <div className="lg:col-span-2">
                            Nội dung
                        </div>
                        <div className='text-center'>
                            Số sao
                        </div>
                        <div className='text-center'>
                            Thời gian
                        </div>
                        <div>

                        </div>
                    </div>

                    {feedbacks?.map((feedback: Feedback, index) => (
                        <div
                            key={feedback.id}
                            className="p-4 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-7 items-center gap-4 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <p className='mx-auto md:ml-0'>
                                <ImagePreview
                                    images={[feedback.variant.variantImage, "/images/dried-fruit.webp"]}
                                    className="h-26 w-26 object-fill hover:cursor-pointer"
                                />
                            </p>
                            <p className="font-bold text-center md:text-left">{`${feedback.productName} ${feedback.variant.type} (số lượng ${feedback.quantity})`}</p>
                            <p className='md:col-span-2'>{feedback.content}</p>
                            <p className='text-center'>{feedback.rating} <span className="text-yellow-500">⭐</span></p>
                            <p className='text-center'>{formatTimeVietNam(new Date(feedback.createDate), true)}</p>
                            <p className='space-x-4 mx-auto'>
                                {feedback.images && (
                                    <ImagePreview
                                        iconButton={<Images />}
                                        images={feedback.images}
                                        className="h-26 w-26 object-fill hover:cursor-pointer"
                                    />
                                )}
                                <Button
                                    variant="outline"
                                    className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                    onClick={() => setFeedback(feedback)}
                                >
                                    <Pencil />
                                </Button>
                            </p>
                        </div>
                    ))}
                </div>
            }
            {feedback && <FeedbackDialog isOpen={feedback !== undefined} onClose={() => setFeedback(undefined)} />}
        </>

    )
}

export default FeedbackTab