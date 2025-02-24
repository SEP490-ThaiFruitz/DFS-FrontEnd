import { z } from "zod";

export const SliderSafeTypes = z.object({
    name: z.string().nonempty({
        message: "Vui lòng nhập tên thanh trượt"
    }),
    image: z.any(),
    isActive: z.boolean(),
});