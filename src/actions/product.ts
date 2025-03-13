"use server";

import { interactApi } from "./client/interact-api";

export const getProducts = async () => {
    return await interactApi.get("/Products");
}

export const createProduct = async<TValue>(values: TValue) => {
    return await interactApi.post("/Products", values);
}

export const deleteProduct = async (id: string) => {
    return await interactApi.remove(`/Products/${id}`);
}

export const createProductImages = async<TValue>(values: TValue, id: string) => {
    return await interactApi.post(`/Products/images/${id}`, values);
}

export const deleteProductImage = async (id: string) => {
    return await interactApi.remove(`/Products/images/${id}`);
}

export const createNutrition = async <TValue>(values: TValue, productId: string) => {
    return await interactApi.post(`/Products/product-nutrition/${productId}`, values);
}

export const updateNutrition = async <TValue>(values: TValue, productNutritionId: string) => {
    return await interactApi.put(`/Products/product-nutrition/${productNutritionId}`, values);
}

export const createNutritionFact = async <TValue>(values: TValue) => {
    return await interactApi.post('/Products/nutrition-fact', values);
}

export const updateNutritionFact = async <TValue>(values: TValue) => {
    return await interactApi.put('/Products/nutrition-fact', values);
}

export const deleteNutritionFact = async (id: string) => {
    return await interactApi.remove(`/Products/nutrition-fact/${id}`);
}

export const createCertificate = async <TValue>(values: TValue) => {
    return await interactApi.post('/Products/product-certification', values);
}

export const updateCertificate = async <TValue>(values: TValue) => {
    return await interactApi.put('/Products/product-certification', values);
}

export const deleteProductCertification = async (id: string) => {
    return await interactApi.remove(`/Products/product-certification/${id}`);
}