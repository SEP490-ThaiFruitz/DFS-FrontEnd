"use client"

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { HomeIcon, Undo2 } from 'lucide-react'


export default function NotFound() {
    const router = useRouter();
    const handleBackClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };
    return (
        <div className='bg-[#f3f4f6]'>
            <div className='lg:flex p-10 flex-row-reverse justify-center items-center min-h-screen'>
                <Image className='mx-auto' height={600} width={600} src="/images/error.svg" alt="error" />
                <div className='w-96 mx-auto'>
                    <div className='my-5 text-4xl font-black'> Oops, Không tìm thấy trang</div>
                    <div className='text-xl font-bold'>
                        Có vẻ có lỗi khi chuyển qua trang khác
                    </div>
                    <div className='my-5'>
                        Thật không may, có lỗi xảy ra và trang này không tồn tại. Hãy thử sử dụng chức năng tìm kiếm hoặc quay lại trang trước.
                    </div>
                    <div className="flex items-center justify-between">
                        <Button size="sm" variant={"outline"} className="flex items-center gap-2 px-4 py-2 font-bold" onClick={handleBackClick}>
                            <Undo2 size={22} />
                            <span>Quay lại</span>
                        </Button>
                        <Button size="sm" variant={"outline"} className="flex items-center gap-2 px-4 py-2 font-bold text-green-700 border-green-700" onClick={() => router.push("/")}>
                            <HomeIcon size={22} />
                            <span>Trang chủ</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}