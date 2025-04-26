"use client"
import { API } from '@/actions/client/api-config'
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { PAYMENT_KEY } from '@/app/key/admin-key'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PayOsSettingSafeTypes } from '@/zod-safe-types/setting-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface PayOs {
    clientId: string
    apiKey: string
    checksumKey: string
    returnSuccessUrl: string
    returnCancelUrl: string
    returnUrlForWalletTopUp: string
}

const PayOsCard = () => {
    const { data: payos } = useFetch<PayOs>(`/Settings/${PAYMENT_KEY.PAYOS}`, [PAYMENT_KEY.PAYOS])
    const form = useForm<z.infer<typeof PayOsSettingSafeTypes>>({
        resolver: zodResolver(PayOsSettingSafeTypes)
    })

    useEffect(() => {
        if (payos) {
            form.reset({
                clientId: payos.clientId,
                apiKey: payos.apiKey,
                checksumKey: payos.checksumKey,
                returnSuccessUrl: payos.returnSuccessUrl,
                returnCancelUrl: payos.returnCancelUrl,
                returnUrlForWalletTopUp: payos.returnUrlForWalletTopUp
            })
        }
    }, [payos])

    const onSubmit = async (values: z.infer<typeof PayOsSettingSafeTypes>) => {
        try {
            const response = await API.update("/Settings", {
                name: PAYMENT_KEY.PAYOS,
                value: JSON.stringify({
                    clientId: values.clientId.trim(),
                    apiKey: values.apiKey.trim(),
                    checksumKey: values.checksumKey.trim(),
                    returnSuccessUrl: values.returnSuccessUrl.trim(),
                    returnCancelUrl: values.returnCancelUrl.trim(),
                    returnUrlForWalletTopUp: values.returnUrlForWalletTopUp.trim()
                })
            })
            if (response) {
                toast.success("Cập nhật cài đặt payos thành công")
            }
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <FormValues form={form} onSubmit={onSubmit}>
            <Card className='cardStyle'>
                <CardHeader>
                    <CardTitle>Cài đặt PayOs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid sm:grid-cols-2 gap-10'>
                        <FormInputControl
                            form={form}
                            name="clientId"
                            disabled={form.formState.isSubmitting}
                            label="Client ID"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="apiKey"
                            disabled={form.formState.isSubmitting}
                            label="API Key"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="checksumKey"
                            disabled={form.formState.isSubmitting}
                            label="Checksum Key"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="returnSuccessUrl"
                            disabled={form.formState.isSubmitting}
                            label="Link trả thanh toán thành công"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="returnCancelUrl"
                            disabled={form.formState.isSubmitting}
                            label="Link trả thanh toán thất bại"
                            require
                        />
                        <FormInputControl
                            form={form}
                            name="returnUrlForWalletTopUp"
                            disabled={form.formState.isSubmitting}
                            label="Link nạp ví trả về"
                            require
                        />
                    </div>
                </CardContent>
            </Card>
            <ButtonCustomized
                type="submit"
                className="min-w-32 max-w-fit px-2 bg-sky-600 hover:bg-sky-700 ml-auto"
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
    )
}

export default PayOsCard
