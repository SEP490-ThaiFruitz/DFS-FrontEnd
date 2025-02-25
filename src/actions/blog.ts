"use server";

import { interactApi } from "./client/interact-api";

export const createBlogCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.create<TValues>(
      "/BlogCategories",
      values
    );
    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
        message: "Tạo mới loại bài viết thành công"
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: response?.status === 409 ? "Tên loại bài viết đã tồn tại" : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during createBlogCategory:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};
export const updateBlogCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.update<TValues>(
      "/BlogCategories",
      values
    );
    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
        message: "Cập nhật loại bài viết thành công"
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: response?.status ? response?.title : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during updateBlogCategory:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};

export const deleteBlogCategory = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.remove(`/BlogCategories/${values}`);
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
    console.error("Error during deleteBlogCategory:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};

export const createBlog = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.create<TValues>(
      "/Blogs",
      values
    );
    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
        message: "Tạo mới bài viết thành công"
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: response?.status === 409 ? "Tên bài viết đã tồn tại" : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during createBlog:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};
export const updateBlog = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.update<TValues>(
      "/Blogs",
      values
    );
    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
        message: "Cập nhật bài viết thành công"
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: response?.status === 409 ? "Tên bài viết đã tồn tại" : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during createBlog:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};

export const deleteBlog = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.remove(`/Blogs/${values}`);
    if (!response) {
      throw new Error("No response from server");
    }

    if (response?.isSuccess) {
      return {
        success: response.isSuccess,
        message: "Xóa loại bài viết thành công"
      };
    } else {
      console.log({ response })
      return {
        success: false,
        message: response?.status ? response?.title : "Lỗi hệ thống máy chủ. Vui lòng thử lại sau"
      };
    }
  } catch (error) {
    console.error("Error during deleteBlog:", error);
    return { success: false, message: "Có lỗi xả ra. Vui lòng thử lại" };
  }
};