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

export const ImportWareSafeTypes = z.object({
    productBatchId: z.string({
        required_error: "Vui lòng chọn lô",
        message: "Vui lòng chọn lô",
    }).nonempty({
        message: "Vui lòng chọn lô",
    }),
    productBatchItemId: z.string({
        required_error: "Vui lòng sản phẩm",
        message: "Vui lòng sản phẩm",
    }).nonempty({
        message: "Vui lòng sản phẩm",
    }),
    orderId: z.string().optional(),
    quantity: z.string({
        required_error: "Vui lòng nhập số lượng",
        message: "Vui lòng nhập số lượng",
    }).nonempty({
        message: "Vui lòng nhập số lượn",
    }).refine((val) => parseFloat(val) > 0, "Số lượng hơn 0"),
    note: z.string({
        required_error: "Vui lòng ghi chú",
        message: "Vui lòng ghi chú",
    }).nonempty({
        message: "Vui lòng ghi chú",
    })
})

export const ExportWareSafeTypes = z.object({
    productBatchId: z.string({
        required_error: "Vui lòng chọn lô",
        message: "Vui lòng chọn lô",
    }).nonempty({
        message: "Vui lòng chọn lô",
    }),
    orderId: z.string().optional(),
    exportType: z.string({
        required_error: "Vui lòng chọn loại xuất",
        message: "Vui lòng chọn loại xuất",
    }).nonempty({
        message: "Vui lòng chọn loại xuất",
    }),
    productBatchItemId: z.string({
        required_error: "Vui lòng sản phẩm",
        message: "Vui lòng sản phẩm",
    }).nonempty({
        message: "Vui lòng sản phẩm",
    }),
    quantity: z.string({
        required_error: "Vui lòng nhập số lượng",
        message: "Vui lòng nhập số lượng",
    }).nonempty({
        message: "Vui lòng nhập số lượn",
    }).refine((val) => parseFloat(val) > 0, "Số lượng hơn 0"),
    note: z.string({
        required_error: "Vui lòng ghi chú",
        message: "Vui lòng ghi chú",
    }).nonempty({
        message: "Vui lòng ghi chú",
    })
})