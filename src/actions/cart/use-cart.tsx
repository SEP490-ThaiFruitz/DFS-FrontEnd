import { CART_KEY } from "@/app/key/comm-key";
import { onSubmit } from "../interact-form";
import { useFetch } from "../tanstack/use-tanstack-actions";
import Cookies from "js-cookie";
import { toast } from "sonner";
import axios from "axios";

interface Payload {
  itemType: string;
  referenceId: string;
  quantity: number;
}

const token = Cookies.get("accessToken");

const headers = token ? { Authorization: `Bearer ${token}` } : {};

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
  const cartItems = payload;

  try {
    const response = await onSubmit("/Carts/items", cartItems);

    if (response?.isSuccess) {
      toast.success("Thêm vào giỏ hàng thành công");
    }
    // const response = await post("/Carts/items", cartItems);

    console.log({ response });
  } catch (error) {
    console.log({ error });
  }
};

const decreaseQuantity = async (payload: {
  itemType: string;
  referenceId: string;
}) => {
  const url = `${process.env.NEXT_PUBLIC_URL_API}${"/Carts/items"}`;

  try {
    // const response = await axios.delete("/Carts/items", {
    //   headers: headers,
    // });

    try {
      const requestOptions = {
        method: "DELETE",
        headers: await getHeaders(),
        body: JSON.stringify(payload),
      };

      const response = await fetch(url, requestOptions);

      return await handleResponse(response);
    } catch (error) {
      console.log("Error in deleting data:", error);
      handleError(error, "Error in deleting data");
    }
  } catch (error) {
    console.log({ error });
  }
};

const removeProductOutOfCart = async () => {};

const getCart = () => {
  return useFetch("Carts/", [CART_KEY.CARTS]);
};

export const cartActions = {
  addToCart,
  getCart,

  decreaseQuantity,
};
