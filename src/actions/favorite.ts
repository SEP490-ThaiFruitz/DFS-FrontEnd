"use server";

import { interactApi } from "./client/interact-api";

export const getFavoriteProducts = async () => {
    return await interactApi.get(`/Favorites?pageIndex=1&pageSize=10000`);
}

export const favoriteProduct = async <TValues>(values: TValues) => {
    return await interactApi.post(`/Favorites`, values);
}