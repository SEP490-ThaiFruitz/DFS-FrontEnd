import { z } from "zod"

export const FeedbackSafeTypes = z.object({
    orderItemId: z.string(),
    content: z.string().optional(),
    stars: z.number()
        .min(1, "Đánh giá phải từ 1 đến 5")
        .max(5, "Đánh giá phải từ 1 đến 5"),
    images: z.any(),
})