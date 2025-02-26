import { ApiResponse } from "@/types/types";
import { cookies } from "next/headers";

const handleError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  throw error; // Re-throw để React Query hoặc caller xử lý
};

export const getToken = async (): Promise<{ accessToken: string | undefined } | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    return {
      accessToken: token,
    };
  } catch (error) {
    console.log({ error });

    return null;
  }
};

export const getHeaders = async (isFormData?: boolean) => {
  try {
    const tokenData = await getToken();

    let headers = { "Content-Type": "application/json" } as any;

    if (isFormData) {
      headers = {};
    }
    if (tokenData) {
      headers.Authorization = "Bearer " + tokenData?.accessToken;
    }

    return headers;
  } catch (error) {
    console.log({ error });

    return null;
  }
};


const get = async (endpoint: string, params?: Record<string, any>) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: await getHeaders()
    }

    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const url = `${process.env.NEXT_PUBLIC_URL_API}${endpoint}${queryString}`;

    const response = await fetch(url, requestOptions);
    return await handleResponse(response);

  } catch (error) {
    handleError(error, "Error in fetching data");
  }
};

const post = async <TValues>(endpoint: string, body: TValues) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: await getHeaders(),
      body: body instanceof FormData ? body : JSON.stringify(body)
    }

    const url = `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`;

    const response = await fetch(url, requestOptions);

    return await handleResponse(response);

  } catch (error) {
    console.log("Error in creating data:", error);
    handleError(error, "Error in creating data");
  }
};

const put = async <TValues>(endpoint: string, body: TValues) => {
  try {
    const requestOptions = {
      method: 'PUT',
      headers: await getHeaders(),
      body: body instanceof FormData ? body : JSON.stringify(body)
    }

    const url = `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`;

    const response = await fetch(url, requestOptions);

    return await handleResponse(response);

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
    console.log({ response })
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
    return {
      isSuccess: false,
      status: response.status,
      message: response.statusText
    };
  }
}


export const interactApi = {
  get,
  post,
  put,
  remove
};
