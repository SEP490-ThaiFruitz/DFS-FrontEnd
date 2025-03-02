import { z } from "zod";

import axios from "axios";
import { toast } from "sonner";
import { getHeaders } from "../client/interact-api";

export const onSubmit = async <T,>(
  zodSchema: z.ZodObject<any>,
  data: T,
  endpoint: string
) => {
  try {
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`,
      data,
      {
        headers: await getHeaders(data instanceof FormData)
      }
    );

    if (response.status === 200) {
      toast.success("Tạo mới sản phẩm thành công");
      return response.data;
    }

    toast.error(response.data.message);
  } catch (error) {
    console.log({ error });

    return { success: false, message: "Có lỗi xả ra khi tạo mới sản phẩm" };
  }
};
