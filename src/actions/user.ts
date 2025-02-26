"use server"
import { interactApi } from "./client/interact-api"

export const getProfile = async () => {
    return await interactApi.get("/Users/profile");
}