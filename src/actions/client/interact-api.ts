import { cookies } from "next/headers";
import { ApiResponse } from "../login";

const getToken = async (): Promise<{ accessToken: string } | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

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

const get = async (
  endpoint: string,
  config: RequestInit = { cache: "force-cache" }
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      config
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

  const  accessToken  = "";
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": body instanceof FormData ? {} as any : "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: body instanceof FormData ? body as FormData : JSON.stringify(body),
      }
    );
    console.log(response)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
            console.log(response)
    return data;
  } catch (error) {
    console.log("Error in creating data:", error);
  }
};

const update = async <TValues>(endpoint: string, body: TValues) => {
  const tokenData = await getToken();
  if (!tokenData) {
    console.log("Access token not found.");
    return;
  }

  const { accessToken } = tokenData;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error in updating data:", error);
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
  } catch (error) {
    console.log("Error in deleting data:", error);
  }
};

const login = async <TValues, TResponse>(
  endpoint: string,
  body: TValues
): Promise<ApiResponse<TResponse> | undefined> => {
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
      throw new Error("Network response was not ok");
    }

    const data: ApiResponse<TResponse> = await response.json();
    return data;
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
