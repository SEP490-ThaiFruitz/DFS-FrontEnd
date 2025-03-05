"use server"
import { interactApi } from "./client/interact-api"

export const collectVoucher = async <TValues>(values: TValues) => {
    return await interactApi.post("/CollectVouchers", values)
}