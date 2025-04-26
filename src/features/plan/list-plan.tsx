"use client"

import { Button } from "@/components/ui/button"
import { Check, CirclePlus, Eye, Pencil, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import type { ApiResponse, PageResult, Profile } from "@/types/types"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { API } from "@/actions/client/api-config"
import DialogProductDetail from "./dialog-product-detail"
import { useState } from "react"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { REQUEST_KEY } from "@/app/key/comm-key"
import { USER_KEY } from "@/app/key/user-key"
import { getRoleDisplay } from "../admin/admin-lib/admin-lib"

export interface Request {
    id: string
    name: string
    user: User
    requestDate: string
    updatedDate: string | null
    status: string
    expectedDate: string,
    description: string,
    requestType: "Return" | "Import",
    reasonDeclined: string | null,
    productVariants: ProductVariant[]
}

interface User {
    id: string
    avatar: string
    name: string
    role: string
}

export interface ProductVariant {
    productId: string,
    packageType: string,
    productVariantId: string,
    name: string,
    image: string,
    netWeight: number,
    quantity: number,
    enteredQuantity: number,
}

const ListPlan = () => {
    const { data: requests, refetch, isLoading } = useFetch<ApiResponse<PageResult<Request>>>("/Requests", [
        REQUEST_KEY.REQUEST_MANAGE,
    ])


    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            Pending: {
                color: "bg-yellow-100 hover:bg-yellow-100/80 text-yellow-800",
                label: "Chờ xác nhận",
            },
            Processing: {
                color: "bg-green-100 hover:bg-green-100/80 text-green-800",
                label: "Đang xử lí",
            },
            Declined: {
                color: "bg-red-100 hover:bg-red-100/80 text-red-800",
                label: "Từ chối",
            },
            Approved: {
                color: "bg-blue-100 hover:bg-blue-100/80 text-blue-800",
                label: "Hoàn thành",
            },
            PartiallyCompleted: {
                color: "bg-indigo-100 hover:bg-indigo-100/80 text-indigo-800",
                label: "Hoàn thành một phần",
            },
            Completed: {
                color: "bg-blue-200 hover:bg-blue-200/80 text-blue-900",
                label: "Đã hoàn thành",
            },
        };

        return statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status }
    }
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<ApiResponse<Profile>>([USER_KEY.PROFILE]);
    const [request, setRequest] = useState<Request | undefined>(undefined)
    const [requestRemove, setRequestRemove] = useState<Request | undefined>(undefined)

    const handleApproveRequest = async (id: string) => {
        try {
            const response = await API.update(`/Requests/status/${id}`, {
                id,
                status: "Processing"
            })
            if (response) {
                toast.success("Phê duyệt thành công")
                refetch();
            }
        } catch (error) {
            console.log({ error })
            toast.error("Lỗi hệ thống")
        }
    }
    const columns: ColumnDef<Request>[] = [
        {
            accessorKey: "user",
            header: "Người tạo",
            cell: ({ row }) => {
                const user = row.original.user
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{getRoleDisplay(user.role)}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "name",
            header: "Tên kế hoạch",
        },
        {
            accessorKey: "requestDate",
            header: "Ngày yêu cầu",
            cell: ({ row }) => {
                const date = new Date(row.getValue("requestDate"))
                return <div>{formatTimeVietNam(date, true)}</div>
            },
        },
        {
            accessorKey: "updatedDate",
            header: "Ngày cập nhật",
            cell: ({ row }) => {
                const date = new Date(row.getValue("updatedDate"))
                return date && <div>{formatTimeVietNam(date, true)}</div>
            },
        },
        {
            accessorKey: "requestType",
            header: "Loại yêu cầu",
            cell: ({ row }) => {
                const type = row.original.requestType
                return (
                    <Badge className={type === "Import" ? "bg-blue-500" : "bg-orange-500"}>
                        {type === "Import" ? "Nhập hàng" : "Trả hàng"}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const statusValue = row.original.status as 'Approved' | 'Declined' | 'Processing' | 'Pending'

                return <Badge className={`${getStatusBadge(statusValue).color} px-3 py-1`}>
                    {getStatusBadge(statusValue).label}
                </Badge>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const request = row.original
                const statusValue = row.original.status as 'Approved' | 'Declined' | 'Processing' | 'Pending'
                return (
                    <div className="space-x-3">
                        {(user?.value?.role === "Manager" || user?.value?.role === "Administrator") && statusValue === "Pending" && (
                            <Button
                                variant="outline"
                                onClick={() => handleApproveRequest(request.id)}
                                className="h-6 w-6 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            >
                                <Check />
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRequest(row.original)
                            }}
                            className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                            <Eye />
                        </Button>
                        <Link href={
                            user?.value?.role === 'Administrator'
                                ? `/admin/plan/${row.original.id}`
                                : `/manager/plan/${row.original.id}`}>
                            <Button
                                variant="outline"
                                className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                            >
                                <Pencil />
                            </Button>
                        </Link>
                        {statusValue === "Pending" || (user?.value?.role === "Manager" || user?.value?.role === "Administrator") && (
                            <Button
                                onClick={() => setRequestRemove(row.original)}
                                variant="outline"
                                className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                <Trash2 />
                            </Button>
                        )}
                    </div>
                )
            },
        },
    ]

    const handleDelete = async (id: string) => {
        return await API.remove(`/Requests/${id}`)
    }

    return (
        <div className="m-10">
            <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">Danh sách kế hoạch</div>
                <Link href={
                    user?.value?.role === 'Administrator'
                    ? "/admin/plan/create"
                    : "/manager/plan/create"
                }>
                    <Button size={"sm"} className="text-white bg-sky-600 hover:bg-sky-700">
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Tạo kế hoạch
                    </Button>
                </Link>
            </div>
            <div className="mt-8">
                {isLoading ? <DataTableSkeleton /> :
                    <div className="bg-white cardStyle shadow border">
                        <DataTableCustom
                            data={requests?.value?.items ?? []} columns={columns} searchFiled="name" placeholder="tên"
                        />
                    </div>
                }
            </div>

            {request !== undefined && <DialogProductDetail
                isOpen={request !== undefined}
                onClose={() => setRequest(undefined)}
                request={request}
            />}
            {requestRemove && (
                <DeleteDialog
                    deleteFunction={handleDelete}
                    name={requestRemove.name}
                    isOpen={requestRemove !== undefined}
                    onClose={() => {
                        setRequestRemove(undefined);
                    }}
                    refreshKey={[[REQUEST_KEY.REQUEST_MANAGE]]}
                    id={requestRemove.id}
                />
            )}
        </div>
    )
}

export default ListPlan

