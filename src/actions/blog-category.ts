"use server"
import { interactApi } from "./client/interact-api";

export const createBlogCategory = async <TValues>(values: TValues) => {
    return await interactApi.post<TValues>("/BlogCategories", values);
};
export const updateBlogCategory = async <TValues>(values: TValues) => {
    return await interactApi.put<TValues>("/BlogCategories", values);
};
export const deleteBlogCategory = async (id: string) => {
    return await interactApi.remove(`/BlogCategories/${id}`);
};
