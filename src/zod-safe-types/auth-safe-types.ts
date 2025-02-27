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
  password: z.string().nonempty({
    message: "Vui lòng nhập mật khẩu",
  }),
});

export const RegisterSafeTypes = LoginSafeTypes.extend({
  confirmPassword: z.string({
    required_error: "Vui lòng nhập xác nhận mật khẩu"
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});

export const UpdatePasswordSafeTypes = z.object({
  oldPassword: z.string({
    required_error: "Vui lòng nhập mật khẩu cũ"
  }).nonempty({
    message: "Vui lòng nhập mật khẩu cũ",
  }),
  newPassword: z.string({
    required_error: "Vui lòng nhập mật khẩu mới"
  }).nonempty({
    message: "Vui lòng nhập mật khẩu mới",
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
  confirmNewPassword: z.string({
    required_error: "Vui lòng nhập xác mật khẩu mới"
  }).nonempty({
    message: "Vui lòng nhập xác mật khẩu mới",
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmNewPassword"],
});
