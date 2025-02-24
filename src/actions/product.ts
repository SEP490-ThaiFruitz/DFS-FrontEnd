"use server";

import { interactApi } from "./client/interact-api";

export const getProducts = async () => {
    try {
        const response = await interactApi.get(
            "/Products"
        );
        if (!response) {
            throw new Error("No response from server");
        }

        if (response.isSuccess) {
            return response.value;
        } else {
            console.error("Login failed. Error:", response.error?.message);
            return {
                success: false,
                message: response.error?.message || "Invalid credentials",
            };
        }
    } catch (error) {
        console.error("Error during getProducts:", error);
        return { success: false, message: "Có lỗi xả ra khi tạo mới sản phẩm" };
    }
}

export const createProduct = async<TValue>(values: TValue) => {
    try {
        const response = await interactApi.create(
            "/Products",
            values
        );

        if (!response) {
            throw new Error("No response from server");
        }
        console.log(response.errors)
        if (response?.isSuccess) {
            return {
                success: response.isSuccess,
                message: "Tạo mới sản phẩm thành công"
            };
        } else {
            console.log({ response })
            return {
                success: false,
                message: response?.status ? response?.title : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
            };
        }
    } catch (error) {
        console.error("Error during createProduct:", error);
        return { success: false, message: "Có lỗi xả ra khi tạo mới sản phẩm" };
    }
}