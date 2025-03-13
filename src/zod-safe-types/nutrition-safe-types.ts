import { z } from "zod";

export const FromNutritionSafeTypes = z.object({
    id: z.string().optional(),
    productId: z.string().optional(),
    servingSize: z.string({
        required_error: "Vui lòng nhập khối lượng khẩu phần"
    })
        .refine((val) => {
            if (parseFloat(val) <= 0) return false;
            return true;
        }, {
            message: "Khối lượng khẩu phần lớn hơn 0"
        }),
    ingredients: z.string({
        required_error: "Vui lòng nhập thành phần"
    }).nonempty({
        message: "Vui lòng nhập thành phần"
    })
});

export const FromNutrionFact = z.object({
    nutritionFactId: z.string().optional(),
    nutrientId: z.string(),
    amount: z.string({
        required_error: "Vui lòng nhập số lượng"
    }).refine((val) => {
        if (parseFloat(val) < 0) return false;
        return true;
    }, {
        message: "Khối lượng khẩu phần lớn hơn hoặc bằng 0"
    }),
});