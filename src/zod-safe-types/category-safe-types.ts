import { z } from "zod";

const isNotEmpty = (name: string) => name.trim().length > 0;

export const CreateCategorySafeTypes = z.object({
    name: z.string({
        required_error: "Vui lòng nhập tên loại sản phẩm.",
    })
        .min(1, { message: "Vui lòng nhập tên loại sản phẩm." })
        .nonempty(),
    description: z.string({
        required_error: "Vui lòng nhập mô tả loại sản phẩm.",
    }).refine(isNotEmpty, {
        message: "Vui lòng nhập mô tả loại sản phẩm",
    }),
    image: z.any()
        .refine((file) => file != null, "Vui lòng chọn ảnh")
});

export const UpdateCategorySafeTypes = z.object({
    name: z.string({
        required_error: "Vui lòng nhập tên loại sản phẩm.",
    })
        .min(1, { message: "Vui lòng nhập tên loại sản phẩm." })
        .nonempty(),
    description: z.string({
        required_error: "Vui lòng nhập mô tả loại sản phẩm.",
    }).refine(isNotEmpty, {
        message: "Vui lòng nhập mô tả loại sản phẩm",
    }),
    isActive: z.boolean(),
    image: z.any()
});