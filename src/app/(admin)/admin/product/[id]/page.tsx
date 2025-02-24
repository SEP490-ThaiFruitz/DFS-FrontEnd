"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Images, Info, ListCollapse, Table, UtensilsCrossed } from 'lucide-react'
import React from 'react'

const ProductDetail = () => {
    const sizes = [
        { id: 1, weight: "500", unit: "g", type: "Túi nhựa", quantity: 100, price: "50,000đ" },
        { id: 2, weight: "1", unit: "kg", type: "Hộp giấy", quantity: 50, price: "90,000đ" },
        { id: 3, weight: "2", unit: "kg", type: "Túi zip", quantity: 30, price: "170,000đ" },
    ];

    return (
        <div className='p-10 w-full'>
            <div className='Container'>
                <Tabs defaultValue="information">
                    <TabsList className='grid grid-cols-4 gap-10 bg-transparent'>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="information">
                            <Info className='mr-2' size={15} />
                            Thông tin
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="image">
                            <Images className='mr-2' size={15} />
                            Ảnh
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="nutrion">
                            <UtensilsCrossed className='mr-2' size={15} />
                            Dinh dưỡng
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="action">
                            <ListCollapse className='mr-2' size={15} />
                            Hành động
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="information">
                        <Card>
                            <CardHeader className='border-b-2'>
                                <CardTitle>Thông tin sản phẩm</CardTitle>
                            </CardHeader>
                            <CardContent className='p-5 sm:p-10 grid md:grid-cols-2 gap-20'>
                                <div className='grid gap-3'>
                                    <div className='flex space-x-3'>
                                        <p className='font-semibold'>Tên:</p>
                                        <p>Mít sấy khô</p>
                                    </div>
                                    <div className='flex space-x-3'>
                                        <p className='font-semibold'>Loại:</p>
                                        <p>Trái cây sấy</p>
                                    </div>
                                    <div className='flex space-x-3'>
                                        <p className='font-semibold'>Trạng thái:</p>
                                        <p>Đang bán</p>
                                    </div>
                                    <div>
                                        <p className='font-semibold mb-3'>Mô tả:</p>
                                        <p>Mít sấy khô</p>
                                    </div>
                                </div>
                                <div>
                                    <table className="w-full border-collapse" border={3}>
                                        <thead>
                                            <tr>
                                                <th className="w-[50px]">STT</th>
                                                <th className="w-[100px]">Cân nặng</th>
                                                <th className="w-[80px]">Đơn vị</th>
                                                <th>Loại</th>
                                                <th className="text-right">Số lượng</th>
                                                <th className="text-right">Giá tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sizes.map((size, index) => (
                                                <tr key={size.id}>
                                                    <td className="font-medium">{index + 1}</td>
                                                    <td>{size.weight}</td>
                                                    <td>{size.unit}</td>
                                                    <td>{size.type}</td>
                                                    <td className="text-right">{size.quantity}</td>
                                                    <td className="text-right">{size.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div></div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ProductDetail
