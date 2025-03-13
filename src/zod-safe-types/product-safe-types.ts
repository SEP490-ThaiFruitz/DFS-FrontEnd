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
  moistureContent: z.string({
    required_error: "Vui lòng nhập độ ẩm"
  })
    .refine((val) => {
      console.log(parseFloat(val))
      if (parseFloat(val) < 0) return false;
      return true;
    }, {
      message: "Độ ẩm không được âm"
    }),
  description: z.string().nonempty({
    message: "Vui lòng nhập mô tả sản phẩm"
  }),
  mainImageUrl: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
})


export const FormImageSafeTypes = z.object({
  images: z.any(),
})

export const FormCertificateSafeTypes = z.object({
  id: z.string().optional(),
  name: z.string().nonempty({
    message: "Vui lòng nhập tên chứng chỉ"
  }),
  agency: z.string().nonempty({
    message: "Vui lòng nhập tên tổ chức"
  }),
  issueDate: z.string({
    required_error: "Vui lòng chọn ngày cấp"
  }).nonempty({
    message: "Vui lòng chọn ngày cấp"
  }),
  expiryDate: z.string().optional(),
  details: z.string().optional(),
})