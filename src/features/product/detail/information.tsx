"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import React, { useState } from 'react'
import Image from 'next/image'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import FormInformation from './form-information'
import { Badge } from '@/components/ui/badge'
import { Category, Product } from './detail-product'

interface InformationProps {
  product: Product | null
}


const Information = ({ product }: Readonly<InformationProps>) => {
  const [isEditing, setIsEditing] = useState(false)

  const dryingMethods = [
    { id: "SunDrying", name: "Sấy bằng ánh nắng mặt trời" },
    { id: "HotAirDrying", name: "Sấy bằng không khí nóng" },
    { id: "FreezeDrying", name: "Sấy đông khô" },
    { id: "MicrowaveDrying", name: "Sấy bằng sóng vi ba" },
    { id: "VacuumDrying", name: "Sấy theo phương pháp chân không" },
    { id: "InfraredDrying", name: "Sấy bằng bức xạ hồng ngoại" },
    { id: "DrumDrying", name: "Sấy trong máy trống" }
  ];

  return (
    <TabsContent value="information">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b-2">
          <CardTitle>Thông tin sản phẩm</CardTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </CardHeader>
        <CardContent className='p-5'>
          {isEditing ? <FormInformation product={product ?? null} onClose={() => setIsEditing(false)} /> : <div className='grid md:grid-cols-2 gap-20'>
            <div className='space-y-5'>
              <div className="flex items-center space-x-2">
                <div className="font-bold">Tên sản phẩm:</div>
                <div className="text-base">{product?.name}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="font-bold">Xuất xứ:</div>
                <div className="text-base">{product?.origin}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="font-bold">Độ ẩm:</div>
                <div className="text-base">{product?.moistureContent} %</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="font-bold">Phương pháp sấy:</div>
                <div className="text-base">{dryingMethods.find(x => x.id === product?.dryingMethod)?.name}</div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="font-bold min-w-32">Loại sản phẩm:</div>
                <div className="text-base">{product?.categories?.map((category: Category) => category.name).join(", ")}</div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="font-bold">Tags:</div>
                <div className="text-base space-x-2">{product?.tags?.map((tag: any) => <Badge className='mb-3' variant={"outline"} key={tag}>
                  {tag}
                </Badge>)}</div>
              </div>
              {product?.createdOnUtc && (
                <div className="flex items-center space-x-2">
                  <div className="font-bold">Ngày tạo:</div>
                  <div className="text-base">{formatTimeVietNam(new Date(product?.createdOnUtc), true)}</div>
                </div>
              )}
              {product?.modifiedOnUtc && (
                <div className="flex items-center space-x-2">
                  <div className="font-bold">Ngày cập nhật:</div>
                  <div className="text-base">{formatTimeVietNam(new Date(product?.modifiedOnUtc), true)}</div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <div className="font-bold">Trạng thái:</div>
                <div className="text-base">
                  {!product?.isDeleted ? (
                    <span className="px-2 py-1 text-green-600 bg-green-50 rounded font-bold">Hoạt động</span>
                  ) : (
                    <span className="px-2 py-1 text-red-600 bg-red-50 rounded font-bold">Đã ẩn</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-bold">Mô tả sản phẩm:</div>
                <div className="text-base">{product?.description}</div>
              </div>
            </div>
            <Image className='max-h-fit' src={product?.mainImageUrl ?? "/images/dried-fruit.webp"} height={1000} width={1000} alt={product?.name ?? "image"} />
          </div>}
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default Information
