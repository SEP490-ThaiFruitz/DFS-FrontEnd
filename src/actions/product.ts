"use server";

import { interactApi } from "./client/interact-api";

export const getProducts = async () => {
    return await interactApi.get("/Products");
}

export const createProduct = async<TValue>(values: TValue) => {
    return await interactApi.post("/Products", values);
}