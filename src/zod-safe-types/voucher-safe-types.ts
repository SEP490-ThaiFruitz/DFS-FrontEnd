import { z } from 'zod';

export const CreateVoucherSafeTypes = z.object({
  name: z.string().nonempty({
    message: "Vui lòng nhập tên giảm giá"
  }),
  code: z.string(),
  moneyDiscount: z.string().refine((value) => {
    if (isNaN(parseFloat(value))) return false;
    if (parseFloat(value) < 0) return false;
    return true;
  }, { "message": "Số tiền giảm giá phải là một số hợp lệ và lớn hơn 0" }),
  percentDiscount: z.string().refine((value) => {
    if (isNaN(parseFloat(value))) return false;
    if (parseFloat(value) < 0 || parseFloat(value) > 100) return false;
    return true;
  }, { "message": "Số phần trăm phải lớn hơn 0 và bé hơn 100" }),
  discountType: z.enum(['Fixed', 'Percentage'], {
    errorMap: () => ({ message: 'Vui lòng chọn loại giảm giá (Cố Định hoặc Phần Trăm)' })
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Vui lòng chọn ngày bắt đầu',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Vui lòng chọn ngày kết thúc',
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
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (startDate > endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
      path: ['startDate'],
    });
  }

  if (endDate < startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu",
      path: ['endDate'],
    });
  }
});
