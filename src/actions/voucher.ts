"use server"
import { interactApi } from "./client/interact-api"

export const collectVoucher = async <TValues>(values: TValues) => {
    return await interactApi.post("/CollectVouchers", values)
}

export const createVoucher = async <TValues>(values: TValues) => {
    return await interactApi.post("/Vouchers", values)
}

export const updateVoucher = async <TValues>(values: TValues) => {
    return await interactApi.put("/Vouchers", values)
}

export const deleteVoucher = async (id: string) => {
    return await interactApi.remove(`/Vouchers/${id}`)
}