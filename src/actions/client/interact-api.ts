import axios from "axios";
import { ApiResponse } from "@/types/types";
import { cookies } from "next/headers";

const handleError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  throw error; // Re-throw để React Query hoặc caller xử lý
};

export const getToken = async (): Promise<{ accessToken: string } | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("Token not found");
    }

    return {
      accessToken: token,
    };
  } catch (error) {
    console.log({ error });

    return null;
  }
};

const getWithToken = async (endpoint: string) => {
  const tokenData = await getToken();
  if (!tokenData) {
    console.log("Access token not found.");
    return;
  }

  const { accessToken } = tokenData;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json(); // Assuming JSON response
    console.log(data); // Handle the response as needed
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

const get = async (endpoint: string, params?: Record<string, any>) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}${
        params ? `?${new URLSearchParams(params)}` : ""
      }`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};

const create = async <TValues>(endpoint: string, body: TValues) => {
  // const tokenData = await getToken();
  // if (!tokenData) {
  //   console.log("Access token not found.");
  //   return;
  // }

  const accessToken = "";
  try {
    let headers = { "Content-Type": "application/json" } as any;
    if (body instanceof FormData) {
      headers = {};
    }
    if (accessToken) {
      headers.Authorization = "Bearer " + accessToken;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      {
        method: "POST",
        headers: headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
      }
    );
    const data = await response.json();
    console.log(response);
    return data;
  } catch (error) {
    console.log("Error in creating data:", error);
    handleError(error, "Error in creating data");
  }
};

const update = async <TValues>(endpoint: string, body: TValues) => {
  // const tokenData = await getToken();
  // if (!tokenData) {
  //   console.log("Access token not found.");
  //   return;
  // }

  const accessToken = "";
  try {
    let headers = { "Content-Type": "application/json" } as any;
    if (body instanceof FormData) {
      headers = {};
    }
    if (accessToken) {
      headers.Authorization = "Bearer " + accessToken;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      {
        method: "PUT",
        headers: headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log(response);
    return data;
  } catch (error) {
    console.log("Error in updating data:", error);
    handleError(error, "Error in updating data");
  }
};

const remove = async (endpoint: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error in deleting data:", error);
    handleError(error, "Error in deleting data");
  }
};

const login = async <TValues, TResponse>(
  endpoint: string,
  body: TValues
): Promise<ApiResponse<TResponse> | undefined> => {
  console.log(`${process.env.NEXT_PUBLIC_URL_API}${endpoint}`);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    // console.log({ response });

    if (!response.ok) {
      return response.json();
    }

    const data: ApiResponse<TResponse> = await response.json();
    return data;
  } catch (error) {
    console.error("Error in creating data:", error);
    return undefined;
  }
};

const register = async <TValues, TResponse>(
  endpoint: string,
  body: TValues
): Promise<ApiResponse<TResponse> | undefined> => {
  console.log(`${process.env.NEXT_PUBLIC_URL_API}${endpoint}`);
  try {
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(body),
    //   }
    // );
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      body
    );

    // console.log({ response });

    if (response.status === 200) {
      const data: ApiResponse<TResponse> = await response.data;
      return data;
    }
    return response.data;
  } catch (error) {
    console.error("Error in creating data:", error);
    return undefined;
  }
};

export const interactApi = {
  get,
  getWithToken,
  create,
  update,
  remove,
  login,
};
