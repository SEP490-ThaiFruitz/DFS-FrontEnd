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

    birthday: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Ngày sinh nhật không hợp lệ')
    ,
    gender: z
        .string()
        .refine((val) => ['Male', 'Female', 'Other'].includes(val), 'Giới tính không hợp lệ'),
});
