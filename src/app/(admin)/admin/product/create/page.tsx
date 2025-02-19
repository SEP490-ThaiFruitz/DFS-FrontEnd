"use client";
import { getCategories } from '@/actions/category';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control';
import { FormSelectControl, SelectData } from '@/components/global-components/form/form-select-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from '@/features/admin/category/column';
import { PageResult, ResponseData } from '@/types/types';
import { CreateProductSafeTypes } from '@/zod-safe-types/product-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ProductSize {
  size: number;
  quantity: number;
  price: number;
}

function CreateProductPage() {
  const [productSizes, setProductSizes] = useState<ProductSize[]>([{ size: 0, quantity: 0, price: 0 }]);
  const [categories, setCategories] = useState<SelectData[]>();


  useEffect(() => {
    getCategories().then((response: any) => {
      if (response?.success) {
        const data = response?.data as ResponseData<PageResult<Category>>
        setCategories(data?.value?.items);
      } else {
        toast.error(response.message)
      }
    });
  }, []);

  const form = useForm<z.infer<typeof CreateProductSafeTypes>>({
    resolver: zodResolver(CreateProductSafeTypes),
  });

  const onSubmit = async (values: z.infer<typeof CreateProductSafeTypes>) => {
    try {
      console.log({ values, productSizes });
    } catch (error) {
      console.log({ error });
    }
  };

  const handleAddSize = () => {
    setProductSizes([...productSizes, { size: 0, quantity: 0, price: 0 }]);
  };

  const handleRemoveSize = (rowId: number) => {
    const updatedProducts = productSizes.filter((_, index) => index !== rowId + 2);
    setProductSizes(updatedProducts);
    form.reset({ sizes: updatedProducts });
    form.unregister(`sizes.${rowId + 2}`);
    form.clearErrors(`sizes.${rowId + 2}`);
  };

  return (
    <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
      <Card>
        <CardHeader>
          <CardTitle>Tạo mới sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
            <div className="space-y-6">
              <FormInputControl
                form={form}
                name="name"
                disabled={form.formState.isSubmitting}
                label="Tên sản phẩm"
              />
              <FormSelectControl
                form={form}
                name="categoryId"
                classNameInput='h-fit'
                placeholder='Chọn một loại sản phẩm'
                search={true}
                items={categories}
                isImage
                disabled={form.formState.isSubmitting}
                label="Loại sản phẩm"
              />
              <FormInputControl
                form={form}
                name="description"
                disabled={form.formState.isSubmitting}
                label="Mô tả sản phẩm"
              />
            </div>
            <div className="space-y-6">
              <FormFileControl
                form={form}
                name="image"
                classNameInput="h-30 w-full"
                mutiple={false}
                type={"image/jpeg, image/jpg, image/png, image/webp"}
                disabled={form.formState.isSubmitting}
                label="Ảnh chính sản phẩm"
              />
              <FormFileControl
                form={form}
                name="other"
                classNameInput="h-30 w-full"
                mutiple={true}
                type={"image/jpeg, image/jpg, image/png, image/webp"}
                disabled={form.formState.isSubmitting}
                label="Ảnh phụ sản phẩm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kích thước sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className='w-fit'>
          {productSizes.map((_, index) => (
            <div key={index} className={`flex space-x-4 items-center mb-4 ${productSizes.length - 1 > index ? 'border-b-2 pb-4' : ''}`}>
              <div className='p-3 font-black'>{index + 1}</div>
              <FormNumberInputControl
                form={form}
                name={`sizes.${index}.size`}
                disabled={form.formState.isSubmitting}
                label="Khối lượng"
              />
              <FormNumberInputControl
                form={form}
                name={`sizes.${index}.quantity`}
                disabled={form.formState.isSubmitting}
                label="Số lượng"
              />
              <FormNumberInputControl
                form={form}
                name={`sizes.${index}.price`}
                disabled={form.formState.isSubmitting}
                isMoney
                label="Giá"
              />
              {index > 0 && (
                <Button
                  className="mt-8"
                  variant="destructive"
                  type="button"
                  onClick={() => handleRemoveSize(index)}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          ))}
        </CardContent>

        <div className="flex justify-center pb-5">
          <Button
            className="bg-green-500 hover:bg-green-700 flex items-center"
            type="button"
            onClick={handleAddSize}
          >
            <CirclePlus className="mr-2" />
            Thêm kích thước
          </Button>
        </div>
      </Card>

      <ButtonCustomized
        type="submit"
        className="max-w-32 bg-green-500 hover:bg-green-700"
        variant="secondary"
        disabled={form.formState.isSubmitting}
        label={
          form.formState.isSubmitting ? (
            <WaitingSpinner
              variant="pinwheel"
              label="Đang tạo..."
              className="font-semibold"
              classNameLabel="font-semibold text-sm"
            />
          ) : (
            "Tạo mới"
          )
        }
      />
    </FormValues >
  );
}

export default CreateProductPage;
