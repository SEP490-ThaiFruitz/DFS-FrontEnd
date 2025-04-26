"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumberWithUnit, formatVND } from "@/lib/format-currency";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { ApiResponse } from "@/types/types";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useParams } from "next/navigation";
import { Voucher } from "./list-voucher";
import { VOUCHER_KEY } from "@/app/key/comm-key";

interface VoucherDetail extends Voucher {
    image: string;
    createdOnUtc: string;
    modifiedOnUtc: string;
    isDeleted: boolean;
}

function VoucherInformationDetail() {
    const { id } = useParams();
    const { data: voucher } = useFetch<ApiResponse<VoucherDetail>>(
        `/Vouchers/${id}`,
        [VOUCHER_KEY.VOUCHER_MANAGE, id as string],
    );

    return (
        <div className="m-10">
            <Card>
                <CardHeader className="border-b-2">
                    <CardTitle>Thông tin mã giảm giá</CardTitle>
                </CardHeader>
                <CardContent className="my-5 sm:mx-8 grid lg:grid-cols-2 gap-20">
                    <div className="border shadow-md rounded-xl h-full">
                        {voucher?.value?.image ? (
                            <Image
                                className="h-full w-full p-2"
                                src={voucher?.value?.image}
                                height={100}
                                width={100}
                                alt="image"
                            />
                        ) : (
                            <div className="h-full text-gray-500 w-full flex items-center justify-center text-center text-xl font-semibold">
                                <div className="flex space-x-5">
                                    <ImageOff />
                                    <span>Không có ảnh</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid gap-5">
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Tên:</span>
                            <span>{voucher?.value?.name}</span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Mã giảm giá:</span>
                            <span>{voucher?.value?.code}</span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Loại giảm giá:</span>
                            <span>
                                {voucher?.value?.discountType === "Amount"
                                    ? "Cố định"
                                    : "Phần trăm"}
                            </span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Giảm giá:</span>
                            <span>
                                {voucher?.value?.discountType === "Amount"
                                    ? formatVND(voucher?.value?.value)
                                    : formatNumberWithUnit(voucher?.value?.value ?? "N/A", "%")}
                            </span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Ngày bắt đầu:</span>
                            <span>
                                {formatTimeVietNam(
                                    new Date(voucher?.value?.startDate ?? "N/A"),
                                    true
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Ngày kết thúc:</span>
                            <span>
                                {formatTimeVietNam(
                                    new Date(voucher?.value?.endDate ?? "N/A"),
                                    true
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Đơn hàng tối thiểu:</span>
                            <span>
                                {formatVND(voucher?.value?.minimumOrderAmount ?? "N/A")}
                            </span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Giảm tối đa:</span>
                            <span>
                                {formatVND(voucher?.value?.maximumDiscountAmount ?? "N/A")}
                            </span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Số lượng:</span>
                            <span>
                                {formatNumberWithUnit(voucher?.value?.quantity ?? "N/A")}
                            </span>
                        </div>
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Ngày tạo:</span>
                            <span>
                                {formatTimeVietNam(
                                    new Date(voucher?.value?.createdOnUtc ?? "N/A"),
                                    true
                                )}
                            </span>
                        </div>
                        {voucher?.value?.modifiedOnUtc && (
                            <div className="flex justify-between gap-20">
                                <span className="font-bold">Ngày cập nhật:</span>
                                <span>
                                    {formatTimeVietNam(
                                        new Date(voucher?.value?.modifiedOnUtc ?? "N/A"),
                                        true
                                    )}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between gap-20">
                            <span className="font-bold">Trạng thái:</span>
                            {voucher?.value?.isDeleted ? (
                                <span className="bg-red-50 text-red-600 w-fit py-1 px-2 rounded-lg">
                                    Đã xóa
                                </span>
                            ) : (
                                <span className="bg-green-50 text-green-600 w-fit py-1 px-2 rounded-lg">
                                    Hoạt động
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default VoucherInformationDetail;
