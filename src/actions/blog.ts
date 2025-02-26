"use server";

import { interactApi } from "./client/interact-api";

export const createBlog = async <TValues>(values: TValues) => {
  return await interactApi.post<TValues>("/Blogs", values);
};
export const updateBlog = async <TValues>(values: TValues) => {
  return await interactApi.put<TValues>("/Blogs", values);
};
export const deleteBlog = async (id: string) => {
  return await interactApi.remove(`/Blogs/${id}`);
};
