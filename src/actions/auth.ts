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
    const response = await interactApi.post<TValues>("/Auths/sign-in", values);

    if (!response?.isSuccess) {
      return {
        isSuccess: false,
        status: response?.status,
        message: response?.detail ?? "Invalid credentials",
      };
    }
    const loginResponse: LoginResponse = response.data?.value;

    // console.log({ response });

    const cookieStore = await cookies();

    cookieStore.set("accessToken", loginResponse.accessToken, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,

      // sameSite: "strict",
      // path: "/",
    });

    cookieStore.set("refreshToken", loginResponse.refreshToken, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
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
      ...response?.data.value,
    };
  } catch (error) {
    console.error("Error during login:", error);
    return { isSuccess: false, message: "Lỗi hệ thống" };
  }
};

export const registerAction = async <TValues>(values: TValues) => {
  try {
    const response = await interactApi.post<TValues>("/Auths/sign-up", values);

    if (!response?.isSuccess) {
      return {
        isSuccess: false,
        status: response?.status,
        message: response?.message,
        detail: response?.detail,
      };
    }
    const loginResponse: LoginResponse = response.data?.value;

    const cookieStore = await cookies();

    cookieStore.set("accessToken", loginResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("refreshToken", loginResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error during register:", error);
    return { isSuccess: false, message: "Lỗi hệ thống" };
  }
};

export const logOut = async () => {
  const cookieStore = await cookies();

  await cookieStore.delete("accessToken");
  await cookieStore.delete("refreshToken");

  // const allCookies = cookieStore.getAll()
  // allCookies.forEach((cookie) => {
  //   cookieStore.delete(cookie.name);
  // });
};

export const verifyAccount = async (otp: string) => {
  return await interactApi.post("/Auths/confirm-otp-verification", { otp });
};

export const sendCodeVerifyAccount = async <TValues>(values: TValues) => {
  return await interactApi.post("/Auths/send-otp-verification", values);
};

export const sendForgetPassword = async <TValues>(values: TValues) => {
  return await interactApi.post("/Auths/forgot-password", values);
};

export const verifyForgetPassword = async <TValues>(values: TValues) => {
  return await interactApi.post("/Auths/confirm-otp-reset-password", values);
};

export const updateNewPassword = async <TValues>(values: TValues) => {
  return await interactApi.put("/Auths/reset-password", values);
};
