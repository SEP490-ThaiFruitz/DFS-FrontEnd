"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageOff } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { Blog } from '../page'
import Image from 'next/image'
import { ApiResponse } from '@/types/types'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import NoData from '@/components/custom/_custom-no-data/no-data'

function BlogDetailPage() {
    const { id } = useParams()
    const { data: blog } = useFetch<ApiResponse<Blog>>(`/Blogs/${id}`)
    return (
        <>
            {blog?.value ? <div className='m-10 space-y-10'>
                <Card>
                    <CardHeader className='border-b-2'>
                        <CardTitle>Thông tin bài viết</CardTitle>
                    </CardHeader>
                    <CardContent className='my-5 sm:mx-8 grid lg:grid-cols-2 gap-20'>
                        <div className='border shadow-md rounded-xl h-full'>
                            {blog?.value?.thumbnail ?
                                <Image className='max-h-80 w-full p-2 object-cover' src={"https://res.cloudinary.com/deojypwtl/image/upload/v1737471584/" + blog?.value?.thumbnail} height={100} width={100} alt='image' />
                                : <div className="h-full text-gray-500 w-full flex items-center justify-center text-center text-xl font-semibold">
                                    <div className='flex space-x-5'>
                                        <ImageOff />
                                        <p>Không có ảnh</p>
                                    </div>
                                </div>}
                        </div>
                        <div className="space-y-7">
                            <div className="grid grid-cols-2">
                                <p className="font-semibold text-gray-600">Tên:</p>
                                <p className="text-gray-800">{blog?.value?.title}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-semibold text-gray-600">Người đăng:</p>
                                <p className="text-gray-800">{blog?.value?.user?.name}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-semibold text-gray-600">Loại bài viết:</p>
                                <p className="text-gray-800">{blog?.value?.blogCategory?.name}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-semibold text-gray-600">Ngày tạo:</p>
                                <p className="text-gray-800">{formatTimeVietNam(new Date(blog!.value!.createdOnUtc))}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-semibold text-gray-600">Ngày sửa:</p>
                                <p className="text-gray-800">{formatTimeVietNam(new Date(blog!.value!.modifiedOnUtc))}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='border-b-2'>
                        <CardTitle>Nội dung</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='my-5' dangerouslySetInnerHTML={{ __html: blog?.value?.content }} />
                    </CardContent>
                </Card>
            </div > : <NoData name='bài viết' />
            }
        </>
    )
}

export default BlogDetailPage