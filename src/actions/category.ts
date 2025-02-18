"use server";

import { interactApi } from "./client/interact-api";

export const getCategories = async () => {
  try {
    const response = await interactApi.get("/Categories");

    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
        data: response
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during getCategories:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};

export const createCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.create<TValues>(
      "/Categories",
      values
    );
    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
        message: "Tạo mới loại sản phẩm thành công"
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: response?.status ? response?.title : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during createCategory:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};

export const updateCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.update<TValues>(
      "/Categories",
      values
    );
    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
        message: "Cập nhật loại sản phẩm thành công"
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: response?.status ? response?.title : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during updateCategory:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};

export const deleteCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.remove(`/Categories/${values}`);
    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
         message: "Xóa loại sản phẩm thành công"
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: response?.status ? response?.title : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during deleteCategory:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};
