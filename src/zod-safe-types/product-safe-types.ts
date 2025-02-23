import { toast } from "sonner";
import { z } from "zod";

export const CreateProductSafeTypes = z.object({
  name: z.string().nonempty({
    message: "Vui lòng nhập tên sản phẩm"
  }),
  categoryId: z.string().nonempty({
    message: "Vui lòng chọn loại sản phẩm"
  }),
  description: z.string().nonempty({
    message: "Vui lòng nhập mô tả sản phẩm"
  }),
  image: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
  other: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
  sizes: z.array(
    z.object({
      size: z.string()
        .min(1, { message: "Vui lòng nhập khối lượng sản phẩm" })
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val), { message: "Kích thước phải là số hợp lệ" }),

      quantity: z.string()
        .min(1, { message: "Vui lòng nhập số lượng sản phẩm" })
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), { message: "Số lượng phải là số hợp lệ" })
        .refine((val) => val >= 1, { message: "Số lượng phải lớn hơn 0" }),

      price: z.string()
        .min(1, { message: "Vui lòng nhập giá sản phẩm" })
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val), { message: "Giá phải là số hợp lệ" }),
    }),
  ).nonempty({ message: "Danh sách kích thước không được trống" })
    .superRefine((sizes, ctx) => {
      const sizeNames = sizes.map(item => item.size);
      const uniqueSizeNames = new Set(sizeNames);
      if (uniqueSizeNames.size !== sizeNames.length) {
        sizes.forEach((item, index) => {
          if (index > 0 && sizeNames.indexOf(item.size) !== sizeNames.lastIndexOf(item.size)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Khối lượng đã tồn tại",
              path: [`${index}.size`],
            });
          }
        });
      }
    }),
});