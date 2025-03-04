import { z } from "zod";

import axios from "axios";
import Cookies from "js-cookie";
import { interactApi } from "../client/interact-api";

export const onSubmit = async <T,>(
  endpoint: string,
  data: T,
  zodSchema?: z.ZodObject<any>
) => {
  const token = Cookies.get("accessToken");

  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwNCIsIk5hbWUiOiJKYWNrIDk3IiwiUm9sZSI6IkN1c3RvbWVyIiwiRW1haWwiOiJjdXN0b21lckBnbWFpbC5jb20iLCJQaG9uZSI6IjA5ODcwOTM0NTYiLCJleHAiOjE3NDA4NTY0MDIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE1OC8iLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxNTgvIn0.v-gPodzIdbcNJIVmzLHDTbroXnBl9dcNlERk4QCZpO4";

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // console.log({ headers });

  // console.log(data);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      data,
      {
        headers,
      }
    );

    console.log({ response });

    // const response = await interactApi.post(endpoint, data);

    if (response?.status === 200) {
      // toast.success("Tạo mới sản phẩm thành công");
      return response.data;
    }
  } catch (error) {
    return { success: false, message: "Có lỗi xả ra khi tạo mới sản phẩm" };
  }
};
