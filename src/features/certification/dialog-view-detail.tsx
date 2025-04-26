"use client"

import { Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import ImagePreview from '@/components/custom/_custom-image/image-preview'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { ApiResponse, Profile } from '@/types/types'
import { USER_KEY } from '@/app/key/user-key'

export interface Certification {
    id: number
    name: string
    image: string
    agency: string
    issueDate: Date
    expiryDate: Date | null
    details: string
    products: Product[]
}

interface Product {
    id: string
    name: string
    image: string
}

interface CertificationDialogProps {
    certification: Certification
    isOpen: boolean
    onClose: () => void
}

export function CertificationDialog({ certification, isOpen, onClose }: Readonly<CertificationDialogProps>) {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<ApiResponse<Profile>>([USER_KEY.PROFILE])
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[460px] md:min-w-[800px] max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Chi tiết chứng chỉ
                    </DialogTitle>
                </DialogHeader>
                <div className='grid md:grid-cols-2 gap-10'>
                    <div className="pb-4 border-b">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="w-full md:w-1/3 aspect-square max-w-[200px] rounded-md overflow-hidden border">
                                {certification.image && (
                                    <ImagePreview
                                        images={[certification.image]}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                <h3 className="text-lg font-medium">{certification.name}</h3>

                                <div className="grid grid-cols-[80px_1fr] items-center gap-1 text-sm">
                                    <span className="font-medium">Cơ quan:</span>
                                    <span>{certification.agency}</span>
                                </div>

                                <div className="grid grid-cols-[80px_1fr] items-center gap-1 text-sm">
                                    <span className="font-medium">Ngày cấp:</span>
                                    <span>{formatTimeVietNam(certification.issueDate)}</span>

                                </div>

                                {certification.expiryDate && (
                                    <div className="grid grid-cols-[80px_1fr] items-center gap-1 text-sm">
                                        <span className="font-medium">Hết hạn:</span>
                                        <span>{formatTimeVietNam(certification.expiryDate)}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-[80px_1fr] items-start gap-1 text-sm pt-1">
                                    <span className="font-medium">Mô tả:</span>
                                    <div>{certification.details}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="py-2">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Sản phẩm được chứng nhận ({certification.products.length})
                            </h4>
                        </div>

                        <ScrollArea className="w-full max-h-[400px] pr-4">
                            <div className="space-y-4 pb-2">
                                {certification.products.map((product) => (
                                    <Card key={product.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="h-48 sm:h-32 sm:w-48 bg-muted/20 relative">
                                                    <ImagePreview
                                                        images={[product.image]}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <Link href={user?.value?.role === 'Administrator'
                                                    ? `/admin/product/${product.id}`
                                                    : `/manager/product/${product.id}`} className='w-full'>
                                                    <div className="flex items-center justify-center font-bold text-2xl h-full">
                                                        <div className='py-10'>
                                                            {product.name}
                                                        </div>
                                                    </div>
                                                </Link>

                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Thoát
                    </Button>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )
}
