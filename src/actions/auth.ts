"use server";

import { cookies } from "next/headers";
import { interactApi } from "./client/interact-api";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpired: string;
}

export const loginAction = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.post<TValues>(
      "/Auths/sign-in",
      values
    );

    if (!response?.isSuccess) {
      return response;
    }
    const loginResponse: LoginResponse = response.data?.value;
    console.log({ loginResponse })
    if (response.isSuccess && loginResponse.accessToken) {
      const cookieStore = await cookies();

      cookieStore.set("accessToken", loginResponse.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,

        // sameSite: "strict",
        // path: "/",
      });

      cookieStore.set("refreshToken", loginResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      });

      // console.log("set cookie: ", response.value.accessToken);
      // setCookie("accessToken", response.value.accessToken, {
      //   // expires: 7,
      //   // httpOnly: true,
      //   // secure: process.env.NODE_ENV === "production",
      //   // sameSite: "strict",
      // });

      return {
        isSuccess: true
      };
    } else {
      console.error("Login failed. Error:", response.message);
      return {
        isSuccess: false,
        message: response.message ?? "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { isSuccess: false, message: "An error occurred during login" };
  }
};

export const registerAction = async <TValues>(values: TValues) => {
  console.log(values);
};

export const logOut = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll()
  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
};



