import { CART_KEY } from "@/app/key/comm-key";
import { onSubmit } from "../interact-form";
import { useFetch } from "../tanstack/use-tanstack-actions";
import Cookies from "js-cookie";

interface Payload {
  itemType: string;
  referenceId: string;
  quantity: number;
}

const handleError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  throw error; // Re-throw để React Query hoặc caller xử lý
};

async function handleResponse(response: Response) {
  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (response.ok) {
    return { isSuccess: true, data: data };
  } else {
    console.log(response);
    console.log(data);
    return {
      isSuccess: false,
      status: response.status,
      message: data?.title,
      detail: data?.detail,
    };
  }
}

export const getHeaders = async (isFormData?: boolean) => {
  try {
    const tokenData = Cookies.get("accessToken");
    let headers = { "Content-Type": "application/json" } as any;

    if (isFormData) {
      headers = {};
    }
    if (tokenData) {
      headers.Authorization = "Bearer " + tokenData;
    }

    return headers;
  } catch (error) {
    console.log({ error });

    return null;
  }
};

const post = async <TValues,>(endpoint: string, body: TValues) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: await getHeaders(body instanceof FormData),
      body: body instanceof FormData ? body : JSON.stringify(body),
    };

    const url = `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`;
    const response = await fetch(url, requestOptions);

    return await handleResponse(response);
  } catch (error) {
    console.log("Error in creating data:", error);
    handleError(error, "Error in creating data");
  }
};

const addToCart = async (payload: Payload) => {
  const cartItems = {
    cartItems: [payload],
    // ...payload,
  };

  try {
    const response = await onSubmit("/Carts/items", cartItems);
    // const response = await post("/Carts/items", cartItems);

    console.log({ response });
  } catch (error) {
    console.log({ error });
  }
};

const getCart = () => {
  return useFetch("Carts/", [CART_KEY.CARTS]);
};

export const cartActions = {
  addToCart,
  getCart,
};
