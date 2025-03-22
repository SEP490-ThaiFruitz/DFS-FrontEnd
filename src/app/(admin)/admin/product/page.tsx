"use client"
import { deleteProduct } from '@/actions/product'
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import PaginationCustom from '@/components/global-components/data-table/paging-custom'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatVND } from '@/lib/format-currency'
import { PageResult, ApiResponse } from '@/types/types'
import { AlertTriangle, CirclePlus, Eye, Filter, Search, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface ProductVariant {
    id: string;
    image: string;
    netWeight: number;
    price: number;
    packageType: string;
    stockQuantity: number;
    reOrderPoint: number;
}

interface Product {
    id: string;
    name: string;
    mainImageUrl: string;
    categoriesName: string;
    isDeleted: boolean;
    productVarians: ProductVariant[];
}


function ProductPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const [filter, setFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(10);
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const { data: products, refetch } = useFetch<ApiResponse<PageResult<Product>>>(`/Products/mange?pageIndex=${pageIndex}&pageSize=${pageSize}`, ["products", "manage"])
    const [productVariants, setProductVariants] = useState<ProductVariant[] | undefined>(undefined)
    const form = useForm({
        defaultValues: {
            name: ""
        },
    });
    const onSubmit = (data: any) => {
        console.log({ data })
    };

    useEffect(() => {
        refetch();
    }, [pageIndex, pageSize, refetch])

    const StockIndicator = ({ stockQuantity, reOrderPoint }: { stockQuantity: number; reOrderPoint: number }) => {

        const percentage = Math.round((stockQuantity / reOrderPoint) * 100);

        const displayPercentage = Math.min(percentage, 100);

        let bgColor = "bg-gradient-to-r from-green-400 to-green-600";
        let textColor = "text-green-700";

        if (displayPercentage < 25) {
            bgColor = "bg-gradient-to-r from-red-400 to-red-600";
            textColor = "text-red-700";
        } else if (displayPercentage < 50) {
            bgColor = "bg-gradient-to-r from-orange-400 to-orange-600";
            textColor = "text-orange-700";
        } else if (displayPercentage < 100) {
            bgColor = "bg-gradient-to-r from-yellow-400 to-yellow-600";
            textColor = "text-yellow-700";
        } 

        return (
            <div className='flex gap-5 items-center'>
                <div className="w-full bg-slate-50 h-3.5 rounded-full relative">
                    <div  style={{ width: `${displayPercentage}%` }} className={`absolute h-3.5 rounded-full ${bgColor}`}></div>
                </div>
                <span className={`text-md font-medium w-fit ${textColor}`}>{displayPercentage}%</span>
            </div>
        )
    }

    const TotalStockIndicator = ({ variants }: { variants: ProductVariant[] }) => {
        if (variants.length === 0)
            return 0

        const totalStock = variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);
        const totalReorderPoint = variants.reduce((sum, variant) => sum + variant.reOrderPoint, 0);
        const percentage = Math.min(Math.round((totalStock / totalReorderPoint) * 100), 100);

        const hasLowStock = variants.some(variant => variant.stockQuantity < variant.reOrderPoint);

        let bgColor = "bg-gradient-to-r from-green-300 to-green-500";
        if (hasLowStock) {
            bgColor = "bg-gradient-to-r from-red-300 to-red-500";
        } else if (percentage < 25) {
            bgColor = "bg-gradient-to-r from-red-300 to-red-500";
        } else if (percentage < 50) {
            bgColor = "bg-gradient-to-r from-orange-300 to-orange-500";
        } else if (percentage < 75) {
            bgColor = "bg-gradient-to-r from-yellow-300 to-yellow-500";
        }

        return (
            <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${bgColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-sm">{totalStock}</span>
                {hasLowStock && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
            </div>
        );
    };
    return (
        <div className='m-10'>
            <div className='flex justify-between items-center'>
                <div className='text-2xl font-semibold leading-none tracking-tight'>Sản phẩm</div>
                <Link href="/admin/product/create">
                    <Button size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                        <CirclePlus />
                        Tạo sản phẩm
                    </Button>
                </Link>
            </div>
            {filter && (<div className='border p-5 rounded-lg shadow-sm mt-5 transform origin-top-right transition-all duration-5000 ease-in-out'>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10'>
                        <FormInputControl
                            form={form}
                            name="name"
                            disabled={form.formState.isSubmitting}
                            label="Tên sản phẩm"
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
                            <TableHead className="w-[200px] min-w-[200px]">Ảnh</TableHead>
                            <TableHead className="w-[200px] min-w-[200px]">Tên</TableHead>
                            <TableHead className="w-fit min-w-[120px]">Loại sản phẩm</TableHead>
                            <TableHead className="w-fit min-w-[150px]">Tổng số lượng</TableHead>
                            <TableHead className="w-fit min-w-[180px]">Trạng thái</TableHead>
                            <TableHead className="w-fit min-w-[140px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.value?.items.map((product: Product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Image
                                        className='max-w-40'
                                        src={product.mainImageUrl}
                                        height={1000}
                                        width={1000}
                                        alt={product.name}
                                    />
                                </TableCell>
                                <TableCell>
                                    {product.name}
                                </TableCell>
                                <TableCell>
                                    {product.categoriesName}
                                </TableCell>
                                <TableCell>
                                    <button className='hover:underline hover:text-blue-400' onClick={() => setProductVariants(product.productVarians)}>
                                        <TotalStockIndicator variants={product.productVarians} />
                                    </button>
                                </TableCell>
                                <TableCell>
                                    {!product.isDeleted ? <span className='px-2 py-1 text-green-600 bg-green-50 rounded font-bold'>Hoạt động</span> : <span className='px-2 py-1 text-red-600 bg-red-50 rounded font-bold'>Đã ẩn</span>}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/product/${product.id}`}>
                                            <Button
                                                variant="outline"
                                                className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                            >
                                                <Eye />
                                            </Button>
                                        </Link>
                                        {!product.isDeleted && (
                                            <Button
                                                onClick={() => setProduct(product)}
                                                variant="outline"
                                                className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {productVariants && (
                <Dialog open={productVariants !== undefined} onOpenChange={() => setProductVariants(undefined)}>
                    <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Danh sách các biến thể</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="w-full max-h-[70vh] pr-4">
                            <div className="flex flex-col gap-4 pb-2">
                                {productVariants?.map((variant: ProductVariant) => (
                                    <div
                                        key={variant.id}
                                        className="p-4 hover:cursor-pointer rounded-lg border shadow-sm flex flex-col sm:flex-row gap-4 w-full hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="w-full sm:w-32 h-32 object-cover rounded-md"
                                                src={variant.image || "/placeholder.svg"}
                                                height={200}
                                                width={200}
                                                alt={variant.packageType || variant.id}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between flex-1">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-lg">{variant.packageType}</h3>
                                                <div className="text-sm text-muted-foreground">Trọng lượng: {variant.netWeight}g</div>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <div className="text-sm">Tồn kho: {variant.stockQuantity}</div>
                                                    <div className="text-sm">Số lượng tối thiểu: {variant.reOrderPoint}</div>
                                                </div>
                                            </div>
                                            <StockIndicator reOrderPoint={variant.reOrderPoint} stockQuantity={variant.stockQuantity} />
                                            <div className="font-medium text-lg text-red-600 mt-2">Giá: {formatVND(variant.price)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}
            <PaginationCustom itemsPerPage={pageSize} totalItems={products?.value?.totalCount ?? 0} onChangePageIndex={setPageIndex} />
            {product && (<DeleteDialog
                id={product?.id ?? ""}
                isOpen={product !== undefined}
                onClose={() => setProduct(undefined)}
                name={product?.name}
                deleteFunction={deleteProduct}
                refreshKey={[["products", "manage"]]}
                content={product.productVarians.length > 0 ? `${product.name} đã có sản phẩm phụ. Bạn có muốn ẩn đi không?` : `Thao tác này không thể hoàn lại. Bạn có muốn xóa ${product.name}`}
            />)}
        </div>
    )
}

export default ProductPage;
