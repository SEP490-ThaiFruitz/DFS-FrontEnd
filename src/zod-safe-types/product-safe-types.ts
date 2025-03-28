import { z } from "zod";

export const CreateProductSafeTypes = z.object({
  name: z.string({
    required_error: "Vui lòng nhập tên sản phẩm"
  }).nonempty({
    message: "Vui lòng nhập tên sản phẩm"
  }),
  origin: z.string({
    required_error: "Vui lòng nhập nguồn gốc xuất sứ"
  }).nonempty({
    message: "Vui lòng nhập nguồn gốc xuất sứ"
  }),
  tagNames: z.string({
    required_error: "Vui lòng nhập tag name"
  }).nonempty({
    message: "Vui lòng nhập tag name"
  }),
  dryingMethod: z.string({
    required_error: "Vui lòng chọn phương pháp xấy"
  }).nonempty({
    message: "Vui lòng chọn phương pháp xấy"
  }),
  categoryIds: z.array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất 1 loại sản phẩm" })
    .refine((val) => val !== undefined && val !== null, {
      message: "Trường này là bắt buộc",
    }),
  moistureContent: z.string({
    required_error: "Vui lòng nhập độ ẩm"
  }).nonempty({
    message: "Vui lòng nhập độ ẩm"
  })
    .refine((val) => {
      if (parseFloat(val) < 0 || parseFloat(val) > 100) return false;
      return true;
    }, {
      message: "Độ ẩm lớn hơn 0 và bé hơn 100"
    }),
  description: z.string({
    required_error: "Vui lòng nhập mô tả sản phẩm"
  }).nonempty({
    message: "Vui lòng nhập mô tả sản phẩm"
  }),
  image: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
  other: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
  productVariants: z.array(
    z.object({
      image: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
      netWeight: z.string().refine((val) => parseFloat(val) > 0, "Khối lượng tịnh phải lớn hơn 0"),
      grossWeight: z.string().refine((val) => parseFloat(val) > 0, "Khối lượng tổng phải lớn hơn 0"),
      packagingLength: z.string().refine((val) => parseFloat(val) > 0, "Chiều dài bao bì phải lớn hơn 0"),
      packagingWidth: z.string().refine((val) => parseFloat(val) > 0, "Chiều rộng bao bì phải lớn hơn 0"),
      packagingHeight: z.string().refine((val) => parseFloat(val) > 0, "Chiều cao bao bì phải lớn hơn 0"),
      shelfLife: z.string({
        message: "Vui lòng nhập hạn sử dụng"
      }).nonempty({
        message: "Vui lòng nhập hạn sử dụng"
      }),
      price: z.string().refine((val) => parseFloat(val) > 0, "Giá phải lớn hơn 0"),
      stockQuantity: z.string().refine((val) => parseFloat(val) >= 0, "Số lượng tồn kho phải lớn hơn hoặc bằng 0"),
      reOrderPoint: z.string().refine((val) => parseFloat(val) >= 0, "Điểm đặt hàng lại phải lớn hơn hoặc bằng 0"),
      packagingTypeId: z.string({
        required_error: "Vui lòng chọn loại bao bì"
      }).nonempty({ message: "Vui lòng chọn loại bao bì" }),
    })
  )
    .min(1, { message: "Vui lòng thêm ít nhất 1 biến thể sản phẩm" }),

  ingredients: z.string({
    required_error: "Vui lòng nhập thành phần"
  }).nonempty({
    message: "Vui lòng nhập thành phần"
  }),
  servingSize: z.string(
    { required_error: "Vui lòng nhập khối lượng khẩu phần" }
  )
    .refine((val) => {
      if (parseFloat(val) <= 0) return false;
      return true;
    }, {
      message: "Khối lượng khẩu phần lớn hơn 0"
    }),
  nutritionFacts: z.array(
    z.object({
      nutritionFactId: z.string(),
      nutrientId: z.string({
        required_error: "Vui lòng chọn chất dinh dưỡng"
      }).nonempty({ message: "Vui lòng chọn chất dinh dưỡng" }),
      amount: z.string().refine((val) => parseFloat(val) > 0, "Số lượng phải lớn hơn 0"),
    }), {
    required_error: "Vui lòng thêm ít nhất 1 chất dinh dưỡng"
  }
  ).min(1, { message: "Vui lòng thêm ít nhất 1 chất dinh dưỡng" }),
  certificates: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().nonempty({
        message: "Vui lòng nhập tên chứng chỉ"
      }),
      agency: z.string().nonempty({
        message: "Vui lòng nhập tên tổ chức"
      }),
      issueDate: z.date({
        required_error: "Vui lòng chọn ngày cấp"
      }),
      expiryDate: z.date().optional(),
      details: z.string().optional(),
    }),
    {
      required_error: "Vui lòng thêm ít nhất 1 chứng chỉ"
    }
  ).min(1, { message: "Vui lòng thêm ít nhất 1 chứng chỉ" }),
})

