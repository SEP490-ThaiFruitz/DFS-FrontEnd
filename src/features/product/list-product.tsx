"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatVND } from '@/lib/format-currency'
import { PageResult, ApiResponse, Profile } from '@/types/types'
import {
    AlertTriangle, ChartArea, CirclePlus, Eye, Trash2, Package,
    Layers3,
    Boxes,
    Archive,
    RotateCw,
    ChevronDown
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableSkeleton } from '@/components/global-components/custom-skeleton/data-table-skeleton'
import { DataTableCustom } from '@/components/global-components/data-table/data-table-custom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { STATUS_HIDDEN_SELECT } from '@/features/admin/admin-lib/admin-lib'
import CardSkeleton from '@/components/global-components/custom-skeleton/card-skeleton'
import { PRODUCT_KEY } from '@/app/key/comm-key'
import { API } from '@/actions/client/api-config'
import { useQueryClient } from '@tanstack/react-query'
import { USER_KEY } from '@/app/key/user-key'


interface ProductResponse {
    productsManageResponse: PageResult<Product>
    productManageStatistic: ProductManageStatistic
}

interface ProductManageStatistic {
    totalProduct: number,
    totalProductVariant: number,
    totalProductQuantity: number,
    hide: number
}

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
    productVariants: ProductVariant[];
}

