import { z } from "zod";

const isNotEmpty = (name: string) => name.trim().length > 0;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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
    image: z.string(
        { required_error: "Vui lòng chọn ảnh." }
    )
});