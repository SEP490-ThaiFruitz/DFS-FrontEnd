"use client"
import React from 'react'
import { BlogCategory } from '@/app/(admin)/admin/blog/category/page'
import Link from 'next/link'
import Image from 'next/image'
import { formatVND } from '@/lib/format-currency'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { ApiResponse } from '@/types/types'


interface BlogLayoutProps {
    children: React.ReactNode
}

function BlogLayout({ children }: Readonly<BlogLayoutProps>) {
    const { isPending, data: blogCategories } = useQuery<ApiResponse<BlogCategory[]>>({ queryKey: ["BlogCategories", "Guest"] })
    return (
        <div className="m-10">
            <div className="grid lg:grid-cols-4 gap-10">
                {children}
                <div className='grid gap-5 md:gap-10 md:grid-cols-2 lg:grid-cols-1 h-fit'>
                    <div className="p-6 rounded-xl border shadow-md">
                        <h3 className="text-lg font-bold mb-4">Loại bài viết</h3>
                        <p className='h-1 w-1/3 bg-green-400'></p>
                        <div className='mt-5 grid gap-5'>
                            {isPending ? [...Array(5)].map((_, index) => (
                                <Skeleton className='w-full h-10' key={index + 1} />
                            )) : blogCategories?.value?.map((blogCategory: BlogCategory) => (
                                <Link className='border rounded-md hover:bg-slate-50' key={blogCategory.id} href={`/blogs?category=${blogCategory.name}`}>
                                    <div className='flex px-3 py-2'>
                                        <p className='font-medium'>{blogCategory.name}</p>
                                        <p className='ml-auto'>{blogCategory.publishedQuantity}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className='p-6 rounded-xl border shadow-md'>
                        <h3 className="text-lg font-bold mb-4">Sản phẩm bán chạy</h3>
                        <p className='h-1 w-1/3 bg-green-400'></p>
                        <div className="mt-6 [&>div:not(:last-child)]:border-b-2">
                            <div
                                key={4}
                                className="p-4 flex items-center gap-6"
                            >
                                <Skeleton className='w-32 h-12' />
                                <div className='space-y-2'>
                                    <Skeleton className='w-32 h-4' />
                                    <Skeleton className='w-20 h-4' />
                                </div>
                            </div>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index + 1}
                                    className="p-4 flex items-center gap-6 hover:cursor-pointer hover:bg-slate-50"
                                >
                                    <Image
                                        src="/images/dried-fruit.webp"
                                        alt="Mít xấy"
                                        height={100}
                                        width={100}
                                        className="rounded-lg object-cover"
                                    />
                                    <div className='space-y-2'>
                                        <p className="text-lg font-semibold text-gray-800">Mít xấy</p>
                                        <p className="text-primary font-medium">{formatVND(400000)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogLayout