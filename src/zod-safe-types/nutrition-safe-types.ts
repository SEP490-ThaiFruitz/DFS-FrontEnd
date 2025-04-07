import { z } from "zod";

export const FromNutritionSafeTypes = z.object({
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
    ingredients: z.array(z.object({
        value:
            z.string({
                required_error: "Vui lòng nhập thành phần"
            }).nonempty({
                message: "Vui lòng nhập thành phần"
            }),
        label:
            z.string({
                required_error: "Vui lòng nhập thành phần"
            }).nonempty({
                message: "Vui lòng nhập thành phần"
            })
    }), { required_error: "Vui lòng nhập thành phần" }).min(1, "Vui lòng chọn ít nhất một thẻ thành phần"),
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

export const CreateProductNutritionSafeTypes = z.object({
    servingSize: z.string({
        required_error: "Vui lòng nhập khối lượng khẩu phần"
    })
        .refine((val) => {
            if (parseFloat(val) <= 0) return false;
            return true;
        }, {
            message: "Khối lượng khẩu phần lớn hơn 0"
        }),
    ingredients: z.array(z.object({
        value:
            z.string({
                required_error: "Vui lòng nhập thành phần"
            }).nonempty({
                message: "Vui lòng nhập thành phần"
            }),
        label:
            z.string({
                required_error: "Vui lòng nhập thành phần"
            }).nonempty({
                message: "Vui lòng nhập thành phần"
            })
    }), { required_error: "Vui lòng nhập thành phần" }).min(1, "Vui lòng chọn ít nhất một thẻ thành phần"),
});