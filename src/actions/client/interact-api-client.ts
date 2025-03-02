import { interactApi } from "./interact-api";
import axios from "axios";
import Cookies from "js-cookie";

const handleError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  throw error; // Re-throw để React Query hoặc caller xử lý
};

const token = Cookies.get("accessToken");

const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

const post = async <TValues>(endpoint: string, body: TValues) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, body, {
      headers,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log({ error });
  }
};

export const get = async (endpoint: string, params?: Record<string, any>) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers,
    });

    if (response.status !== 200) {
      return undefined;
    }

    return response.data;
  } catch (error) {
    handleError(error, "Error in fetching data");
    console.log(error);
  }
};

export const interactApiClient = {
  post,
  get,
};
