"use server";

import { interactApi } from "./client/interact-api";

export const getProducts = async () => {
  try {
    const response = await interactApi.get("/v1/Products");
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
    console.error("Error during login:", error);
    return { success: false, message: "Có lỗi xả ra khi tạo mới sản phẩm" };
  }
};
