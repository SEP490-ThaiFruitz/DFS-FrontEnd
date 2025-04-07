import { z } from "zod";

export const RegisterGetDiscountSchemaTypes = z.object({
  registerEmail: z
    .string({
      message: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({
      message: "Invalid email",
    }),
});

export const ProductSelectionSafeTypes = z.object({
  selectedProducts: z
    .array(
      z.object({
        productId: z.string(),
        image: z.string(),
        name: z.string(),
        variants: z.array(
          z.object({
            variantId: z.string(),
            packageType: z.string(),
            netWeight: z.number(),
            price: z.number(),
            quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
          })
        ),
      })
    )
    .min(1, "Phải chọn ít nhất một sản phẩm"),
});

export const CreatePromotionSafeTypes = ProductSelectionSafeTypes.extend({
  name: z.string({
    required_error: "Vui lòng nhập tên khuyến mãi"
  }).nonempty({
    message: "Vui lòng nhập tên khuyến mãi"
  }),
  image: z.any({
    message: "Vui lòng chọn ảnh",
    required_error: "Vui lòng chọn ảnh",
  }).refine((file) => file != null, "Vui lòng chọn ảnh"),
  description: z.string({
    required_error: "Vui lòng nhập mô tả"
  }).nonempty({
    message: "Vui lòng nhập mô tả"
  }),
  percentage: z.string().refine((value) => {
    if (value === undefined || value === null || value === "") return true;
    if (isNaN(parseFloat(value))) return false;
    if (parseFloat(value) < 1 || parseFloat(value) > 100) return false;
    return true;
  }, { message: "Số phần trăm phải lớn hơn 0 và bé hơn hoặc bằng 100" }),
  startDate: z.date({
    message: "Vui lòng chọn ngày bắt đầu",
    required_error: "Vui lòng chọn ngày bắt đầu"
  }),
  endDate: z.date({
    message: "Vui lòng chọn ngày kết thúc",
    required_error: "Vui lòng chọn ngày kết thúc"
  }),
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

export const UpdatePromotionSafeTypes = z.object({
  name: z.string({
    required_error: "Vui lòng nhập tên khuyến mãi"
  }).nonempty({
    message: "Vui lòng nhập tên khuyến mãi"
  }),
  image: z.any().optional(),
  description: z.string({
    required_error: "Vui lòng nhập mô tả"
  }).nonempty({
    message: "Vui lòng nhập mô tả"
  }),
  percentage: z.string().refine((value) => {
    if (value === undefined || value === null || value === "") return true;
    if (isNaN(parseFloat(value))) return false;
    if (parseFloat(value) < 1 || parseFloat(value) > 100) return false;
    return true;
  }, { message: "Số phần trăm phải lớn hơn 0 và bé hơn hoặc bằng 100" }),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const UpdateQuantitySafeTypes = z.object({
  id: z.string(),
  quantity: z.string({
    required_error: "Vui lòng nhập số lượng",
  })
    .refine(value => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Số lượng phải là một số hợp lệ và lớn hơn 0",
    }),
});