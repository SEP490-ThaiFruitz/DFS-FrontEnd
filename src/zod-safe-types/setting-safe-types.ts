import { z } from "zod";

export const VnPaySettingSafeTypes = z.object({
    returnUrl: z.string({
        required_error: "Vui lòng nhập URL trả về"
    }).nonempty({
        message: "URL trả về không được để trống"
    }),
    url: z.string({
        required_error: "Vui lòng nhập URL sandbox"
    }).nonempty({
        message: "URL sandbox không được để trống"
    }),
    tmnCode: z.string({
        required_error: "Vui lòng nhập mã TMN Code"
    }).nonempty({
        message: "Mã TMN Code không được để trống"
    }),
    hashSecret: z.string({
        required_error: "Vui lòng nhập mã bí mật"
    }).nonempty({
        message: "Mã bí mật không được để trống"
    }),
    api: z.string({
        required_error: "Vui lòng nhập API VnPay"
    }).nonempty({
        message: "API VnPay không được để trống"
    }),
    returnUrlForWalletTopUp: z.string({
        required_error: "Vui lòng nhập URL trả về"
    }).nonempty({
        message: "URL trả về không được để trống"
    }),
});


export const PayOsSettingSafeTypes = z.object({
    clientId: z.string({
        required_error: "Vui lòng nhập Client ID"
    }).nonempty({
        message: "Client ID không được để trống"
    }),
    apiKey: z.string({
        required_error: "Vui lòng nhập API Key"
    }).nonempty({
        message: "API Key không được để trống"
    }),
    checksumKey: z.string({
        required_error: "Vui lòng nhập Checksum Key"
    }).nonempty({
        message: "Checksum Key không được để trống"
    }),
    returnSuccessUrl: z.string({
        required_error: "Vui lòng nhập URL thành công"
    }).nonempty({
        message: "URL thành công không được để trống"
    }),
    returnCancelUrl: z.string({
        required_error: "Vui lòng nhập URL hủy bỏ"
    }).nonempty({
        message: "URL hủy bỏ không được để trống"
    }),
    returnUrlForWalletTopUp: z.string({
        required_error: "Vui lòng nhập URL trả về"
    }).nonempty({
        message: "URL trả về không được để trống"
    }),
});


export const ComboSettingSafeTypes = z.object({
    quantity: z.string({
        required_error: "Vui lòng nhập số lượng tối thiểu"
    }).nonempty({
        message: "Vui lòng nhập số lượng tối thiểu"
    }).refine((val) => {
        if (parseFloat(val) < 2) return false;
        return true;
    }, {
        message: "Số lượng tối thiểu lớn hơn 1"
    }),
    percentage: z.string({
        required_error: "Vui lòng phần trăm giảm"
    }).nonempty({
        message: "Vui lòng phần trăm giảm"
    }).refine((val) => {
        if (parseFloat(val) < 0 || parseFloat(val) > 100) return false;
        return true;
    }, {
        message: "Phần trăm giảm lớn hơn 0 và bé hơn 100"
    }),
})