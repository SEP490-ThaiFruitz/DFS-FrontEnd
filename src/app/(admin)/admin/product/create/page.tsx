"use client";
import { createProduct } from '@/actions/product';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control';
import { FormSelectControl, SelectData } from '@/components/global-components/form/form-select-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiResponse } from '@/types/types';
import { CreateProductSafeTypes } from '@/zod-safe-types/product-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CirclePlus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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

  const { data: categories } = useFetch<ApiResponse<SelectData[]>>("/Categories/get-all-non-paging", ["categories"],{},{
    staleTime: 1000 * 60 * 1,
  })
  const { mutate: createProductMutation, isPending } = useMutation({
    mutationFn: async (values: FormData) => {
      const response = await createProduct(values);
      if (response.success) {
        return response.message
      } else {
        throw new Error(response.message);
      }
    },
    onSuccess: (value) => {
      form.reset();
      toast.success(value)
    },
    onError: (value) => {
      toast.error(value.message)
    }
  })

  const form = useForm<z.infer<typeof CreateProductSafeTypes>>({
    resolver: zodResolver(CreateProductSafeTypes),
  });

  const onSubmit = async (values: z.infer<typeof CreateProductSafeTypes>) => {
    const formData = new FormData();
    debugger
    formData.append("name", values.name);
    formData.append("categoryId", values.categoryId);
    formData.append("description", values.description);

    const images = [values.image, ...values.other]

    images.forEach(image => {
      formData.append("thumbnail", image);
    });

    // values.sizes.forEach((size, index) => {
    //   formData.append(`productSize[${index}][size]`, size.size.toString());
    //   formData.append(`productSize[${index}][quantity]`, size.quantity.toString());
    //   formData.append(`productSize[${index}][price]`, size.price.toString());
    // });

    values.sizes.forEach((size) => {
      formData.append(`productSize.size`, size.size.toString());
      formData.append(`productSize.quantity`, size.quantity.toString());
      formData.append(`productSize.price`, size.price.toString());
    });

    console.log({ formData })
    createProductMutation(formData);

  };

  const handleAddSize = () => {
    setProductSizes([...productSizes, { size: 0, quantity: 0, price: 0 }]);
  };

  const handleRemoveSize = (rowId: number) => {
    const sizes = form.getValues().sizes
    const updatedProducts = sizes.filter((_, index) => index !== rowId);
    form.reset({ sizes: updatedProducts });
    setProductSizes(updatedProducts);
    form.unregister(`sizes.${rowId}`);
    form.clearErrors(`sizes.${rowId}`);
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
                disabled={isPending}
                label="Tên sản phẩm"
              />
              <FormSelectControl
                form={form}
                name="categoryId"
                classNameInput='h-fit'
                placeholder='Chọn một loại sản phẩm'
                search={true}
                items={categories?.value}
                isImage
                disabled={isPending}
                label="Loại sản phẩm"
              />
              <FormInputControl
                form={form}
                name="description"
                disabled={isPending}
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
                disabled={isPending}
                label="Ảnh chính sản phẩm"
              />
              <FormFileControl
                form={form}
                name="other"
                classNameInput="h-30 w-full"
                mutiple={true}
                type={"image/jpeg, image/jpg, image/png, image/webp"}
                disabled={isPending}
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
            <div key={index + 1} className={`flex space-x-4 items-center mb-4 ${productSizes.length - 1 > index ? 'border-b-2 pb-4' : ''}`}>
              <div className='p-3 font-black'>{index + 1}</div>
              <FormNumberInputControl
                form={form}
                name={`sizes.${index}.size`}
                disabled={isPending}
                label="Khối lượng"
              />
              <FormNumberInputControl
                form={form}
                name={`sizes.${index}.quantity`}
                disabled={isPending}
                label="Số lượng"
              />
              <FormNumberInputControl
                form={form}
                name={`sizes.${index}.price`}
                disabled={isPending}
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
            "Tạo mới"
          )
        }
      />
    </FormValues >
  );
}

export default CreateProductPage;
