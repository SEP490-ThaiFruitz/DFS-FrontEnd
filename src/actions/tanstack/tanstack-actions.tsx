import {
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { interactApi } from "../client/interact-api";

// import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

export const useFetch = <T,>(
  endpoint: string,
  queryKey: string[] = [], // Custom query key
  params?: Record<string, any>, // Optional parameters for filtering, pagination,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn"> // Customizable query options
) => {
  return useQuery<T, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const response = await interactApi.get(endpoint, { params });
        return response.data;
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw error;
      }
    },
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
            return await interactApi.create(endpoint, data);
          case "update":
            return await interactApi.update(endpoint, data);
          case "remove":
            return await interactApi.remove(endpoint);
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

// // Hàm lấy token từ cookie
// const getToken = async (): Promise<string | null> => {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("access_token")?.value;
//     if (!token) {
//       throw new Error("Token not found");
//     }
//     return token;
//   } catch (error) {
//     console.error("Error fetching token:", error);
//     return null;
//   }
// };

// // Hàm xử lý lỗi tập trung
// const handleError = (error: unknown, message: string) => {
//   console.error(`${message}:`, error);
//   throw error; // Re-throw để React Query hoặc caller xử lý
// };

// // Hàm tạo request cơ bản
// const createRequest = async <T,>(
//   endpoint: string,
//   options: RequestInit,
//   requiresToken: boolean = false
// ): Promise<T> => {
//   try {
//     let headers = { ...options.headers };

//     // Thêm token nếu cần
//     if (requiresToken) {
//       const token = await getToken();
//       if (!token) {
//         throw new Error("Access token not found.");
//       }
//       headers = { ...headers, Authorization: `Bearer ${token}` };
//     }

//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     if (!response.ok) {
//       throw new Error(`Network response was not ok: ${response.status}`);
//     }

//     const data = await response.json();
//     return data as T;
//   } catch (error) {
//     handleError(error, `Error in ${options.method || "request"} operation`);
//   }
// };

// // Các phương thức API
// export const interactApi = {
//   get: async <T,>(endpoint: string, params?: Record<string, any>) => {
//     const queryString = params ? `?${new URLSearchParams(params)}` : "";
//     return createRequest<T>(`${endpoint}${queryString}`, { method: "GET" });
//   },

//   getWithToken: async <T,>(endpoint: string) => {
//     return createRequest<T>(endpoint, { method: "GET" }, true);
//   },

//   create: async <TValues, TResponse>(
//     endpoint: string,
//     body: TValues,
//     requiresToken: boolean = false
//   ) => {
//     const headers =
//       body instanceof FormData ? {} : { "Content-Type": "application/json" };

//     return createRequest<TResponse>(
//       endpoint,
//       {
//         method: "POST",
//         headers,
//         body: body instanceof FormData ? body : JSON.stringify(body),
//       },
//       requiresToken
//     );
//   },

//   update: async <TValues, TResponse>(
//     endpoint: string,
//     body: TValues,
//     requiresToken: boolean = true
//   ) => {
//     return createRequest<TResponse>(
//       endpoint,
//       {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       },
//       requiresToken
//     );
//   },

//   remove: async <T,>(endpoint: string, requiresToken: boolean = true) => {
//     return createRequest<T>(endpoint, { method: "DELETE" }, requiresToken);
//   },

//   login: async <TValues, TResponse>(
//     endpoint: string,
//     body: TValues
//   ): Promise<TResponse | undefined> => {
//     try {
//       const response = await fetch(`${BASE_URL}${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       return data as TResponse;
//     } catch (error) {
//       handleError(error, "Error during login");
//     }
//   },
// };

// export const useMutate = <T, D = any>(
//   endpoint: string,
//   method: "create" | "update" | "remove" = "create",
//   options?: Omit<UseMutationOptions<T, Error, D>, "mutationFn">
// ) => {
//   return useMutation<T, Error, D>({
//     mutationFn: async (data: D): any => {
//       try {
//         switch (method) {
//           case "create":
//             return await interactApi.create<T, D>(endpoint, data);
//           case "update":
//             return await interactApi.update<T, D>(endpoint, data);
//           case "remove":
//             return await interactApi.remove<T>(endpoint);
//           default:
//             throw new Error(`Unsupported method: ${method}`);
//         }
//       } catch (error) {
//         console.error(
//           `Error performing ${method.toUpperCase()} on ${endpoint}:`,
//           error
//         );
//         throw error;
//       }
//     },

//     ...options,
//   });
// };
