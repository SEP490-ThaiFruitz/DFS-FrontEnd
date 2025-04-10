import { z } from "zod";

const RequestItemSchema = z.object({
    variantId: z.string({
        required_error: "Mã biến thể sản phẩm là bắt buộc",
    }),
    productId: z.string({
        required_error: "Mã sản phẩm là bắt buộc",
    }),
    name: z.string({
        required_error: "Tên sản phẩm là bắt buộc",
    }),
    image: z.string().optional(),
    packageType: z.string({
        required_error: "Loại đóng gói là bắt buộc",
    }),
    netWeight: z.number({
        required_error: "Trọng lượng là bắt buộc",
    }),
    quantity: z
        .number({
            required_error: "Số lượng là bắt buộc",
        })
        .positive({
            message: "Số lượng phải lớn hơn 0",
        }),
    enteredQuantity: z
        .number({
            required_error: "Số lượng là bắt buộc",
        }),
    importQuantity: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
        message: 'Số lượng phải là một số hợp lệ và lớn hơn 0',
    }),
    preservationMethod: z.string({
        message: "Vui lòng nhập cách bảo quản"
    }).nonempty({
        message: "Vui lòng nhập cách bảo quản"
    }),
    productionDate: z.date({
        message: "Vui lòng chọn ngày ngày sản xuất",
        required_error: "Vui lòng chọn ngày ngày sản xuất"
    }),
    expirationDate : z.date({
        message: "Vui lòng chọn ngày hết hạn",
        required_error: "Vui lòng chọn ngày hết hạn"
    }),
}).superRefine((data, ctx) => {
    if (data.productionDate > data.expirationDate ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ngày sản xuất không được lớn hơn ngày hết hạn",
            path: ['productionDate'],
        });

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ngày hết hạn phải sau ngày sản xuất",
            path: ['expiredDate'],
        });
    }

    const importQuatity = data.quantity - data.enteredQuantity
    if (importQuatity < Number(data.importQuantity)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Số lượng tối đa nhập là ${importQuatity}`,
            path: ['importQuantity'],
        });
    }
})

export const DocumentSafeTypes = z.object({
    name: z.string({
        message: "Vui lòng chọn tên tài liệu",
        required_error: "Vui lòng chọn tên tài liệu"
    }).nonempty({
        message: "Vui lòng chọn tên tài liệu"
    }),
    document: z.any().refine((file) => file != null, "Vui lòng chọn tài liệu"),
})

export const CreateProductBatchSafeTypes = z.object({
    requestId: z.string({
        required_error: "Vui lòng chọn yêu cầu",
    }),
    requestItems: z.array(RequestItemSchema).min(1, {
        message: "Vui lòng chọn ít nhất một sản phẩm",
    }),
    documents: z.array(DocumentSafeTypes).min(1, {
        message: "Vui lòng chọn ít một tài liệu",
    })
})
