import { z } from "zod";

export const CancelOrderSafeTypes = z.object({
    reason: z.string({
        required_error: "Vui lòng nhập hoặc chọn lí do hủy",
        message: "Vui lòng nhập hoặc chọn lí do hủy"
    }).nonempty({
        message: "Vui lòng nhập hoặc chọn lí do hủy"
    }),
    context: z.string().optional()
});