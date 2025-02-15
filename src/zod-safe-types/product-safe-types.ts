import { z } from "zod";

export const CreateProductSafeTypes = z.object({
    name: z.string({
        required_error: "Vui lòng nhập tên sản phẩm"
    }),
    description: z.string(),
    image: z.any(),
    other: z.any(),

});