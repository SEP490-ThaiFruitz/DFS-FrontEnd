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
  tagNames: z.array(z.object({
    label:
      z.string({
        required_error: "Vui lòng nhập tag"
      }).nonempty({
        message: "Vui lòng nhập tag"
      }),
    value:
      z.string({
        required_error: "Vui lòng nhập tag"
      }).nonempty({
        message: "Vui lòng nhập tag"
      })
  })).min(1, "Vui lòng chọn ít nhất một thẻ tag"),
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
      preservationMethod: z.string({
        message: "Vui lòng nhập cách bảo quản"
      }).nonempty({
        message: "Vui lòng nhập cách bảo quản"
      }),
      price: z.string().refine((val) => parseFloat(val) > 0, "Giá phải lớn hơn 0"),
      stockQuantity: z.string().optional(),
      reOrderPoint: z.string().refine((val) => parseFloat(val) >= 0, "Điểm đặt hàng lại phải lớn hơn hoặc bằng 0"),
      packagingTypeId: z.string({
        required_error: "Vui lòng chọn loại bao bì"
      }).nonempty({ message: "Vui lòng chọn loại bao bì" }),
    })
  )
    .min(1, { message: "Vui lòng thêm ít nhất 1 biến thể sản phẩm" }),

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
      id: z.number().optional(),
      image: z.string(),
      name: z.string().nonempty({
        message: "Vui lòng nhập tên chứng chỉ"
      }),
      agency: z.string().nonempty({
        message: "Vui lòng nhập tên tổ chức"
      }),
      issueDate: z.string({
        required_error: "Vui lòng chọn ngày cấp"
      }),
      expiryDate: z.string().optional(),
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
  tagNames: z.array(z.object({
    label:
      z.string({
        required_error: "Vui lòng nhập tag"
      }).nonempty({
        message: "Vui lòng nhập tag"
      }),
    value:
      z.string({
        required_error: "Vui lòng nhập tag"
      }).nonempty({
        message: "Vui lòng nhập tag"
      })
  })).min(1, "Vui lòng chọn ít nhất một thẻ tag"),
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
  image: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
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
  preservationMethod: z.string({
    message: "Vui lòng nhập cách bảo quản"
  }).nonempty({
    message: "Vui lòng nhập cách bảo quản"
  }),
  price: z.string().refine((val) => parseFloat(val) > 0, "Giá phải lớn hơn 0"),
  stockQuantity: z.string().optional(),
  reOrderPoint: z.string().refine((val) => parseFloat(val) >= 0, "Điểm đặt hàng lại phải lớn hơn hoặc bằng 0"),
  packagingTypeId: z.string({
    required_error: "Vui lòng chọn loại bao bì"
  }).nonempty({ message: "Vui lòng chọn loại bao bì" }),
}).refine((data) => data.netWeight < data.grossWeight, {
  message: "Khối lượng tịnh không thể lớn hơn khối lượng tổng",
  path: ["netWeight"],
});;

export const FormDiscountSafeTypes = z.object({
  percentage: z.string().refine((value) => !isNaN(parseFloat(value)) && (parseFloat(value) > 0 && parseFloat(value) <= 100), {
    message: 'Số phần trăm phải lớn hơn 0 và bé hơn hoặc bằng 100',
  }),
  quantity: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
    message: 'Số lượng phải là một số hợp lệ và lớn hơn 0',
  }),
  startDate: z.date({
    message: "Vui lòng chọn ngày bắt đầu",
    required_error: "Vui lòng chọn ngày bắt đầu"
  }),
  endDate: z.date({
    message: "Vui lòng chọn ngày kết thúc",
    required_error: "Vui lòng chọn ngày kết thúc"
  }),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
})