"use server"
import { interactApi } from "./client/interact-api"

export const getProfile = async () => {
    return await interactApi.get("/Users/profile");
}

export const updatePassword = async <TValues>(values: TValues) => {
    return await interactApi.put("/Auths/change-password", values);
}

export const updateProfile = async <TValues>(values: TValues) => {
    return await interactApi.put("/Users/profile", values);
}

export const getUsersByAdministrator = async (params?: Record<string, any>) => {
    return await interactApi.get("/Users", params);
}

export const banUser = async (id: string) => {
    return await interactApi.put(`/Users/${id}/status`, {});
}