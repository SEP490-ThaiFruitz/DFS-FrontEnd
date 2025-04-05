"use client"

import { API } from '@/actions/client/api-config'
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { PAYMENT_KEY } from '@/app/key/admin-key'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VnPaySettingSafeTypes } from '@/zod-safe-types/setting-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface VnPay {
    returnUrl: string
    url: string
    tmnCode: string
    hashSecret: string
    api: string
}

const VnPayCard = () => {
    const { data: vnpay } = useFetch<VnPay>(`/Settings/${PAYMENT_KEY.VNPAY}`, [PAYMENT_KEY.VNPAY])

    const form = useForm<z.infer<typeof VnPaySettingSafeTypes>>({
        resolver: zodResolver(VnPaySettingSafeTypes),
    })

    useEffect(() => {
        if (vnpay) {
            form.reset({
                api: vnpay.api,
                returnUrl: vnpay.returnUrl,
                hashSecret: vnpay.hashSecret,
                tmnCode: vnpay.tmnCode,
                url: vnpay.url
            })
        }
    }, [vnpay])

    const onSubmit = async (values: z.infer<typeof VnPaySettingSafeTypes>) => {
        try {
            const response = await API.update("/Settings", {
                name: PAYMENT_KEY.VNPAY,
                value: JSON.stringify({
                    returnUrl: values.returnUrl.trim(),
                    url: values.url.trim(),
                    tmnCode: values.tmnCode.trim(),
                    hashSecret: values.hashSecret.trim(),
                    api: values.api.trim(),
                })
            })
            if (response) {
                toast.success("Cập nhật cài đặt vnpay thành công")
            }
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cài đặt VnPay</CardTitle>
            </CardHeader>
            <CardContent>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid sm:grid-cols-2 gap-10'>
                        <FormInputControl
                            form={form}
                            name="returnUrl"
                            disabled={form.formState.isSubmitting}
                            label="Link trả về"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="url"
                            disabled={form.formState.isSubmitting}
                            label="Link sanbox"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="tmnCode"
                            disabled={form.formState.isSubmitting}
                            label="Mã code (TmnCode)"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="hashSecret"
                            disabled={form.formState.isSubmitting}
                            label="Mã bí mật (HashSecret)"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="api"
                            disabled={form.formState.isSubmitting}
                            label="Api giao dịch"
                            require
                        />
                    </div>
                    <ButtonCustomized
                        type="submit"
                        className="max-w-fit px-2 bg-green-500 hover:bg-green-700 ml-auto"
                        variant="secondary"
                        disabled={form.formState.isSubmitting}
                        label={
                            form.formState.isSubmitting ? (
                                <WaitingSpinner
                                    variant="pinwheel"
                                    label="Đang cập nhật..."
                                    className="font-semibold"
                                    classNameLabel="font-semibold text-sm"
                                />
                            ) : (
                                "Cập nhật"
                            )
                        }
                    />
                </FormValues>
            </CardContent>
        </Card>
    )
}

export default VnPayCard
