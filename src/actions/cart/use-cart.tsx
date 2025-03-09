import { CART_KEY } from "@/app/key/comm-key";
import { onSubmit } from "../interact-form";
import { useFetch } from "../tanstack/use-tanstack-actions";
import Cookies from "js-cookie";
import { toast } from "sonner";
import axios from "axios";
import { API } from "@/app/key/url";
import { useQueryClient } from "@tanstack/react-query";

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

const addToCart = async (payload: Payload) => {
  const cartItems = payload;

  console.log({ API });

  try {
    const response = await onSubmit("/Carts/items", cartItems);

    // if (response?.isSuccess) {
    //   toast.success("Thêm vào giỏ hàng thành công");
    // }

    console.log({ response });
  } catch (error) {
    console.log({ error });
  }
};

const updateQuantity = async (
  payload: { itemType: string; referenceId: string },
  change: number
) => {
  const url = `${process.env.NEXT_PUBLIC_URL_API}/Carts/items`;

  console.log({ url });

  // const queryClient = useQueryClient();

  try {
    const response = await axios.put(
      url,
      { ...payload, quantity: change }, // Cập nhật chính xác
      { headers: headers }
    );

    if (response.status === 200) {
      // queryClient.invalidateQueries({ queryKey: [CART_KEY.CARTS] });
      toast.success(
        `Đã ${change > 0 ? "tăng" : "giảm"} số lượng sản phẩm thành công`
      );
    }
  } catch (error) {
    console.log("Error in updating cart:", error);
    handleError(error, "Lỗi cập nhật giỏ hàng");

    toast.error("Có lỗi xảy ra khi cập nhật giỏ hàng");
  }
};

// Hàm tăng số lượng
const increaseQuantity = (payload: { itemType: string; referenceId: string }) =>
  updateQuantity(payload, 1);

// Hàm giảm số lượng
const decreaseQuantity = (payload: { itemType: string; referenceId: string }) =>
  updateQuantity(payload, -1);

const removeProductOutOfCart = async (payload: {
  itemType: string;
  referenceId: string;
}) => {
  try {
    const response = await axios.delete(`${API}/Carts/items`, {
      headers: headers,
      data: payload,
    });

    if (response.status === 200) {
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    }
  } catch (error) {
    console.log("Error removing product:", error);
    toast.error("Lỗi khi xóa sản phẩm");
  }
};

const getCart = () => {
  return useFetch("/Carts/", [CART_KEY.CARTS]);
};

export const cartActions = {
  addToCart,
  // getCart,
  increaseQuantity,
  decreaseQuantity,
  removeProductOutOfCart,
};
