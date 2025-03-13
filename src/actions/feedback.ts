import { interactApi } from "./client/interact-api";

export const feedbackProduct = async <TValues>(values: TValues) => {
    return await interactApi.post(`/Feedbacks`, values);
}