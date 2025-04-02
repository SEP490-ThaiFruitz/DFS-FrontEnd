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

  post: <T, U>(endpoint: string, body?: U) =>
    request<T>("post", endpoint, body),

  put: <T, U>(endpoint: string, body: U) => request<T>("put", endpoint, body),

  patch: <T, U>(endpoint: string, body: U) =>
    request<T>("patch", endpoint, body),

  delete: <T>(endpoint: string) => request<T>("delete", endpoint),
};
