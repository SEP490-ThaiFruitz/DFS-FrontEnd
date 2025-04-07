import { z } from "zod";

export const CreateEventSafeTypes = z.object({
    id: z.string().optional(),
    name: z.string({
        required_error: "Vui lòng nhập tên sự kiện.",
    })
        .min(1, { message: "Vui lòng nhập tên sự kiện." })
        .nonempty(),
    description: z.string({
        required_error: "Vui lòng nhập mô tả sự kiện.",
    }).nonempty({
        message: "Vui lòng nhập mô tả sự kiện",
    }),
    startDate: z.date({
        message: "Vui lòng chọn ngày bắt đầu",
        required_error: "Vui lòng chọn ngày bắt đầu"
    }),
    endDate: z.date({
        message: "Vui lòng chọn ngày kết thúc",
        required_error: "Vui lòng chọn ngày kết thúc"
    }),
    image: z.any()
        .refine((file) => file != null, "Vui lòng chọn ảnh"),
}).superRefine((data, ctx) => {
    if (data.startDate > data.endDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
            path: ['startDate'],
        });
    }

    if (data.endDate < data.startDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu",
            path: ['endDate'],
        });
    }
});