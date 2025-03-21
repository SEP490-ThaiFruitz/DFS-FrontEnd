"use client"

import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import type { ApiResponse } from "@/types/types"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { Calendar, Droplet, Info, Package, Scale, ShieldCheck } from "lucide-react"
import { formatVND } from "@/lib/format-currency"

interface ConfirmInformationProps {
    formProduct: UseFormReturn<any>
}

interface NutritionSelect {
    Id: number
    Name: string
    Unit: string
}

interface PackagingType {
    id: string
    name: string
    packagingType: string
    packagingMaterial: string
    description: string
}

const ConfirmInformation = ({ formProduct }: Readonly<ConfirmInformationProps>) => {
    const { data: packageTypes } = useQuery<ApiResponse<PackagingType[]>>({ queryKey: ["packaging-types"] })
    const { getValues } = formProduct
    const values = getValues()
    const nutritionSelect: NutritionSelect[] = [
        { Id: 1, Name: "Tổng chất béo", Unit: "g" },
        { Id: 2, Name: "Chất béo bão hòa", Unit: "g" },
        { Id: 3, Name: "Chất béo chuyển hóa", Unit: "g" },
        { Id: 4, Name: "Cholesterol", Unit: "mg" },
        { Id: 5, Name: "Natri", Unit: "mg" },
        { Id: 6, Name: "Tổng carbohydrate", Unit: "g" },
        { Id: 7, Name: "Chất xơ", Unit: "g" },
        { Id: 8, Name: "Tổng đường", Unit: "g" },
        { Id: 9, Name: "Đường bổ sung", Unit: "g" },
        { Id: 10, Name: "Chất đạm", Unit: "g" },
    ]
    const dryingMethods = [
        { id: "SunDrying", name: "Sấy bằng ánh nắng mặt trời" },
        { id: "HotAirDrying", name: "Sấy bằng không khí nóng" },
        { id: "FreezeDrying", name: "Sấy đông khô" },
        { id: "MicrowaveDrying", name: "Sấy bằng sóng vi ba" },
        { id: "VacuumDrying", name: "Sấy theo phương pháp chân không" },
        { id: "InfraredDrying", name: "Sấy bằng bức xạ hồng ngoại" },
        { id: "DrumDrying", name: "Sấy trong máy trống" },
    ]

    return (
        <div className="space-y-8">
            <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Thông tin sản phẩm
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <h3 className="text-base font-medium text-muted-foreground">Tên sản phẩm</h3>
                            <div className="text-base font-medbium">{values.name}</div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-medium text-muted-foreground">Nguồn gốc xuất sứ</h3>
                            <div className="text-base">{values.origin}</div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-medium text-muted-foreground">Phương pháp sấy</h3>
                            <div className="text-base">{dryingMethods.find((x) => x.id === values.dryingMethod)?.name}</div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-medium text-muted-foreground">Độ ẩm</h3>
                            <div className="flex items-center gap-2">
                                <Droplet className="h-4 w-4 text-blue-500" />
                                <span className="text-base">{values.moistureContent}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-base font-medium text-muted-foreground">Mô tả sản phẩm</h3>
                        <div className="whitespace-pre-line text-base leading-relaxed p-3 rounded-md">
                            {values.description}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-base font-medium text-muted-foreground">Hình ảnh chính sản phẩm</h3>
                            <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                <Image
                                    src={values.image[0].preview || "/images/dried-fruit.webp"}
                                    alt={"main"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-base font-medium text-muted-foreground">Hình ảnh phụ sản phẩm</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {values.other.map((item: any, index: number) => (
                                    <div key={index + 1} className="relative aspect-square overflow-hidden rounded-md border">
                                        <Image
                                            src={item.preview || "/images/dried-fruit.webp"}
                                            alt={`Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-green-500" />
                        Thông tin dinh dưỡng
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-base font-medium text-muted-foreground">Thành phần</h3>
                            <div className="whitespace-pre-line text-base leading-relaxed p-3 rounded-md">
                                {values.ingredients}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-medium text-muted-foreground">Khối lượng khẩu phần</h3>
                            <div className="text-base p-3 rounded-md">
                                {values.servingSize}g
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-base font-medium text-muted-foreground">Thông tin dinh dưỡng</h3>
                        <div className="bg-muted/20 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-2 font-medium py-3 px-4 bg-muted/50 border-b">
                                <span>Chất dinh dưỡng</span>
                                <span>Số lượng</span>
                            </div>
                            {values.nutritionFacts?.map((fact: any, index: number) => {
                                const nutrient = nutritionSelect.find((x) => x.Id == fact.nutrientId)
                                return (
                                    <div
                                        key={`${index + 1}`}
                                        className={`grid grid-cols-2 py-3 px-4 border-b ${index % 2 === 0 ? "bg-muted/10" : ""}`}
                                    >
                                        <span className="font-medium">{nutrient?.Name}</span>
                                        <span>
                                            {fact.amount}
                                            {nutrient?.Unit}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-500" />
                        Biến thể sản phẩm
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-6">
                        {values.productVariants?.map((variant: any, index: number) => (
                            <Card key={`${index + 1}`} className="overflow-hidden border shadow-sm">
                                <div className="bg-muted/30 px-4 py-3 border-b">
                                    <h3 className="font-medium flex items-center gap-2">
                                        Chứng chỉ {index + 1}
                                    </h3>
                                </div>

                                <div className="p-4 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <h4 className="text-base font-medium text-muted-foreground">Hình ảnh</h4>
                                            <div className="relative h-32 w-full overflow-hidden rounded-md border">
                                                <Image
                                                    src={variant.image[0].preview || "/images/dried-fruit.webp"}
                                                    alt={`${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-base font-medium text-muted-foreground">Loại bao bì</h4>
                                            <div className="font-medium"> {packageTypes?.value?.find((x) => x.id == variant.packagingTypeId)?.name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-base font-medium text-muted-foreground">Hạn sử dụng</h4>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{variant.shelfLife}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/20 rounded-md">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-muted-foreground">Khối lượng tịnh</h4>
                                            <div className="font-medium">{variant.netWeight}g</div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-muted-foreground">Khối lượng tổng</h4>
                                            <div className="font-medium">{variant.grossWeight}g</div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-muted-foreground">Giá</h4>
                                            <div className="font-medium text-primary">
                                                {formatVND(variant.price)}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-muted-foreground">Số lượng tồn kho</h4>
                                            <div className="font-medium">{variant.stockQuantity}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/10 rounded-md">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-muted-foreground">Chiều dài</h4>
                                            <div>{variant.packagingLength}cm</div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-muted-foreground">Chiều rộng</h4>
                                            <div>{variant.packagingWidth}cm</div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-muted-foreground">Chiều cao</h4>
                                            <div>{variant.packagingHeight}cm</div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-medium text-muted-foreground">Thể tích</h4>
                                            <div>{variant.packagingVolume}cm³</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                        Chứng chỉ
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-4">
                        {values.certificates?.map((cert: any, index: number) => (
                            <Card key={`${index + 1}`} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-4 bg-muted/20 border-b">
                                    <h3 className="font-medium flex items-center gap-2">
                                        Chứng chỉ {index + 1}
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <h4 className="text-base font-medium text-muted-foreground">Tên</h4>
                                            <div className="font-medium">{cert.name}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-base font-medium text-muted-foreground">Tổ chức cấp</h4>
                                            <div className="font-medium">{cert.agency}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-base font-medium text-muted-foreground">Ngày cấp</h4>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <div>{formatTimeVietNam(cert.issueDate)}</div>
                                            </div>
                                        </div>
                                        {cert.expiryDate && (
                                            <div className="space-y-1">
                                                <h4 className="text-base font-medium text-muted-foreground">Ngày hết hạn</h4>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <div>{formatTimeVietNam(cert.expiryDate)}</div>
                                                </div>
                                            </div>
                                        )}
                                        {cert.details && (
                                            <div className="space-y-1 md:col-span-2">
                                                <h4 className="text-base font-medium text-muted-foreground">Chi tiết</h4>
                                                <div className="whitespace-pre-line text-base bg-muted/20 p-3 rounded-md">{cert.details}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ConfirmInformation

