"use server";

import { interactApi } from "./client/interact-api";

export const getAddresses = async () => {
    return await interactApi.get("/Addresses");
};

export const createAddress = async <TValues>(values: TValues) => {
    return await interactApi.post<TValues>("/Addresses", values);
};

export const updateAddress = async <TValues>(values: TValues) => {
    return await interactApi.put<TValues>("/Addresses", values);
};

export const deleteAddress = async(id: string) => {
    return await interactApi.remove(`/Addresses/${id}`);
};
