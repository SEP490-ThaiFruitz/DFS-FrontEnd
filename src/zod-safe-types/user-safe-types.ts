import { z } from "zod"

export const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const isValidPhone = (phone: string) =>
    /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/g.test(phone);

export const ProfileSafeTypes = z.object({
    name: z
        .string()
        .min(1, 'Họ và tên không được để trống')
        .max(100, 'Họ và tên không thể dài quá 100 ký tự'),

    phone: z.string().refine(isValidPhone, {
        message: "Số điện thoại không hợp lệ",
    }),

    email: z
        .string()
        .email('Email không hợp lệ'),

    birthday: z.date({
        message: "Vui lòng chọn ngày sinh nhật",
        required_error: "Vui lòng chọn ngày sinh nhật"
    }),
    gender: z
        .string()
        .refine((val) => ['Male', 'Female', 'Other'].includes(val), 'Giới tính không hợp lệ'),
});
export const FormUserSafeTypes = z.object({
    id: z.string().optional(),
    name: z
        .string()
        .min(1, 'Họ và tên không được để trống')
        .max(100, 'Họ và tên không thể dài quá 100 ký tự'),

    phone: z.string().refine(isValidPhone, {
        message: "Số điện thoại không hợp lệ",
    }),
    role: z.string().nonempty({
        message: "Vui lòng chọn vai trò"
    }),
    isActive: z.boolean(),
    email: z
        .string()
        .email('Email không hợp lệ'),
    password: z.string({
        required_error: "Vui lòng nhập mật khẩu mới"
    }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }).optional(),
    confirmPassword: z.string({
        required_error: "Vui lòng nhập xác mật khẩu mới"
    }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmNewPassword"],
});