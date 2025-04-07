import { z } from "zod";

export const UpdateRequestWithdrawalSafeTypes = z.object({
    requestWithDrawalId: z.string(),
    note: z.string().nonempty({
        message: "Vui lòng nhập ghi chú"
    }),
    image: z.any()
        .refine((file) => file != null, "Vui lòng chọn ảnh")
});


export const UpdateRejectRequestWithdrawalSafeTypes = z.object({
    requestWithDrawalId: z.string(),
    reason: z.string().nonempty({
        message: "Vui lòng nhập nguyên nhân"
    }),
});