import { z } from "zod";

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const isValidPhone = (phone: string) =>
  /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/g.test(phone);

export const LoginSafeTypes = z.object({
  phone: z.string().refine(isValidPhone, {
    message: "Số điện thoại không hợp lệ",
  }),
  password: z.string({
    required_error: "Vui lòng nhập mật khẩu"
  }).min(5).max(32),
});

export const LoginSafeTypesHaveEmail = z.object({
  email: z.string({
    required_error: "Vui lòng nhập email"
  }).email({
    message: "Email không hợp lệ"
  }),
  password: z.string({
    required_error: "Vui lòng nhập mật khẩu"
  }).min(5).max(32),
});

export const RegisterSafeTypes = LoginSafeTypes.extend({
  confirmPassword: z.string({
    required_error: "Vui lòng nhập xác nhận mật khẩu"
  }).min(5).max(32),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});
