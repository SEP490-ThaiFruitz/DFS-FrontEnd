"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { DataTable } from "@/components/global-components/data-table/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { Button } from "@/components/ui/button"
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { API } from "@/actions/client/api-config"
import FormCertification from "./form-certifcation"
import { CertificationDialog } from "./dialog-view-detail"

export interface Certification {
    id: number
    name: string
    image: string
    agency: string
    issueDate: Date
    expiryDate: Date | null
    details: string
    products: Product[]
}

interface Product {
    id: string
    name: string
    image: string
}

const CertificationPage = () => {
    const { data: certifications, isLoading } = useFetch<Certification[]>("/Certifications", ["certifications"])
    const [certificationRemove, setCertificationRemove] = useState<Certification | undefined>(undefined)
    const [selectedCertification, setSelectedCertification] = useState<Certification | undefined>(undefined)
    const [certificationEdit, setCertificationEdit] = useState<Certification | undefined>(undefined)
    const [isCreate, setIsCreate] = useState<boolean>(false)
    const columns: ColumnDef<Certification>[] = [
        {
            accessorKey: "image",
            header: "Hình ảnh",
            cell: ({ row }) => (
                <ImagePreview
                    images={[row.original.image]}
                    className="h-30 w-30 object-cover hover:cursor-pointer"
                />
            ),
        },
        {
            accessorKey: "name",
            header: "Tên chứng chỉ",
        },
        {
            accessorKey: "agency",
            header: "Cơ quan cấp",
        },
        {
            accessorKey: "issueDate",
            header: "Ngày cấp",
            cell: ({ row }) => formatTimeVietNam(row.original.issueDate),
        },
        {
            accessorKey: "expiryDate",
            header: "Ngày hết hạn",
            cell: ({ row }) => row.original.expiryDate && formatTimeVietNam(row.original.expiryDate),
        },
        {
            id: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const now = new Date()
                const isExpired = row.original.expiryDate ? row.original.expiryDate < now : false

                return <Badge variant={isExpired ? "destructive" : "outline"}>{isExpired ? "Hết hạn" : "Còn hiệu lực"}</Badge>
            },
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => (
                <div className="space-x-3">
                    <Button
                        variant="outline"
                        className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        onClick={() => setSelectedCertification(row.original)}
                    >
                        <Eye />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setCertificationEdit(row.original)}
                        className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                    >
                        <Pencil />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setSelectedCertification(row.original)}
                        className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                        <Trash2 />
                    </Button>
                </div>
            ),
        },
    ]

    if (isLoading) {
        return (
            <div className="m-10 space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="space-y-2">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                </div>
            </div>
        )
    }

    const handleDelete = async (id: string) => {
        return await API.remove(`/Certifications/${id}`)
    }

    return (
        <div className="m-10">
            <div className="mb-6 flex items-center justify-between">
                <div className="text-2xl font-semibold leading-none tracking-tight">Danh sách chứng chỉ</div>
                <Button onClick={() => setIsCreate(true)} size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                    <CirclePlus />
                    Tạo chứng chỉ
                </Button>
            </div>
            <DataTable data={certifications ?? []} columns={columns} searchFiled="name" />

            {certificationRemove && (
                <DeleteDialog
                    deleteFunction={handleDelete}
                    isOpen={certificationRemove !== undefined}
                    onClose={() => setCertificationRemove(undefined)}
                    id={certificationRemove.id.toString()}
                    name={certificationRemove.name}
                    refreshKey={[["certifications"]]}
                />
            )}
            {certificationEdit && (
                <FormCertification
                    isOpen={certificationEdit !== undefined}
                    onClose={() => setCertificationEdit(undefined)}
                    certification={certificationEdit}
                />
            )}
            {isCreate && (
                <FormCertification
                    isOpen={isCreate}
                    onClose={() => setIsCreate(false)}
                />
            )}
            {selectedCertification && (
                <CertificationDialog
                    isOpen={selectedCertification !== undefined}
                    onClose={() => setSelectedCertification(undefined)}
                    certification={selectedCertification}
                />
            )}
        </div>
    )
}

export default CertificationPage

