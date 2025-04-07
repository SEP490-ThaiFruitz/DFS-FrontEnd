"use server"

import { interactApi } from "./client/interact-api";

export const createFeedback = async <TValues>(values: TValues) => {
    return await interactApi.post('/Feedbacks', values);
}

export const updateFeedback = async <TValues>(values: TValues) => {
    return await interactApi.put('/Feedbacks', values);
}

export const hideShowFeedback = async (id: string) => {
    return await interactApi.patch(`/Feedbacks/${id}/status`, {});
}