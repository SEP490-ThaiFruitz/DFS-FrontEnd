"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, CirclePlus, Package } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import Link from "next/link"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMemo, useState } from "react"
import { getRemainingDays } from "@/features/admin/admin-lib/admin-lib"

interface ProductBatchItem {
    productBatchId: number;
    batchNumber: string;
    quantityImported: number;
    quantityRemaining: number;
    quantitySold: number;
    preservationMethod: string;
    productionDate: string;
    expirationDate: string;
}

const dateRangeOptions = {
    all: { label: "Tất cả", days: Infinity },
    threeMonths: { label: "3 tháng", days: 90, from: 30 },
    oneMonth: { label: "1 tháng", days: 30, from: 15 },
    fifteenDays: { label: "15 ngày", days: 15, from: 7 },
    sevenDays: { label: "7 ngày", days: 7, from: 1 },
    outDate: { label: "Hết hạn", days: 0, from: 0 },
};

interface InventoryProps {
    productBatchItems: ProductBatchItem[];
}

const Inventory = ({ productBatchItems }: Readonly<InventoryProps>) => {

    const [selectedOption, setSelectedOption] = useState<keyof typeof dateRangeOptions>("all");

    const handleOptionSelect = (option: keyof typeof dateRangeOptions) => {
        setSelectedOption(option);
    };

    const filteredData = useMemo(() => {
        if (!productBatchItems) return [];

        const items = (() => {
            if (selectedOption === "all") return productBatchItems;

            if (selectedOption === "outDate") {
                return productBatchItems.filter(item => getRemainingDays(item.expirationDate) <= 0);
            }

            const { from = 0, days = Infinity } = dateRangeOptions[selectedOption];
            return productBatchItems.filter(item => {
                const remaining = getRemainingDays(item.expirationDate);
                return remaining > 0 && remaining >= from && remaining <= days;
            });
        })();

        return items.sort((a, b) => {
            const remainingA = getRemainingDays(a.expirationDate);
            const remainingB = getRemainingDays(b.expirationDate);

            if (remainingA <= 0 && remainingB <= 0) return 0;
            if (remainingA <= 0) return 1;
            if (remainingB <= 0) return -1;

            return remainingA - remainingB;
        });
    }, [productBatchItems, selectedOption]);

    const columns: ColumnDef<ProductBatchItem>[] = [
        {
            accessorKey: "batchNumber",
            header: "Lô hàng"
        },
        {
            accessorKey: "quantityImported",
            header: "Số lượng nhập",
        },
        {
            accessorKey: "quantitySold",
            header: "Số lượng đã bán",
        },
        {
            accessorKey: "quantityRemaining",
            header: "Số lượng còn lại",
        },
        {
            accessorKey: "preservationMethod",
            header: "Phương pháp bảo quản",
        },
        {
            accessorKey: "productionDate",
            header: "Ngày sản xuất",
            cell: ({ row }) => {
                const date = new Date(row.original.productionDate)
                return <div>{formatTimeVietNam(date)}</div>
            },
        },
        {
            accessorKey: "expirationDate",
            header: "Ngày hết hạn",
            cell: ({ row }) => {
                const date = new Date(row.original.expirationDate)
                return <div>{formatTimeVietNam(date)}</div>
            },
        },
        {
            accessorKey: "time",
            header: "Thời gian",
            cell: ({ row }) => getRemainingTime(row.original.expirationDate),
        },
    ]


    const getRemainingTime = (endDate: string) => {
        const remainingDays = getRemainingDays(endDate)
        if (remainingDays <= 0)
            return <div className="px-2 py-1 bg-red-50 w-fit rounded-md text-red-700 font-bold text-center">Đã hết hạn</div>

        return (
            <div
                className={`px-2 py-1 w-fit rounded-md font-bold text-center ${remainingDays > 30
                    ? "bg-green-50 text-green-700"
                    : remainingDays > 15
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
            >
                {remainingDays} ngày
            </div>
        )
    }

    const getTotalQuantity = (data: ProductBatchItem[], minDays: number, maxDays: number) =>
        data.reduce((total, item) => {
          const remaining = getRemainingDays(item.expirationDate);
          return remaining > minDays && remaining <= maxDays ? total + item.quantityRemaining : total;
        }, 0);

    const SelectDate = () => (
        <div className="flex items-center py-4 space-x-4 p-4 w-full justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between sm:w-auto">
                        {dateRangeOptions[selectedOption].label}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleOptionSelect("all")}>Tất cả</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("sevenDays")}>7 ngày</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("fifteenDays")}>15 ngày</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("oneMonth")}>1 tháng</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("threeMonths")}>3 tháng</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("outDate")}>Hết hạn</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

    return (
        <Card className="cardStyle">
            <CardHeader>
                <div className="sm:flex justify-between items-center mb-6">
                    <div className="text-2xl font-semibold leading-none tracking-tight">Danh sách sản phẩm trong kho</div>
                    <div className="mt-5 sm:mt-0 space-y-4 sm:space-y-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <Link href={"/admin/promotion/create"}>
                            <Button size={"sm"} className="text-white bg-sky-600 hover:bg-sky-700">
                                <CirclePlus className="mr-2 h-4 w-4" />
                                Tạo chương trình khuyến mãi
                            </Button>
                        </Link>
                        <Link href={"/admin/inventory/create"}>
                            <Button size={"sm"} className="text-white bg-sky-600 hover:bg-sky-700">
                                <CirclePlus className="mr-2 h-4 w-4" />
                                Tạo xuất nhập kho
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4 mt-10">
                    <Card className="transition-all hover:shadow-md cardStyle">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">3 tháng</CardTitle>
                            <div className="bg-green-50 rounded-full p-3 border">
                                <Package className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getTotalQuantity(productBatchItems ?? [], 30, Infinity)}</div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md cardStyle">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">1 tháng</CardTitle>
                            <div className="bg-blue-50 rounded-full p-3 border">
                                <Package className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getTotalQuantity(productBatchItems ?? [], 15, 30)}</div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md cardStyle">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">15 ngày</CardTitle>
                            <div className="bg-purple-50 rounded-full p-3 border">
                                <Package className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getTotalQuantity(productBatchItems ?? [], 7, 15)}</div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md cardStyle">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">7 ngày</CardTitle>
                            <div className="bg-amber-50 rounded-full p-3 border">
                                <Package className="h-4 w-4 text-amber-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getTotalQuantity(productBatchItems ?? [], 0, 7)}</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-8">
                    <div className="bg-white cardStyle shadow border">
                        <DataTableCustom data={filteredData ?? []} columns={columns} placeholder="lô" searchFiled="batchNumber" >
                            <SelectDate />
                        </DataTableCustom>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Inventory
