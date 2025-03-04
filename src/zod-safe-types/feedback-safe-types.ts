import { z } from "zod"

export const FeedbackSafeTypes = z.object({
    id: z.string().optional(),
    content: z.string(),
    rating: z
        .number()
        .min(1, "Đánh giá phải từ 1 đến 5")
        .max(5, "Đánh giá phải từ 1 đến 5"),
    images: z.any()
})