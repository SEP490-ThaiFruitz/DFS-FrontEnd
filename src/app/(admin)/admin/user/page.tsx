"use client"
import { banUser, getUsersByAdministrator } from '@/actions/user'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import PaginationCustom from '@/components/global-components/data-table/paging-custom'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ApiResponse, PageResult } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import { CirclePlus, Filter, LockKeyhole, LockKeyholeOpen, Pencil, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormUser from './form-user'

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    gender: "Male" | "Female" | "Other";
    birthday: string;
    avatar: string;
    point: number;
    role: "Administrator" | "Customer" | "Staff" | "Manager";
    isActive: boolean;
}

function UserPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const [filter, setFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(10);
    const [searchParams, setSearchParams] = useState<{ name?: string;[key: string]: any }>({});
    const [isBanPopup, setIsBanPopup] = useState<boolean>(false);
    const [isFormUser, setIsFormUser] = useState<boolean>(false);

    const { data: users, isPending, refetch } = useQuery({
        queryKey: ["Users"],
        queryFn: async () => {
            try {

                const res = await getUsersByAdministrator({
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    searchTerm: searchParams.name ?? "",
                    ...searchParams
                })
                if (!res?.isSuccess) {
                    throw new Error("Failed to fetch users");
                }
                const data: ApiResponse<PageResult<User>> = res?.data
                return data;
            } catch (error) {
                throw new Error("Failed to fetch users");
            }
        }
    });

    useEffect(() => {
        refetch();
    }, [pageSize, refetch, searchParams, pageIndex])

    const [user, setUser] = useState<User>();

    const form = useForm();

    const onSubmit = (data: any) => {
        setSearchParams(data)
    };

    const getGenderDisplay = (gender: string) => {
        switch (gender) {
            case "Male":
                return "Nam";
            case "Female":
                return "Nữ";
            default:
                return "Khác";
        }
    }

    const getRoleDisplay = (role: string) => {
        switch (role) {
            case "Administrator":
                return "Quản trị viên";
            case "Manager":
                return "Quản lí";
            case "Staff":
                return "Nhân viên";
            default:
                return "Khách hàng";
        }
    }
    const getRoleColor = (role: string) => {
        switch (role) {
            case "Administrator":
                return "bg-blue-50 text-blue-600";
            case "Manager":
                return "bg-yellow-50 text-yellow-600";
            case "Staff":
                return "bg-purple-50 text-purple-600";
            default:
                return "bg-gray-100 text-gray-500";
        }
    };


    return (
        <div className='m-10'>
            <div className='flex justify-between items-center'>
                <p className='text-2xl font-semibold leading-none tracking-tight'>Tài khoản</p>
                <Button onClick={() => {
                    setIsFormUser(true)
                }} size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                    <CirclePlus />
                    Tạo mới
                </Button>
            </div>
            {filter && (<div className='border p-5 rounded-lg shadow-sm mt-5 transform origin-top-right transition-all duration-5000 ease-in-out'>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10'>
                        <FormInputControl
                            form={form}
                            name="name"
                            disabled={isPending}
                            label="Tên"
                        />
                        <FormInputControl
                            form={form}
                            name="email"
                            disabled={isPending}
                            label="Email"
                        />
                        <FormInputControl
                            form={form}
                            name="phone"
                            disabled={isPending}
                            label="phone"
                        />
                        <FormInputControl
                            classNameInput='block w-full'
                            form={form}
                            name="birthday"
                            type='Date'
                            disabled={isPending}
                            label="Ngày sinh nhật"
                        />
                        <FormSelectControl
                            form={form}
                            name="gender"
                            disabled={isPending}
                            label="Giới tính"
                            items={[
                                { id: 'all', name: 'Tất cả' },
                                { id: 'Male', name: 'Nam' },
                                { id: 'Female', name: 'Nữ' },
                                { id: 'Other', name: 'Khác' }
                            ]}
                        />
                        <FormSelectControl
                            form={form}
                            name="role"
                            disabled={isPending}
                            label="Vai trò"
                            items={[
                                { id: 'all', name: 'Tất cả' },
                                { id: 'Administrator', name: 'Quản trị viên' },
                                { id: 'Manager', name: 'Quản lí' },
                                { id: 'Staff', name: 'Nhân viên' },
                                { id: 'Customer', name: 'Khách hàng' }
                            ]}
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
                            onClick={() => {
                                form.reset()
                                setPageIndex(1)
                                setSearchParams({});
                            }}
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
                        setPageIndex(1)
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
                            <TableHead className="w-[200px] min-w-[200px]">Tên</TableHead>
                            <TableHead className="w-fit min-w-[120px]">Email</TableHead>
                            <TableHead className="w-fit min-w-[130px]">SĐT</TableHead>
                            <TableHead className="w-fit min-w-[100px]">Giới tính</TableHead>
                            <TableHead className="w-fit min-w-[180px]">Vai trò</TableHead>
                            <TableHead className="w-fit min-w-[180px]">Trạng thái</TableHead>
                            <TableHead className="w-fit min-w-[140px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.value?.items.map((user: User) => <TableRow key={user.email}>
                            <TableCell className="font-bold">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{getGenderDisplay(user.gender)}</TableCell>
                            <TableCell>
                                <div className={`w-fit py-1 px-2 rounded-lg ${getRoleColor(user.role)}`}>
                                    {getRoleDisplay(user.role)}
                                </div>
                            </TableCell>
                            <TableCell>{user.isActive}
                                {user.isActive ? (
                                    <div className="bg-green-50 text-green-600 w-fit py-1 px-2 rounded-lg">Hoạt động</div>
                                ) : (
                                    <div className="bg-red-50 text-red-600 w-fit py-1 px-2 rounded-lg">Đã khóa</div>
                                )}
                            </TableCell>
                            <TableCell className='space-x-2'>
                                <Button
                                    onClick={() => {
                                        setIsFormUser(true)
                                        setUser(user)
                                    }}
                                    variant="outline"
                                    className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                >
                                    <Pencil />
                                </Button>
                                {user.role !== "Administrator" && (
                                    !user.isActive ? (
                                        <Button onClick={() => {
                                            setUser(user)
                                            setIsBanPopup(!isBanPopup)
                                        }} variant={"outline"} className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                                            <LockKeyhole />
                                        </Button>
                                    ) : (
                                        <Button onClick={() => {
                                            setUser(user)
                                            setIsBanPopup(!isBanPopup)
                                        }} variant={"outline"} className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                            <LockKeyholeOpen />
                                        </Button>
                                    )
                                )}
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaginationCustom itemsPerPage={pageSize} totalItems={users?.value?.totalCount ?? 0} onChangePageIndex={setPageIndex} />
            <DeleteDialog
                id={user?.id ?? ""}
                isOpen={isBanPopup} onClose={() => setIsBanPopup(!isBanPopup)}
                deleteFunction={banUser}
                refreshKey={[["Users"]]}
                name={user?.name}
                content={`Bạn có chắc chắn muốn ${user?.isActive ? "khóa tài khoản" : "mở khóa tài khoản"} ${user?.name} không?`}
                message={user?.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                classNameButton={user?.isActive ? "" : "bg-green-500 hover:bg-green-800"}
            />
            {isFormUser && (<FormUser isOpen={isFormUser} user={user} onClose={() => {
                setIsFormUser(false)
                setUser(undefined)
            }} />)}
        </div>
    )
}

export default UserPage