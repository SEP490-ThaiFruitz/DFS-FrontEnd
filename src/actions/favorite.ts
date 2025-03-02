"use server";

import { interactApi } from "./client/interact-api";

export const getFavoriteProducts = async () => {
    return await interactApi.get("/Favorites");
}

export const createFavoriteProduct = async (productId: string) => {
    return await interactApi.post(`/Favorites/${productId}`, {});
}

export const deleteFavoriteProduct = async (id: string) => {
    return await interactApi.remove(`/Favorites/${id}`);
}