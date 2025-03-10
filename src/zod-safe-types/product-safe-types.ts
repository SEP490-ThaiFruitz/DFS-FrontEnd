import { z } from "zod";

export const CreateProductSafeTypes = z.object({
  name: z.string().nonempty({
    message: "Vui lòng nhập tên sản phẩm"
  }),
  origin: z.string().nonempty({
    message: "Vui lòng nhập nguồn gốc xuất sứ"
  }),
  dryingMethod: z.string().nonempty({
    message: "Vui lòng chọn phương pháp xấy"
  }),
  categoryIds: z.array(z.string()).nonempty({
    message: "Vui lòng chọn ít nhất 1 loại sản phẩm"
  }),
  description: z.string().nonempty({
    message: "Vui lòng nhập mô tả sản phẩm"
  }),
  mainImageUrl: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
})
