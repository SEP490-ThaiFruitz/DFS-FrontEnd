"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation'

function NoData({ name }: Readonly<{ name: string }>) {
    const router = useRouter();
    const handleBackClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };
    return (
        <div className='flex flex-col justify-center items-center min-h-screen'>
            <Image height={400} width={400} src="/images/no-data.png" alt="no-data" />
            <div className='w-fit'>
                <div className='my-5 text-4xl font-black'> Oops, Không tìm thấy {name}</div>
            </div>
            <Button size='sm' onClick={handleBackClick}>
                <Undo2 className='mr-1' size={20} />
                Quay lại
            </Button>
        </div>
    )
}

export default NoData
