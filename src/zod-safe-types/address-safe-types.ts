import { z } from "zod";

const isValidPhone = (phone: string) =>
    /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/g.test(phone);

export const FormAddressSafeTypes = z.object({
    id: z.string().optional(),
    province: z.string().nonempty({
        message: "Vui lòng nhập tỉnh / thành phố"
    }),
    district: z.string().nonempty({
        message: "Vui lòng nhập quận / huyện"
    }),
    ward: z.string().nonempty({
        message: "Vui lòng nhập phường / xã"
    }),
    address: z.string().nonempty({
        message: "Vui lòng nhập địa chỉ người nhận"
    }),
    name: z.string().nonempty({
        message: "Vui lòng nhập tên người nhận"
    }),
    tag: z.string().nonempty({
        message: "Vui lòng nhập tên thẻ"
    }),
    longitude: z.string().optional(),
    latitude: z.string().optional(),
    isDefault: z.boolean(),
    phone: z.string({
        required_error: "Vui lòng số điện thoại người nhận"
    }).refine(isValidPhone, {
        message: "Số điện thoại không hợp lệ"
    }),
})