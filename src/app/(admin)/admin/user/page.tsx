"use client"

import { banUser } from "@/actions/user"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { Button } from "@/components/ui/button"
import type { ApiResponse, PageResult } from "@/types/types"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { CirclePlus, LockKeyhole, LockKeyholeOpen, Pencil } from "lucide-react"
import { useState } from "react"
import FormUser from "./form-user"
import { DataTable } from '@/components/global-components/data-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number"
import { API } from "@/actions/client/api-config"

interface User {
    id: string
    name: string
    email: string
    phone: string
    gender: "Male" | "Female" | "Other"
    birthday: string
    avatar: string
    point: number
    role: "Administrator" | "Customer" | "Staff" | "Manager"
    isActive: boolean
}

function UserPage() {
    const [isBanPopup, setIsBanPopup] = useState<boolean>(false)
    const [isFormUser, setIsFormUser] = useState<boolean>(false)
    const [user, setUser] = useState<User>()

    const { data: users } = useFetch<ApiResponse<PageResult<User>>>("/Users?pageIndex=1&pageSize=1000", ["Users"])
    console.log(users?.value?.items)
    const getGenderDisplay = (gender: string) => {
        switch (gender) {
            case "Male":
                return "Nam"
            case "Female":
                return "Nữ"
            default:
                return "Khác"
        }
    }

    const getRoleDisplay = (role: string) => {
        switch (role) {
            case "Administrator":
                return "Quản trị viên"
            case "Manager":
                return "Quản lí"
            case "Staff":
                return "Nhân viên"
            default:
                return "Khách hàng"
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "Administrator":
                return "bg-blue-50 text-blue-600"
            case "Manager":
                return "bg-yellow-50 text-yellow-600"
            case "Staff":
                return "bg-purple-50 text-purple-600"
            default:
                return "bg-gray-100 text-gray-500"
        }
    }

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: "Tên",
            cell: ({ row }) => <div className="font-bold">{row.original.name}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email,
        },
        {
            accessorKey: "phone",
            header: "SĐT",
            cell: ({ row }) => row.original.phone && formatVietnamesePhoneNumber(row.original.phone),
        },
        {
            accessorKey: "gender",
            header: "Giới tính",
            cell: ({ row }) => getGenderDisplay(row.original.gender),
        },
        {
            accessorKey: "role",
            header: "Vai trò",
            cell: ({ row }) => (
                <div className={`w-fit py-1 px-2 rounded-lg ${getRoleColor(row.original.role)}`}>
                    {getRoleDisplay(row.original.role)}
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Trạng thái",
            cell: ({ row }) =>
                row.original.isActive ? (
                    <div className="bg-green-50 text-green-600 w-fit py-1 px-2 rounded-lg">Hoạt động</div>
                ) : (
                    <div className="bg-red-50 text-red-600 w-fit py-1 px-2 rounded-lg">Đã khóa</div>
                ),
        },
        {
            header: "Hành động",
            cell: ({ row }) => {
                const userData = row.original
                return (
                    <div className="space-x-2">
                        <Button
                            onClick={() => {
                                setIsFormUser(true)
                                setUser(userData)
                            }}
                            variant="outline"
                            className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        {userData.role !== "Administrator" &&
                            (!userData.isActive ? (
                                <Button
                                    onClick={() => {
                                        setUser(userData)
                                        setIsBanPopup(true)
                                    }}
                                    variant="outline"
                                    className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                >
                                    <LockKeyhole className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        setUser(userData)
                                        setIsBanPopup(true)
                                    }}
                                    variant="outline"
                                    className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                    <LockKeyholeOpen className="h-4 w-4" />
                                </Button>
                            ))}
                    </div>
                )
            },
        },
    ]

    const banUser = async (id: string) => {
        return await API.update(`/Users/${id}/status`, {});
    }

    return (
        <div className="m-10">
            <div className="flex justify-between items-center">
                <p className="text-2xl font-semibold leading-none tracking-tight">Tài khoản</p>
                <Button onClick={() => setIsFormUser(true)} size="sm" className="text-white bg-green-500 hover:bg-green-600">
                    <CirclePlus className="mr-1" />
                    Tạo mới
                </Button>
            </div>

            <div className="mt-3">
                <DataTable<User> data={users?.value?.items || []} columns={columns} searchFiled="name" />
            </div>

            <DeleteDialog
                id={user?.id ?? ""}
                isOpen={isBanPopup}
                onClose={() => setIsBanPopup(false)}
                deleteFunction={banUser}
                refreshKey={[["Users"]]}
                name={user?.name}
                content={`Bạn có chắc chắn muốn ${user?.isActive ? "khóa tài khoản" : "mở khóa tài khoản"} ${user?.name} không?`}
                message={user?.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                classNameButton={user?.isActive ? "" : "bg-green-500 hover:bg-green-800"}
            />

            {isFormUser && (
                <FormUser
                    isOpen={isFormUser}
                    user={user}
                    onClose={() => {
                        setIsFormUser(false)
                        setUser(undefined)
                    }}
                />
            )}
        </div>
    )
}

export default UserPage

