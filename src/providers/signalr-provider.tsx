"use client";

import { API } from "@/actions/client/api-config";
import { USER_KEY } from "@/app/key/user-key";
import Cookies from "js-cookie";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ApiResponse, Profile } from "@/types/types";

type Props = {
  children: ReactNode;
};

interface Payment {
  isSuccess: boolean;
  orderId: string;
  userId: string;
}

export default function SignalRProvider({ children }: Props) {
  const connection = useRef<HubConnection | null>(null);
  const cookieToken = Cookies.get("accessToken");
  const { data: user } = useQuery<ApiResponse<Profile>>({
    queryKey: [USER_KEY.PROFILE],
    queryFn: async () => {
      try {
        try {
          const response = await API.get("/Users/profile");

          if (response) {
            return response;
          }
          throw new Error("Lỗi")
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(error);
      }
    },
    retry: false,
    enabled: cookieToken !== undefined,
  });

  const notifyUrl = process.env.NEXT_PUBLIC_NOTIFY_URL!;

  const handlePayment = useCallback(
    (payment: Payment) => {
      //   console.log("PaymentReturn", payment);
      if (user?.value?.id === payment.userId) {
        return toast.success(payment.orderId);
      }
    },
    [user?.value?.id]
  );

  useEffect(() => {
    if (!connection.current) {
      connection.current = new HubConnectionBuilder()
        .withUrl(notifyUrl)
        .withAutomaticReconnect()
        .build();

      connection.current
        .start()
        .then(() => "Connected to notification hub")
        .catch((err) => console.log(err));
    }

    connection.current.on("ReceivePayment", handlePayment);
    if (
      connection.current &&
      connection.current.state == HubConnectionState.Connected
    ) {
      if (user) {
        connection.current
          .send(
            "RegistHook",
            user.value?.id,
            user.value?.role,
            connection.current.connectionId
          )
          .catch((error) => console.log(error));
      }
    }

    return () => {
      connection.current?.off("ReceivePayment", handlePayment);
    };
  }, [user, notifyUrl, handlePayment]);

  return children;
}
