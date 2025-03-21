import { z } from 'zod';

export const CreateVoucherSafeTypes = z.object({
  name: z.string().nonempty({
    message: "Vui lòng nhập tên giảm giá"
  }),
  code: z.string().optional(),
  moneyDiscount: z.union([z.string(), z.undefined()]).refine((value) => {
    if (value === undefined || value === null || value === "") return true;
    if (isNaN(parseFloat(value))) return false;
    if (parseFloat(value) < 0) return false;
    return true;
  }, { message: "Số tiền giảm giá phải là một số hợp lệ và lớn hơn hoặc bằng 0" }),
  percentDiscount: z.union([z.string(), z.undefined()]).refine((value) => {
    if (value === undefined || value === null || value === "") return true;
    if (isNaN(parseFloat(value))) return false;
    if (parseFloat(value) < 1 || parseFloat(value) > 100) return false;
    return true;
  }, { message: "Số phần trăm phải lớn hơn 0 và bé hơn hoặc bằng 100" }),
  discountType: z.enum(['Amount', 'Percentage'], {
    errorMap: () => ({ message: 'Vui lòng chọn loại giảm giá (Cố Định hoặc Phần Trăm)' })
  }),
  startDate: z.date({
    message: "Vui lòng chọn ngày bắt đầu",
    required_error: "Vui lòng chọn ngày bắt đầu"
  }),
  endDate: z.date({
    message: "Vui lòng chọn ngày kết thúc",
    required_error: "Vui lòng chọn ngày kết thúc"
  }),
  image: z.any(),
  minimumOrderAmount: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0, {
    message: 'Số tiền đơn hàng tối thiểu phải là một số hợp lệ và lớn hơn 0',
  }),
  maximumDiscount: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0, {
    message: 'Giảm giá tối đa phải là một số hợp lệ và lớn hơn 0',
  }),
  quantity: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0, {
    message: 'Số lượng phải là một số hợp lệ và lớn hơn 0',
  })
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

  if (data.discountType === "Amount" && data.moneyDiscount !== data.maximumDiscount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Số tiền giảm tối đa phải bằng với số tiền giảm",
      path: ['maximumDiscount'],
    });
  }
});


export const UpdateVoucherSafeTypes = z.object({
  id: z.string(),
  name: z.string().nonempty({
    message: "Vui lòng nhập tên giảm giá"
  }),
  code: z.string().optional(),
  moneyDiscount: z.union([z.string(), z.undefined()]).refine((value) => {
    if (value === undefined || value === null || value === "") return true;
    if (isNaN(parseFloat(value))) return false;
    if (parseFloat(value) < 0) return false;
    return true;
  }, { message: "Số tiền giảm giá phải là một số hợp lệ và lớn hơn hoặc bằng 0" }),
  percentDiscount: z.union([z.string(), z.undefined()]).refine((value) => {
    if (value === undefined || value === null || value === "") return true;
    if (isNaN(parseFloat(value))) return false;
    if (parseFloat(value) < 1 || parseFloat(value) > 100) return false;
    return true;
  }, { message: "Số phần trăm phải lớn hơn 0 và bé hơn hoặc bằng 100" }),
  discountType: z.enum(['Amount', 'Percentage'], {
    errorMap: () => ({ message: 'Vui lòng chọn loại giảm giá (Cố Định hoặc Phần Trăm)' })
  }),
  startDate: z.date({
    message: "Vui lòng chọn ngày bắt đầu",
    required_error: "Vui lòng chọn ngày bắt đầu"
  }),
  endDate: z.date({
    message: "Vui lòng chọn ngày kết thúc",
    required_error: "Vui lòng chọn ngày kết thúc"
  }),
  image: z.any(),
  minimumOrderAmount: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0, {
    message: 'Số tiền đơn hàng tối thiểu phải là một số hợp lệ và lớn hơn 0',
  }),
  maximumDiscount: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0, {
    message: 'Giảm giá tối đa phải là một số hợp lệ và lớn hơn 0',
  }),
  quantity: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0, {
    message: 'Số lượng phải là một số hợp lệ và lớn hơn 0',
  })
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

  if (data.discountType === "Amount" && data.moneyDiscount !== data.maximumDiscount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Số tiền giảm tối đa phải bằng với số tiền giảm",
      path: ['maximumDiscount'],
    });
  }
});