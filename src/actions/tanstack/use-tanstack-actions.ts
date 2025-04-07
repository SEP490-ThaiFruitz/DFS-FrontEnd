"use client";

import {
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { interactApiClient } from "../client/interact-api-client";

import Cookies from "js-cookie";
import { useEffect } from "react";

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

    if (!response.ok) {
      console.log(response);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error in fetching data:", error);

    // throw error;

    return [];
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
  method: "create" | "update" | "remove",
  options?: Omit<UseMutationOptions<T, Error, D>, "mutationFn">
) => {
  return useMutation<T, Error, D>({
    mutationFn: async (data: D): Promise<T> => {
      try {
        let response: T | undefined;

        switch (method) {
          case "create":
            response = await interactApiClient.post<T, D>(endpoint, data);
            break;
          case "update":
            response = await interactApiClient.put<T, D>(endpoint, data);
            break;
          case "remove":
            response = await interactApiClient.delete<T>(endpoint);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        if (response === undefined) {
          throw new Error(
            `API request returned undefined for ${method.toUpperCase()} ${endpoint}`
          );
        }

        return response;
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
