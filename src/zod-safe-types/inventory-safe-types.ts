import { z } from "zod";

export const CreatePlanSafeTypes = z.object({
    name: z.string({
        required_error: "Vui lòng nhập tên kế hoạch"
    }).nonempty({
        message: "Vui lòng lòng nhập tên kế hoạch"
    }),
    requestType: z.string({
        required_error: "Vui lòng lòng chọn loại kế hoạch"
    }).nonempty({
        message: "Vui lòng lòng chọn loại kế hoạch"
    }),
    description: z.string({
        required_error: "Vui lòng nhập mô tả kế hoạch"
    }).nonempty({
        message: "Vui lòng lòng nhập mô tả kế hoạch"
    }),
    expectedDate: z.date({
        required_error: "Vui lòng chọn ngày dự tính",
        message: "Vui lòng chọn ngày dự tính"
    }),
    requestItems: z
        .array(
            z.object({
                productId: z.string(),
                variantId: z.string(),
                image: z.string(),
                name: z.string(),
                packageType: z.string(),
                netWeight: z.number(),
                quantity: z.number().min(1, "Số lượng phải lớn hơn 0")
            })
        )
        .min(1, "Phải chọn ít nhất một sản phẩm"),
})