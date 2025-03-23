"use client";

import { getProfile } from '@/actions/user';
import { ApiResponse, Profile } from '@/types/types';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

type Props = {
    children: ReactNode;
}

interface Payment {
    isSuccess: boolean,
    orderId: string,
    userId: string,
}

export default function SignalRProvider({ children }: Props) {
    const connection = useRef<HubConnection | null>(null);
    const { data: user } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await getProfile();
                if (res?.isSuccess) {
                    const data: ApiResponse<Profile> = res?.data;
                    return data.value;
                }
                return null;
            } catch (error) {
                console.log(error);
                toast.error("Lỗi hệ thống");
            }
        },
        retry: false,
        initialData: null,
    });

    const notifyUrl = process.env.NODE_ENV !== "production"
        ? process.env.NEXT_PUBLIC_NOTIFY_URL!
        : "https://api.hamazaki.online/hubs/notifications";


    const handlePayment = useCallback((payment: Payment) => {
        console.log("PaymentReturn", payment)
        if (user?.id === payment.userId) {
            return toast.success(payment.orderId)
        }
    }, [user?.id])

    useEffect(() => {
        if (!connection.current) {
            connection.current = new HubConnectionBuilder()
                .withUrl(notifyUrl)
                .withAutomaticReconnect()
                .build();

            connection.current.start()
                .then(() => 'Connected to notification hub')
                .catch(err => console.log(err));
        }

        connection.current.on('ReceivePayment', handlePayment);
        if (user) {
            console.log({ user })
            connection.current.send('RegistHook', user.id, user.role, connection.current.connectionId);
        }

        return () => {
            connection.current?.off('ReceivePayment', handlePayment);
        }

    }, [user, notifyUrl, handlePayment])

    return children;
}