import Cookies from "js-cookie";
import { cookies } from "next/headers";

export const getF = async <T>(endpoint: string): Promise<T | any> => {
  const token = Cookies.get("accessToken");

  const cookiesStore = await cookies();
  console.log(cookiesStore.get("accessToken"));

  console.log({ tokenFromGet: token });

  try {
    console.log("API URL:", process.env.NEXT_PUBLIC_URL_API);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`
    );

    if (!response.ok) {
      console.log("response", response);

      return undefined;
    }
    return await response.json();
  } catch (error) {
    console.log({ error });
  }
};
