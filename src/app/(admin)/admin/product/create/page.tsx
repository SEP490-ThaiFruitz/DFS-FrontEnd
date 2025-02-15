"use client"
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormValues } from '@/components/global-components/form/form-values';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateProductSafeTypes } from '@/zod-safe-types/product-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

function CreateProductPage() {
  const [file, setFile] = useState<File>();
  const [imageOther, setImageOther] = useState<File[]>();

  const form = useForm<z.infer<typeof CreateProductSafeTypes>>({
    resolver: zodResolver(CreateProductSafeTypes),
  });

  const onSubmit = async (values: z.infer<typeof CreateProductSafeTypes>) => {
    try {

      console.log({ values });
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className='m-10'>
      <Card>
        <CardHeader>
          <CardTitle>Tạo mới sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <FormValues form={form} onSubmit={onSubmit}>
            <div className='grid sm:grid-cols-2 gap-20'>
              <div className='space-y-6'>
                <FormInputControl
                  form={form}
                  name="name"
                  disabled={form.formState.isSubmitting}
                  label="Tên sản phẩm"
                />
                <FormInputControl
                  form={form}
                  name="description"
                  disabled={form.formState.isSubmitting}
                  label="Mô tả sản phẩm"
                />
              </div>
              <div className='space-y-6'>
                <FormFileControl
                  form={form}
                  name="image"
                  classNameInput='h-30 w-full'
                  mutiple={false}
                  onChooseFile={(value: File[]) => setFile(value[0])}
                  type={'image/jpeg, image/jpg, image/png, image/webp'}
                  disabled={form.formState.isSubmitting}
                  label="Ảnh chính sản phẩm"
                />
                <FormFileControl
                  form={form}
                  name="other"
                  classNameInput='h-30 w-full'
                  mutiple={true}
                  onChooseFile={(value: File[]) => setImageOther(value)}
                  type={'image/jpeg, image/jpg, image/png, image/webp'}
                  disabled={form.formState.isSubmitting}
                  label="Ảnh phụ sản phẩm"
                />
              </div>
            </div>
          </FormValues>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateProductPage
