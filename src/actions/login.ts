"use server";

import { cookies } from "next/headers";
import { interactApi } from "./client/interact-api";
import { setCookie } from "./cookie-interactive";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpired: string;
}

export const loginAction = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.login<TValues, LoginResponse>(
      "/Auths/sign-in",
      values
    );

    if (!response?.isSuccess) {
      return response;
      // throw new Error("No response from server");
    }

    if (response.isSuccess && response.value?.accessToken) {
      const cookieStore = await cookies();

      cookieStore.set("accessToken", response.value.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,

        // sameSite: "strict",
        // path: "/",
      });

      cookieStore.set("refreshToken", response.value.refreshToken, {
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
        isSuccess: true,
        message: "Login successful",
        token: response.value.accessToken,
        refreshToken: response.value.refreshToken,
      };
    } else {
      console.error("Login failed. Error:", response.error?.message);
      return {
        isSuccess: false,
        message: response.error?.message || "Invalid credentials",
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
