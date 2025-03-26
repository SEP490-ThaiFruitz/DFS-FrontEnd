import { z } from "zod";

export const CreateComboSafeTypes = z.object({
    name: z.string({
        required_error: "Vui lòng nhập tên gói quà.",
    })
        .min(1, { message: "Vui lòng nhập tên gói quà." })
        .nonempty(),
    capacity: z.string().refine((val) => parseFloat(val) > 0, "Khối lượng tổng phải lớn hơn 0"),
    quantity: z.string().refine((val) => parseFloat(val) > 1, "Số lượng phải lớn hơn 1"),
    type: z.string({
        required_error: "Vui lòng nhập chọn loại quà.",
    }).nonempty({
        message: "Vui lòng nhập chọn loại quà.",
    }),
    eventId: z.string(),
    description: z.string({
        required_error: "Vui lòng nhập mô tả gói quà.",
    }).nonempty({
        message: "Vui lòng nhập mô tả gói quà",
    }),
    image: z.any()
        .refine((file) => file != null, "Vui lòng chọn ảnh"),
    selectedProducts: z
        .array(
            z.object({
                productId: z.string(),
                variantId: z.string(),
                image: z.string(),
                name: z.string(),
                packageType: z.string(),
                netWeight: z.number(),
                price: z.number(),
                quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
            })
        )
        .min(1, "Phải chọn ít nhất một sản phẩm"),
});

export const UpdateComboSafeTypes = z.object({
    comboId: z.string(),
    name: z.string({
        required_error: "Vui lòng nhập tên gói quà.",
    })
        .min(1, { message: "Vui lòng nhập tên gói quà." })
        .nonempty(),
    capacity: z.string().refine((val) => parseFloat(val) > 0, "Khối lượng tổng phải lớn hơn 0"),
    quantity: z.string().refine((val) => parseFloat(val) > 1, "Số lượng phải lớn hơn 1"),
    type: z.string({
        required_error: "Vui lòng nhập chọn loại quà.",
    }).nonempty({
        message: "Vui lòng nhập chọn loại quà.",
    }),
    eventId: z.string(),
    description: z.string({
        required_error: "Vui lòng nhập mô tả gói quà.",
    }).nonempty({
        message: "Vui lòng nhập mô tả gói quà",
    }),
    image: z.any().optional()
});

export const UpdateQuantitySafeTypes = z.object({
    id: z.string(),
    quantity: z.string({
        required_error: "Vui lòng nhập số lượng",
    })
        .refine(value => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
            message: "Số lượng phải là một số hợp lệ và lớn hơn 0",
        }),
});

export const AddSelectedProducts = z.object({
    selectedProducts: z
        .array(
            z.object({
                productId: z.string(),
                variantId: z.string(),
                image: z.string(),
                name: z.string(),
                packageType: z.string(),
                netWeight: z.number(),
                price: z.number(),
                quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
            })
        )
        .min(1, "Phải chọn ít nhất một sản phẩm"),
});