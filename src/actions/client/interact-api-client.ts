// import { interactApi } from "./interact-api";
// import axios from "axios";
// import Cookies from "js-cookie";

// const handleError = (error: unknown, message: string) => {
//   console.error(`${message}:`, error);
//   throw error; // Re-throw để React Query hoặc caller xử lý
// };

// const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

// const post = async <TValues>(endpoint: string, body: TValues) => {
//   const token = Cookies.get("accessToken");

//   const headers = token ? { Authorization: `Bearer ${token}` } : {};

//   try {
//     const response = await axios.post(`${BASE_URL}${endpoint}`, body, {
//       headers,
//     });

//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.log({ error });
//   }
// };

// export const get = async <TValue>(
//   endpoint: string,
//   params?: Record<string, any>
// ) => {
//   const token = Cookies.get("ac cessToken");

//   const headers = token ? { Authorization: `Bearer ${token}` } : {};

//   try {
//     const response = await axios.get(`${BASE_URL}${endpoint}`, {
//       headers,
//     });

//     if (response.status !== 200) {
//       return undefined;
//     }

//     return response.data as TValue;
//   } catch (error) {
//     handleError(error, "Error in fetching data");
//     console.log(error);
//   }
// };

// export const interactApiClient = {
//   post,
//   get,
// };

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_URL_API || "";

const handleError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  throw error; // Allow caller (React Query, etc.) to handle it
};

const createHeaders = () => {
  const token = Cookies.get("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async <T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  endpoint: string,
  data?: unknown,
  params?: Record<string, any>
): Promise<T | undefined> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: createHeaders(),
      data,
      params,
    };

    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error) {
    handleError(error, `Error in ${method.toUpperCase()} ${endpoint}`);
    return undefined;
  }
};

export const interactApiClient = {
  get: <T>(endpoint: string, params?: Record<string, any>) =>
    request<T>("get", endpoint, undefined, params),

  post: <T, U>(endpoint: string, body: U) => request<T>("post", endpoint, body),

  put: <T, U>(endpoint: string, body: U) => request<T>("put", endpoint, body),

  patch: <T, U>(endpoint: string, body: U) =>
    request<T>("patch", endpoint, body),

  delete: <T>(endpoint: string) => request<T>("delete", endpoint),
};