export const UpdateProductSafeTypes = z.object({
  id: z.string(),
  name: z.string({
    required_error: "Vui lòng nhập tên sản phẩm"
  }).nonempty({
    message: "Vui lòng nhập tên sản phẩm"
  }),
  tagNames: z.string({
    required_error: "Vui lòng nhập tag name"
  }).nonempty({
    message: "Vui lòng nhập tag name"
  }),
  origin: z.string({
    required_error: "Vui lòng nhập nguồn gốc xuất sứ"
  }).nonempty({
    message: "Vui lòng nhập nguồn gốc xuất sứ"
  }),
  dryingMethod: z.string({
    required_error: "Vui lòng chọn phương pháp xấy"
  }).nonempty({
    message: "Vui lòng chọn phương pháp xấy"
  }),
  categoryIds: z.array(z.string())
    .min(1, { message: "Vui lòng chọn ít nhất 1 loại sản phẩm" })
    .refine((val) => val !== undefined && val !== null, {
      message: "Trường này là bắt buộc",
    }),
  moistureContent: z.string({
    required_error: "Vui lòng nhập độ ẩm"
  }).nonempty({
    message: "Vui lòng nhập độ ẩm"
  })
    .refine((val) => {
      if (parseFloat(val) < 0 || parseFloat(val) > 100) return false;
      return true;
    }, {
      message: "Độ ẩm lớn hơn 0 và bé hơn 100"
    }),
  description: z.string({
    required_error: "Vui lòng nhập mô tả sản phẩm"
  }).nonempty({
    message: "Vui lòng nhập mô tả sản phẩm"
  }),
  image: z.any(),
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
  issueDate: z.date({
    required_error: "Vui lòng chọn ngày cấp"
  }),
  expiryDate: z.date().optional(),
  details: z.string().optional(),
}).superRefine((data, ctx) => {

  if (data.expiryDate && data.issueDate > data.expiryDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày cấp không được lớn hơn ngày hết hạn",
      path: ['issueDate'],
    });
  }

  if (data.expiryDate && data.expiryDate < data.issueDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày hết hạn không được nhỏ hơn ngày cấp",
      path: ['expiryDate'],
    });
  }
})

export const ProductVariantSafeTypes = z.object({
  image: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
  netWeight: z.string().refine((val) => parseFloat(val) > 0, "Khối lượng tịnh phải lớn hơn 0"),
  grossWeight: z.string().refine((val) => parseFloat(val) > 0, "Khối lượng tổng phải lớn hơn 0"),
  packagingLength: z.string().refine((val) => parseFloat(val) > 0, "Chiều dài bao bì phải lớn hơn 0"),
  packagingWidth: z.string().refine((val) => parseFloat(val) > 0, "Chiều rộng bao bì phải lớn hơn 0"),
  packagingHeight: z.string().refine((val) => parseFloat(val) > 0, "Chiều cao bao bì phải lớn hơn 0"),
  shelfLife: z.string({
    message: "Vui lòng nhập hạn sử dụng"
  }).nonempty({
    message: "Vui lòng nhập hạn sử dụng"
  }),
  price: z.string().refine((val) => parseFloat(val) > 0, "Giá phải lớn hơn 0"),
  stockQuantity: z.string().refine((val) => parseFloat(val) >= 0, "Số lượng tồn kho phải lớn hơn hoặc bằng 0"),
  reOrderPoint: z.string().refine((val) => parseFloat(val) >= 0, "Điểm đặt hàng lại phải lớn hơn hoặc bằng 0"),
  packagingTypeId: z.string({
    required_error: "Vui lòng chọn loại bao bì"
  }).nonempty({ message: "Vui lòng chọn loại bao bì" }),
}).refine((data) => data.netWeight <= data.grossWeight, {
  message: "Khối lượng tịnh không thể lớn hơn khối lượng tổng",
  path: ["netWeight"],
});;