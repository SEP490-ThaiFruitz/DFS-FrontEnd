"use client";
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control';
import { FormSelectControl } from '@/components/global-components/form/form-select-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiResponse } from '@/types/types';
import { UpdateVoucherSafeTypes } from '@/zod-safe-types/voucher-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Voucher } from '../../page';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { updateVoucher } from '@/actions/voucher';
import { useEffect } from 'react';

function UpdateVoucherPage() {
  const { id } = useParams();
  const { data: voucher } = useFetch<ApiResponse<Voucher>>(`/Vouchers/${id}`)

  const { isPending, mutate: updateVoucherMutation } = useMutation({
    mutationFn: async (values: FormData) => {
      const response = await updateVoucher(values.get("id")?.toString() ?? '', values);
      try {
        if (!response?.isSuccess) {
          if (response?.status === 409) {
            throw new Error("Tên mã giảm giá đã tồn tại")
          }
          throw new Error("Lỗi hệ thống")
        }
      } catch (error: unknown) {
        throw new Error(error instanceof Error ? error?.message : "Lỗi hệ thống");
      }
    },
    onSuccess: () => {
      toast.success("Cập nhật mã giảm giá thành công")
    },
    onError: (value) => {
      toast.error(value.message)
    }
  })

  const form = useForm<z.infer<typeof UpdateVoucherSafeTypes>>({
    resolver: zodResolver(UpdateVoucherSafeTypes),
    defaultValues: {
      id: '',
      name: '',
      code: '',
      discountType: 'Amount',
      moneyDiscount: '',
      percentDiscount: '',
      startDate: '',
      endDate: '',
      minimumOrderAmount: '',
      maximumDiscount: '',
      quantity: '',
    },
  });

  useEffect(() => {
    if (voucher?.value) {
      form.reset({
        id: voucher.value.id ?? '',
        name: voucher.value.name ?? '',
        code: voucher.value.code?.toString() ?? '',
        discountType: voucher.value.discountType === 'Amount' ? 'Amount' : 'Percentage',
        moneyDiscount:
          voucher.value.discountType === 'Amount' ? voucher.value.value?.toString() ?? '' : undefined,
        percentDiscount:
          voucher.value.discountType === 'Percentage' ? voucher.value.value?.toString() ?? '' : undefined,
        startDate: voucher.value.startDate
          ? new Date(voucher.value.startDate).toISOString().split('T')[0]
          : '',
        endDate: voucher.value.endDate
          ? new Date(voucher.value.endDate).toISOString().split('T')[0]
          : '',
        minimumOrderAmount: voucher.value.minimumOrderAmount?.toString() ?? '',
        maximumDiscount: voucher.value.maximumDiscountAmount?.toString() ?? '',
        quantity: voucher.value.quantity?.toString() ?? '',
      });
    }
  }, [voucher, form.reset, form]);
  const onSubmit = async (values: z.infer<typeof UpdateVoucherSafeTypes>) => {
    const formData = new FormData()
    formData.append("id", values.id)
    formData.append("name", values.name)
    if (values.code) {
      formData.append("code", values.code)
    }
    if (values.moneyDiscount) {
      formData.append("value", values.moneyDiscount)
    } else if (values.percentDiscount) {
      formData.append("value", values.percentDiscount)
    }
    formData.append("discountType", values.discountType)
    formData.append("startDate", values.startDate)
    formData.append("endDate", values.endDate)
    if (values.image) {
      formData.append("image", values.image[0])
    }
    formData.append("minimumOrderAmount", values.minimumOrderAmount)
    formData.append("maximumDiscountAmount", values.maximumDiscount)
    alert(values.maximumDiscount)
    formData.append("quantity", values.quantity)

    updateVoucherMutation(formData)
  };


  return (
    <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
      <Card>
        <CardHeader>
          <CardTitle>Cập nhật mã giảm giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
            <div className="space-y-6">
              <FormInputControl
                form={form}
                name="name"
                disabled={isPending}
                label="Tên mã giảm giá"
                require
              />
              <FormInputControl
                form={form}
                name="code"
                disabled={isPending}
                label="Mã giảm giá"
              />
              <FormSelectControl
                form={form}
                name="discountType"
                classNameInput='h-fit'
                placeholder='Chọn loại giảm giá'
                items={[
                  { id: 'Amount', name: 'Cố định' },
                  { id: 'Percentage', name: 'Phần trăm' },
                ]}
                disabled={isPending}
                label="Chọn loại giảm giá"
                require
              />
              {form.watch("discountType") && form.getValues("discountType") !== undefined ? form.getValues("discountType") === 'Amount' ? <FormNumberInputControl
                form={form}
                name="moneyDiscount"
                isMoney
                disabled={isPending}
                label="Số tiền giảm"
                require
              /> : <FormNumberInputControl
                form={form}
                unit='%'
                name="percentDiscount"
                disabled={isPending}
                label="Số phần trăm giảm"
                require
              /> : null}
              <div className='grid sm:grid-cols-2 gap-5'>
                <FormInputControl
                  isMinDate
                  classNameInput='block'
                  form={form}
                  name="startDate"
                  disabled={isPending}
                  type='Date'
                  label="Ngày bắt đầu"
                  require
                />
                <FormInputControl
                  isMinDate
                  classNameInput='block'
                  form={form}
                  name="endDate"
                  disabled={isPending}
                  type='Date'
                  label="Ngày kết thúc"
                  require
                />
                <FormNumberInputControl
                  form={form}
                  name="minimumOrderAmount"
                  disabled={isPending}
                  isMoney
                  label="Đơn hàng tối thiểu"
                  require
                />
                <FormNumberInputControl
                  form={form}
                  name="maximumDiscount"
                  disabled={isPending}
                  isMoney
                  label="Giảm tối đa"
                  require
                />
                <FormNumberInputControl
                  form={form}
                  name="quantity"
                  disabled={isPending}
                  label="Số lượng"
                  require
                />
              </div>
            </div>
            <div className="space-y-6">
              <FormFileControl
                form={form}
                name="image"
                classNameInput="h-30 w-full"
                mutiple={false}
                type={"image/jpeg, image/jpg, image/png, image/webp"}
                disabled={isPending}
                label="Ảnh mã giảm giá"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ButtonCustomized
        type="submit"
        className="max-w-32 bg-green-500 hover:bg-green-700"
        variant="secondary"
        disabled={isPending}
        label={
          isPending ? (
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
    </FormValues >
  );
}

export default UpdateVoucherPage;
