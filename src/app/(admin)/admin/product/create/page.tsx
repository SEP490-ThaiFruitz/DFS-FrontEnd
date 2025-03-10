"use client";
import { createProduct } from '@/actions/product';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormSelectControl, SelectData } from '@/components/global-components/form/form-select-control';
import FormTextEditorControl from '@/components/global-components/form/form-text-editor-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ApiResponse } from '@/types/types';
import { CreateProductSafeTypes } from '@/zod-safe-types/product-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CardCategory from './card-category';
import { useRouter } from 'next/navigation';

export interface CategorySelect extends SelectData {
  isChose: boolean;
}

function CreateProductPage() {
  const router = useRouter();
  const dryingMethods = [
    { id: "SunDrying", name: "Sấy bằng ánh nắng mặt trời" },
    { id: "HotAirDrying", name: "Sấy bằng không khí nóng" },
    { id: "FreezeDrying", name: "Sấy đông khô" },
    { id: "MicrowaveDrying", name: "Sấy bằng sóng vi ba" },
    { id: "VacuumDrying", name: "Sấy theo phương pháp chân không" },
    { id: "InfraredDrying", name: "Sấy bằng bức xạ hồng ngoại" },
    { id: "DrumDrying", name: "Sấy trong máy trống" }
  ];

  const { data: categories } = useFetch<ApiResponse<CategorySelect[]>>("/Categories/get-all-non-paging", ["categories"], {}, {
    staleTime: 1000 * 60 * 1,
  })
  const { mutate: createProductMutation, isPending } = useMutation({
    mutationFn: async (values: FormData) => {
      const response = await createProduct(values);
      if (response?.isSuccess) {
        return "Tạo sản phẩm thành công"
      } else {
        throw new Error(response?.status === 409 ? "Tên sản phẩm đã tồn tại" : "Lỗi hệ thống");
      }
    },
    onSuccess: (value) => {
      router.push("/admin/product")
      toast.success(value)
    },
    onError: (value) => {
      toast.error(value.message)
    }
  })

  const form = useForm<z.infer<typeof CreateProductSafeTypes>>({
    resolver: zodResolver(CreateProductSafeTypes),
    defaultValues: {
      description: "",
      categoryIds: []
    }
  });

  const onSubmit = async (values: z.infer<typeof CreateProductSafeTypes>) => {
    const formData = new FormData();

    formData.append("name", values.name);
    values.categoryIds.forEach(categoryId => {
      formData.append("categoryIds", categoryId);
    });
    formData.append("description", values.description);

    formData.append("origin", values.origin);

    formData.append("dryingMethod", values.dryingMethod);

    if (values.mainImageUrl) {
      formData.append("mainImageUrl", values.mainImageUrl[0]);
    }

    createProductMutation(formData);

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
                require
              />
              <FormInputControl
                form={form}
                name="origin"
                disabled={isPending}
                label="Nguồn gốc"
                require
              />
              <FormSelectControl
                form={form}
                name="dryingMethod"
                classNameInput='h-fit'
                placeholder='Chọn một phương pháp xấy'
                items={dryingMethods}
                disabled={isPending}
                label="Phương pháp xấy"
                require
              />
            </div>
            <div className="space-y-6">
              <FormFileControl
                form={form}
                name="mainImageUrl"
                classNameInput="h-30 w-full"
                mutiple={false}
                type={"image/jpeg, image/jpg, image/png, image/webp"}
                disabled={isPending}
                label="Ảnh chính sản phẩm"
                require
              />
            </div>
          </div>
          <div className='mt-5'>
            <Label className={`after:content-['(*)'] after:text-red-500 after:ml-1`}>Chọn loại sản phẩm</Label>
            <div className='mt-2 grid grid-cols-8 gap-10'>
              {categories?.value?.map((category: CategorySelect) =>
                <CardCategory
                  key={category.id}
                  category={category}
                  onChange={(isChoseCategory: boolean) => {
                    const categoryIds = form.getValues("categoryIds") || [];
                    const categoryId = category.id.toString();
                    if (!isChoseCategory) {
                      const index = categoryIds.findIndex(x => x === categoryId)
                      if (index !== -1) {
                        categoryIds.splice(index, 1)
                        form.setValue("categoryIds", categoryIds);
                      }
                      console.log(form.getValues("categoryIds"))
                    } else {
                      form.setValue("categoryIds", [...categoryIds, categoryId]);
                    }
                  }}
                />)}
            </div>
            <p className='text-sm font-medium text-destructive mt-2'>{form.getFieldState("categoryIds").error?.message}</p>
          </div>
          <div className='mt-5'>
            <FormTextEditorControl
              form={form}
              name="description"
              disabled={isPending}
              placeholder='Nhập mô tả sản phẩm'
              label="Mô tả sản phẩm"
              defaultValue={""}
              require
            />
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
            "Tạo mới"
          )
        }
      />
    </FormValues >
  );
}

export default CreateProductPage;
