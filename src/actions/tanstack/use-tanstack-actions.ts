"use client";

import {
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { interactApiClient } from "../client/interact-api-client";

import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

const handleParams = (params: Record<string, any>, endpoint: string) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }
  return url.toString();
};

const fetching = async (endpoint: string, params?: Record<string, any>) => {
  const token = Cookies.get("accessToken");

  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      {
        headers,
      }
    );
    // console.log(response)
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetching data:", error);
    throw error;
  }
};

// Custom hook for fetching data
export const useFetch = <T>(
  endpoint: string,
  queryKey: string[] = [],
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<T, Error>({
    queryKey: params ? [...queryKey, params] : [...queryKey],
    queryFn: async () => await fetching(endpoint, params),
    ...options,
  });
};

export const useMutate = <T, D = any>(
  endpoint: string,
  method: "create" | "update" | "remove" = "create",
  options?: Omit<UseMutationOptions<T, Error, D>, "mutationFn">
) => {
  return useMutation<T, Error, D>({
    mutationFn: async (data: D): Promise<any> => {
      try {
        switch (method) {
          case "create":
            return await interactApiClient.post(endpoint, data);
          // case "update":
          //   return await interactApiClient.put(endpoint, data);
          // case "remove":
          //   return await interactApiClient.remove(endpoint);
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      } catch (error) {
        console.error(
          `Error performing ${method.toUpperCase()} on ${endpoint}:`,
          error
        );
        throw error;
      }
    },

    ...options,
  });
};