function ListProduct() {
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const { data: products, isLoading } = useFetch<ApiResponse<ProductResponse>>(`/Products/manage`, [PRODUCT_KEY.PRODUCT_MANAGE])
    const [productVariants, setProductVariants] = useState<ProductVariant[] | undefined>(undefined)
    const [seletedOption, setSeletedOption] = useState<string>("All")
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<ApiResponse<Profile>>([USER_KEY.PROFILE])

    const filterProducts = products?.value?.productsManageResponse.items.filter((product) => {
        if (seletedOption === "All") return true
        if (seletedOption === "Active") return !product.isDeleted
        if (seletedOption === "IsDeleted") return product.isDeleted
    })

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
                    <div style={{ width: `${displayPercentage}%` }} className={`absolute h-3.5 rounded-full ${bgColor}`}></div>
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

    // Define columns for DataTable
    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "mainImageUrl",
            header: "Ảnh",
            cell: ({ row }) => (
                <Image
                    className='max-w-40'
                    src={row.original.mainImageUrl || "/placeholder.svg"}
                    height={1000}
                    width={1000}
                    alt={row.original.name}
                />
            ),
            size: 200,
        },
        {
            accessorKey: "name",
            header: "Tên",
            size: 200,
        },
        {
            accessorKey: "categoriesName",
            header: "Loại sản phẩm",
            size: 120,
        },
        {
            accessorKey: "variants",
            header: "Tổng biến thể",
            cell: ({ row }) => <div className='text-center'>
                {row.original.productVariants.length}
            </div>
        },
        {
            accessorKey: "productVariants",
            header: "Tổng số lượng",
            cell: ({ row }) => (
                <button
                    className='hover:underline hover:text-blue-400'
                    onClick={() => setProductVariants(row.original.productVariants)}
                >
                    <TotalStockIndicator variants={row.original.productVariants} />
                </button>
            ),
            size: 150,
        },
        {
            accessorKey: "isDeleted",
            header: "Trạng thái",
            cell: ({ row }) => (
                !row.original.isDeleted ?
                    <span className='px-2 py-1 text-green-600 bg-green-50 rounded font-bold'>Hoạt động</span> :
                    <span className='px-2 py-1 text-red-600 bg-red-50 rounded font-bold'>Đã ẩn</span>
            ),
            size: 180,
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link href={
                        user?.value?.role === 'Administrator'
                            ? `/admin/product/${row.original.id}`
                            : `/manager/product/${row.original.id}`}>
                        <Button
                            variant="outline"
                            className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                            <Eye />
                        </Button>
                    </Link>
                    <Link href={
                        user?.value?.role === 'Administrator'
                            ? `/admin/dashboard/${row.original.id}`
                            : `/manager/dashboard/${row.original.id}`}>
                        <Button
                            variant="outline"
                            className="h-6 w-6 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
                        >
                            <ChartArea />
                        </Button>
                    </Link>
                    {!row.original.isDeleted ? (
                        <Button
                            onClick={() => setProduct(row.original)}
                            variant="outline"
                            className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 />
                        </Button>

                    ) : (
                        <Button
                            onClick={() => setProduct(row.original)}
                            variant="outline"
                            className="h-6 w-6 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                        >
                            <RotateCw />
                        </Button>
                    )}
                </div>
            ),
            size: 140,
        },
    ];

    const deleteProduct = async (id: string) => {
        return await API.remove(`/Products/${id}`);
    }
    return (
        <div className='m-10'>
            <div className='flex justify-between items-center mb-4'>
                <div className='text-2xl font-semibold leading-none tracking-tight'>Sản phẩm</div>
                <Link href={user?.value?.role === 'Administrator' 
                    ? "/admin/product/create"
                    : "/manager/product/create"
                }>
                    <Button size={"sm"} className='text-white bg-sky-600 hover:bg-sky-700'>
                        <CirclePlus className="mr-1 h-4 w-4" />
                        Tạo sản phẩm
                    </Button>
                </Link>
            </div>
            {isLoading ? (
                <div className="w-full mt-8">
                    <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <CardSkeleton key={i + 1} />
                            ))}

                    </div>
                    <div className="mt-8">
                        <Card className="card bg-white shadow border cardStyle">
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-4 w-24" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index + 1} className="flex items-center">
                                            <Skeleton className="w-12 h-4 text-sm font-medium" />
                                            <Skeleton className="w-full h-4" />
                                            <Skeleton className="w-12 h-4 text-right text-sm font-medium" />
                                            <Skeleton className="w-16 h-4 text-right text-sm text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-8">
                        <DataTableSkeleton />
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4 mt-10">
                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                                <div className="bg-green-50 rounded-full p-3 border">
                                    <Package className="h-4 w-4 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{products?.value?.productManageStatistic.totalProduct ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng biến thể</CardTitle>
                                <div className="bg-blue-50 rounded-full p-3 border">
                                    <Layers3 className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{products?.value?.productManageStatistic.totalProductVariant ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng số lượng</CardTitle>
                                <div className="bg-purple-50 rounded-full p-3 border">
                                    <Boxes className="h-4 w-4 text-purple-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{products?.value?.productManageStatistic.totalProductQuantity ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Đã ẩn</CardTitle>
                                <div className="bg-amber-50 rounded-full p-3 border">
                                    <Archive className="h-4 w-4 text-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{products?.value?.productManageStatistic.hide ?? 0}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-8 bg-white cardStyle shadow border">
                        <DataTableCustom
                            data={filterProducts ?? []}
                            columns={columns}
                            searchFiled='name'
                            placeholder="tên sản phẩm"
                        >
                            <div className='flex items-center justify-end pr-4'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="min-w-fit justify-between sm:w-auto">
                                            {STATUS_HIDDEN_SELECT[seletedOption]}
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => setSeletedOption("All")}>Tất cả</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSeletedOption("Active")}>Hoạt động</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSeletedOption("IsDeleted")}>Đã ẩn</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </DataTableCustom>
                    </div>
                </>
            )}
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

            {product && (
                <DeleteDialog
                    id={product?.id ?? ""}
                    isOpen={product !== undefined}
                    onClose={() => setProduct(undefined)}
                    name={product?.name}
                    deleteFunction={deleteProduct}
                    message={product?.isDeleted === false ? product.productVariants.length > 0 ? "Ẩn" : "Xóa" : "Hiện"}
                    refreshKey={[[PRODUCT_KEY.PRODUCT_MANAGE]]}
                    content={product.productVariants.length > 0
                        ? product.isDeleted == false ? `${product.name} đã có sản phẩm phụ. Bạn có muốn ẩn đi không?` : 'Bạn có muốn khôi phục lại sản phẩm này không?'
                        : `Thao tác này không thể hoàn lại. Bạn có muốn xóa ${product.name}`
                    }
                />
            )}
        </div>
    )
}

export default ListProduct;
