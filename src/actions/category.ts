"use server";

import { interactApi } from "./client/interact-api";

export const getCategories = async () => {
  try {
    const response = await interactApi.get("/Categories");
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

export const createCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.create<TValues>(
      "/v1/Categories",
      values
    );
    if (!response) {
      throw new Error("No response from server");
    }

    if (response.isSuccess) {
      return { success: true, message: "Tạo mới loại sản phẩm thành công" };
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

export const updateCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.update<TValues>(
      "/v1/Categories",
      values
    );
    // if (!response) {
    //     throw new Error("No response from server");
    // }

    // if (response.isSuccess) {
    //     return { success: true, message: "Tạo mới loại sản phẩm thành công" };
    // } else {
    //     console.error("Login failed. Error:", response.error?.message);
    //     return {
    //         success: false,
    //         message: response.error?.message || "Invalid credentials",
    //     };
    // }
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "Có lỗi xả ra khi tạo mới sản phẩm" };
  }
};

export const deleteCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.remove(`/v1/Categories/${values}`);
    // if (!response) {
    //     throw new Error("No response from server");
    // }

    // if (response.isSuccess) {
    //     return { success: true, message: "Tạo mới loại sản phẩm thành công" };
    // } else {
    //     console.error("Login failed. Error:", response.error?.message);
    //     return {
    //         success: false,
    //         message: response.error?.message || "Invalid credentials",
    //     };
    // }
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "Có lỗi xả ra khi tạo mới sản phẩm" };
  }
};
