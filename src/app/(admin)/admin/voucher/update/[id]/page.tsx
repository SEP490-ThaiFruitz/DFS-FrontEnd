"use client";
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control';
import { FormSelectControl } from '@/components/global-components/form/form-select-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateVoucherSafeTypes } from '@/zod-safe-types/voucher-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

function UpdateVoucherPage() {
  const { id } = useParams();
  const [coupon] = useState({ name: 'Ưu Đãi Mua Số Lượng Lớn', code: 'bulk50', discount: '50.00', discountType: 'Fixed', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-25T12:00:00+00:00' });
  const { isPending } = useMutation({
    // mutationFn: async (values: FormData) => {
    //   const response = await createVoucher(values);
    //   if (response.success) {
    //     return response.message
    //   } else {
    //     throw new Error(response.message);
    //   }
    // },
    // onSuccess: (value) => {
    //   form.reset();
    //   toast.success(value)
    // },
    // onError: (value) => {
    //   toast.error(value.message)
    // }
  })

  const form = useForm<z.infer<typeof CreateVoucherSafeTypes>>({
    resolver: zodResolver(CreateVoucherSafeTypes),
    defaultValues: {
      name: coupon.name,
      code: coupon.code,
      discountType: coupon.discountType === 'Fixed' ? 'Fixed' : 'Percentage',
      moneyDiscount: coupon.discountType === 'Fixed' ? coupon.discount : undefined,
      percentDiscount: coupon.discountType === 'Percentage' ? coupon.discount : undefined,
      startDate: new Date(coupon.startDate).toISOString().split('T')[0],
      endDate: new Date(coupon.endDate).toISOString().split('T')[0],
      minimumOrderAmount: "0",
      maximumDiscount: "0",
      quantity: "0"
    }
  });

  const onSubmit = async (values: z.infer<typeof CreateVoucherSafeTypes>) => {
    console.log({ values })
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
                  { id: 'Fixed', name: 'Cố định' },
                  { id: 'Percentage', name: 'Phần trăm' },
                ]}
                disabled={isPending}
                label="Chọn loại giảm giá"
              />
              {form.watch("discountType") && form.getValues("discountType") !== undefined ? form.getValues("discountType") === 'Fixed' ? <FormNumberInputControl
                form={form}
                name="moneyDiscount"
                isMoney
                disabled={isPending}
                label="Số tiền giảm"
              /> : <FormNumberInputControl
                form={form}
                unit='%'
                name="percentDiscount"
                disabled={isPending}
                label="Số phần trăm giảm"
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
                />
                <FormInputControl
                  isMinDate
                  classNameInput='block'
                  form={form}
                  name="endDate"
                  disabled={isPending}
                  type='Date'
                  label="Ngày kết thúc"
                />
                <FormNumberInputControl
                  form={form}
                  name="minimumOrderAmount"
                  disabled={isPending}
                  isMoney
                  label="Đơn hàng tối thiểu"
                />
                <FormNumberInputControl
                  form={form}
                  name="maximumDiscount"
                  disabled={isPending}
                  isMoney
                  label="Giảm tối đa"
                />
                <FormNumberInputControl
                  form={form}
                  name="quantity"
                  disabled={isPending}
                  label="Số lượng"
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
              label="Đang tạo..."
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
