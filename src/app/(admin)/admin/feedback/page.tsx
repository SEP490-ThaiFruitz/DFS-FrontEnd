"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { deleteVoucher } from '@/actions/voucher'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import ImagePreview from '@/components/custom/_custom-image/image-preview'
import PaginationCustom from '@/components/global-components/data-table/paging-custom'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { ApiResponse, PageResult } from '@/types/types'
import { Eye, EyeOffIcon, Filter, Images, Search, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export interface Feedback {
    id: string;
    orderCode: string,
    user: {
        userId: string,
        name: string,
    }
    producvariant: {
        productvariantId: string,
        netWeight: number,
        packageType: string,
        quantity: number,
        product: {
            productId: string,
            productName: string,
        }
    }
    content: string;
    rating: number,
    images: string[],
    isShow: boolean,
    createdUtcOn: string,
}


function FeedbackPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const [filter, setFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(10);
    //const { data: feedbacks } = useFetch<ApiResponse<PageResult<Feedback>>>(`/Feedbacks?pageIndex=${pageIndex}&pageSize=${pageSize}`)
    const feedbacks: Feedback[] = [
        {
            id: "1",
            orderCode: "ORD001",
            user: {
                userId: "U001",
                name: "Nguyễn Văn A",
            },
            producvariant: {
                productvariantId: "PV001",
                netWeight: 500,
                packageType: "Hộp",
                quantity: 2,
                product: {
                    productId: "P001",
                    productName: "Trà xanh",
                },
            },
            content: "Sản phẩm rất tốt, sẽ mua lại.",
            rating: 5,
            images: ["/images/combo.jpg"],
            isShow: false,
            createdUtcOn: "2024-03-07T12:00:00Z",
        },
        {
            id: "2",
            orderCode: "ORD002",
            user: {
                userId: "U002",
                name: "Trần Thị B",
            },
            producvariant: {
                productvariantId: "PV002",
                netWeight: 1000,
                packageType: "Túi",
                quantity: 1,
                product: {
                    productId: "P002",
                    productName: "Cà phê đen",
                },
            },
            content: "Chất lượng ổn, giá hợp lý.",
            rating: 4,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T13:00:00Z",
        },
        {
            id: "3",
            orderCode: "ORD003",
            user: {
                userId: "U003",
                name: "Lê Văn C",
            },
            producvariant: {
                productvariantId: "PV003",
                netWeight: 750,
                packageType: "Lon",
                quantity: 3,
                product: {
                    productId: "P003",
                    productName: "Nước tăng lực",
                },
            },
            content: "Giao hàng nhanh, đóng gói cẩn thận.",
            rating: 5,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T14:00:00Z",
        },
        {
            id: "4",
            orderCode: "ORD004",
            user: {
                userId: "U004",
                name: "Phạm Thị D",
            },
            producvariant: {
                productvariantId: "PV004",
                netWeight: 250,
                packageType: "Hộp",
                quantity: 5,
                product: {
                    productId: "P004",
                    productName: "Bánh quy",
                },
            },
            content: "Bánh giòn, thơm ngon.",
            rating: 5,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T15:00:00Z",
        },
        {
            id: "5",
            orderCode: "ORD005",
            user: {
                userId: "U005",
                name: "Hoàng Minh E",
            },
            producvariant: {
                productvariantId: "PV005",
                netWeight: 200,
                packageType: "Gói",
                quantity: 2,
                product: {
                    productId: "P005",
                    productName: "Snack rong biển",
                },
            },
            content: "Vị ngon, nhưng hơi ít.",
            rating: 4,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T16:00:00Z",
        },
        {
            id: "6",
            orderCode: "ORD006",
            user: {
                userId: "U006",
                name: "Ngô Đức F",
            },
            producvariant: {
                productvariantId: "PV006",
                netWeight: 150,
                packageType: "Chai",
                quantity: 1,
                product: {
                    productId: "P006",
                    productName: "Sữa đậu nành",
                },
            },
            content: "Sữa ngon nhưng hơi ngọt.",
            rating: 3,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T17:00:00Z",
        },
        {
            id: "7",
            orderCode: "ORD007",
            user: {
                userId: "U007",
                name: "Đinh Văn G",
            },
            producvariant: {
                productvariantId: "PV007",
                netWeight: 500,
                packageType: "Túi",
                quantity: 2,
                product: {
                    productId: "P007",
                    productName: "Hạt điều rang muối",
                },
            },
            content: "Hạt điều ngon, giòn.",
            rating: 5,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T18:00:00Z",
        },
        {
            id: "8",
            orderCode: "ORD008",
            user: {
                userId: "U008",
                name: "Vũ Thị H",
            },
            producvariant: {
                productvariantId: "PV008",
                netWeight: 120,
                packageType: "Hộp",
                quantity: 1,
                product: {
                    productId: "P008",
                    productName: "Chocolate đen",
                },
            },
            content: "Chocolate đắng, đúng chuẩn vị.",
            rating: 5,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T19:00:00Z",
        },
        {
            id: "9",
            orderCode: "ORD009",
            user: {
                userId: "U009",
                name: "Trịnh Văn I",
            },
            producvariant: {
                productvariantId: "PV009",
                netWeight: 350,
                packageType: "Hộp",
                quantity: 3,
                product: {
                    productId: "P009",
                    productName: "Sữa chua uống",
                },
            },
            content: "Sữa chua ngon, bé nhà mình thích.",
            rating: 5,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T20:00:00Z",
        },
        {
            id: "10",
            orderCode: "ORD010",
            user: {
                userId: "U010",
                name: "Phan Thị J",
            },
            producvariant: {
                productvariantId: "PV010",
                netWeight: 250,
                packageType: "Lon",
                quantity: 2,
                product: {
                    productId: "P010",
                    productName: "Nước ép trái cây",
                },
            },
            content: "Nước ép ngon, vị tự nhiên.",
            rating: 4,
            images: [],
            isShow: true,
            createdUtcOn: "2024-03-07T21:00:00Z",
        },
    ];

    const [feedback, setFeedback] = useState<Feedback>();
    const [isDeleteFeedback, setIsDeleteFeedback] = useState(false);
    const form = useForm({
        defaultValues: {
            name: "",
            productName: "",
            star: "",
            createdUtcOn: "",
        },
    });

    const onSubmit = (data: any) => {
        console.log({ data })
    };
    return (
        <div className='m-10'>
            {filter && (<div className='border p-5 rounded-lg shadow-sm mt-5 transform origin-top-right transition-all duration-5000 ease-in-out'>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10'>
                        <FormInputControl
                            form={form}
                            name="name"
                            disabled={form.formState.isSubmitting}
                            label="Tên nguời dùng"
                        />
                        <FormInputControl
                            form={form}
                            name="productName"
                            disabled={form.formState.isSubmitting}
                            label="Tên sản phẩm"
                        />
                        <FormSelectControl
                            form={form}
                            name="star"
                            disabled={form.formState.isSubmitting}
                            label="Số sao đánh giá"
                            items={[
                                { id: '1', name: '1 sao' },
                                { id: '2', name: '2 sao' },
                                { id: '3', name: '3 sao' },
                                { id: '4', name: '4 sao' },
                                { id: '5', name: '5 sao' },
                            ]}
                        />
                        <FormInputControl
                            classNameInput='block w-full'
                            form={form}
                            name="createdUtcOn"
                            type='Date'
                            disabled={form.formState.isSubmitting}
                            label="Ngày đánh giá"
                        />
                    </div>
                    <div className='space-x-7 mt-4'>
                        <Button
                            size={"sm"}
                            type="submit"
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            <Search /> Tìm kiếm
                        </Button>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            type="button"
                            onClick={() => form.reset()}
                        >
                            <Trash2 /> Xóa
                        </Button>
                    </div>
                </FormValues>
            </div>)}
            <div className='mt-10 flex'>
                <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                        setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="w-fit whitespace-nowrap">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                        {[5, 10, 25, 50, 100, 1000].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button className='ml-auto' onClick={() => setFilter(!filter)} size={"icon"} variant={"outline"}>
                    <Filter />
                </Button>
            </div>
            <div className="mt-3 border overflow-hidden shadow-sm rounded-lg min-w-full max-w-6xl overflow-x-auto">
                <Table className='overflow-x-auto'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-fit min-w-[150px]">Người đánh giá</TableHead>
                            <TableHead className="w-fit min-w-[120px]">Sản phẩm</TableHead>
                            <TableHead className="w-fit min-w-[130px]">Nội dung</TableHead>
                            <TableHead className="w-fit min-w-[90px]">Số sao</TableHead>
                            <TableHead className="w-fit min-w-[150px]">Ngày tạo</TableHead>
                            <TableHead className="w-fit min-w-[120px]">Trạng thái</TableHead>
                            <TableHead className="w-fit min-w-[140px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedbacks?.map((feedback: Feedback) =>
                            <TableRow key={feedback.id}>
                                <TableCell className="font-bold">{feedback.user.name}</TableCell>
                                <TableCell>{`${feedback.producvariant.product.productName} ${feedback.producvariant.packageType} ${feedback.producvariant.netWeight}`}</TableCell>
                                <TableCell>{feedback.content}</TableCell>
                                <TableCell>{feedback.rating}<span className="text-yellow-500">⭐</span></TableCell>
                                <TableCell>{formatTimeVietNam(new Date(feedback.createdUtcOn), true)}</TableCell>
                                <TableCell>{feedback.isShow ? <div className='py-1 px-2 w-fit rounded-md text-green-700 font-bold bg-green-100'>Đang hiện</div>
                                    : <div className='py-1 px-2 w-fit rounded-md text-red-700 font-bold bg-red-100'>Đã ẩn</div>}</TableCell>
                                <TableCell className='space-x-3'>
                                    {feedback.images.length > 0 && (
                                        <ImagePreview iconButton={<Images />} images={feedback.images} />
                                    )}
                                    {feedback.isShow ? <Button
                                        onClick={() => {
                                            setIsDeleteFeedback(!isDeleteFeedback);
                                            setFeedback(feedback)
                                        }}
                                        variant="outline"
                                        className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        <EyeOffIcon />
                                    </Button> : <Button
                                        onClick={() => {
                                            setIsDeleteFeedback(!isDeleteFeedback);
                                            setFeedback(feedback)
                                        }}
                                        variant="outline"
                                        className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                    >
                                        <Eye />
                                    </Button>}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaginationCustom itemsPerPage={pageSize} totalItems={0} onChangePageIndex={setPageIndex} />
            <DeleteDialog id={feedback?.id ?? ""} isOpen={isDeleteFeedback} onClose={() => setIsDeleteFeedback(!isDeleteFeedback)} name={''} deleteFunction={deleteVoucher} />
        </div>
    )
}
export default FeedbackPage