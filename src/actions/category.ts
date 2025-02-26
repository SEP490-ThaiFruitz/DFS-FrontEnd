"use server";

import { interactApi } from "./client/interact-api";

export const getCategories = async () => {
  return await interactApi.get("/Categories");
};

export const createCategory = async <TValues>(values: TValues) => {
  return await interactApi.post<TValues>("/Categories", values);
};

export const updateCategory = async <TValues>(values: TValues) => {
  return await interactApi.put<TValues>("/Categories", values);
};

export const deleteCategory = async <TValues>(values: TValues) => {
  return await interactApi.remove(`/Categories/${values}`);
};
