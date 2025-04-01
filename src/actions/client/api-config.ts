import axios from "axios";

import Cookies from "js-cookie";
import { toast } from "sonner";

const token = Cookies.get("accessToken");

const headers = token ? { Authorization: `Bearer ${token}` } : {};

const get = async (endpoint: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

const post = async <TValues>(endpoint: string, body: TValues) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      body,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.log({ error });
    handeErrorResponse(error)
  }
};

const update = async <TValues>(endpoint: string, body: TValues) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      body,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.log({ error });
    handeErrorResponse(error)
  }
};

const remove = async (endpoint: string) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log({ error });
    handeErrorResponse(error)
  }
};

const patch = async <TValues>(endpoint: string, body: TValues) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      body,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

const handeErrorResponse = (error: any) => {
  const detail = error.response?.data?.detail
  toast.error(detail)
}

export const API = {
  get,
  post,
  update,
  remove,
  patch
};
