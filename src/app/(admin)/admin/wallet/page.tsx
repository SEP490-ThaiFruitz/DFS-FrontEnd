"use client"

import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { WALLET_KEY } from '@/app/key/admin-key';
import { DataTableSkeleton } from '@/components/global-components/custom-skeleton/data-table-skeleton';
import { DataTableCustom } from '@/components/global-components/data-table/data-table-custom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatVND } from '@/lib/format-currency';
import { formatVietnamesePhoneNumber } from '@/lib/format-phone-number';
import { formatTimeVietNam } from '@/lib/format-time-vietnam';
import { ApiResponse } from '@/types/types';
import { ColumnDef } from '@tanstack/react-table';
import { Banknote, Lock, LockOpen, Wallet } from 'lucide-react';
import React from 'react'


interface UserWalets {
  totalActiveWallet: number;
  totalLockWallet: number,
  totalMoney: number
  totalWallet: number
  wallets: Wallet[]
}
interface Wallet {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  balance: number;
  failureCount: number;
  createdOnUtc: string;
  modifiedOnUtc: string;
}

function WalletPage() {
  const {
    data: walllets,
    isLoading
  } = useFetch<ApiResponse<UserWalets>>(`/Wallets`, [WALLET_KEY.WALLET])


  const columns: ColumnDef<Wallet>[] = [
    {
      accessorKey: "user",
      accessorFn: row => row.user.name,
      header: "Người dùng",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              {user.phone && (
                <div className="text-xs text-muted-foreground">{formatVietnamesePhoneNumber(user.phone)}</div>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "walletNumber",
      header: "Mã ví",
      cell: ({ row }) => row.original.id.replace(/-/g, ""),
    },
    {
      accessorKey: "balance",
      header: "Số dư",
      cell: ({ row }) => formatVND(row.original.balance),
    },
    {
      accessorKey: "failureCount",
      header: "Trạng thái",
      cell: ({ row }) => row.original.failureCount < 3 ? (
        <div className="bg-green-50 text-green-600 w-fit py-1 px-2 rounded-lg" > Hoạt động</div>
      ) : (
        <div className="bg-red-50 text-red-600 w-fit py-1 px-2 rounded-lg">Đã khóa</div>
      )
    },
    {
      accessorKey: "createdOnUtc",
      header: "Ngày tạo",
      cell: ({ row }) => {
        return formatTimeVietNam(new Date(row.original.createdOnUtc), true)
      },
    },
    {
      accessorKey: "modifiedOnUtc",
      header: "Ngày cập nhật",
      cell: ({ row }) => {
        return formatTimeVietNam(new Date(row.original.modifiedOnUtc), true)
      },
    },
  ]

  return (
    <div className='m-10'>
      <div className="text-2xl font-semibold leading-none tracking-tight mb-6">Danh sách ví</div>

      {isLoading ? (
        <div className="w-full">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-28" />
                  </CardContent>
                </Card>
              ))}

          </div>
          <div className="mt-8">
            <DataTableSkeleton />
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-all hover:shadow-md cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng tiền</CardTitle>
                <div className="bg-green-50 rounded-full p-3 border">
                  <Banknote className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatVND(walllets?.value?.totalMoney || 0)}</div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng ví</CardTitle>
                <div className="bg-blue-50 rounded-full p-3 border">
                  <Wallet className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{walllets?.value?.totalWallet || 0}</div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang hoạt động </CardTitle>
                <div className="bg-purple-50 rounded-full p-3 border">
                  <LockOpen className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{walllets?.value?.totalActiveWallet || 0}</div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã khóa</CardTitle>
                <div className="bg-red-50 rounded-full p-3 border">
                  <Lock className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{walllets?.value?.totalLockWallet || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-lg shadow border">
              {isLoading ? <DataTableSkeleton /> :
                <DataTableCustom data={walllets?.value?.wallets ?? []} columns={columns} placeholder="tên người dùng" searchFiled="user" />}
            </div>
          </div>
        </>
      )
      }

    </div >
  )
}

export default WalletPage
