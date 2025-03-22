"use client";

import { ApiResponse, Profile } from '@/types/types';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { useQuery } from '@tanstack/react-query';
import React, { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
    children: ReactNode;
}

export default function SignalRProvider({ children }: Props) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const { data: authUser, isPending } = useQuery<ApiResponse<Profile>>({ queryKey: ["authUser"] })
    console.log("Webhook", isPending)
    const apiUrl = process.env.NODE_ENV !== "production"
        ? process.env.NEXT_PUBLIC_NOTIFY_URL
        : "https://api.hamazaki.online/hubs/notifications";

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(apiUrl!)
            .configureLogging(LogLevel.Error)
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);

    }, [apiUrl]);

    useEffect(() => {

        if (connection && connection.state === HubConnectionState.Disconnected) {
            connection
                .start()
                .then(() => {
                    console.log("Connected to notification hub");

                    connection.on("ReceiveNotification", (data: any) => {
                        console.log(data)
                        toast.error(
                            <div>
                                {data}
                            </div>,
                            { duration: 50000 }
                        );

                    });

                })
                .catch((error) => console.log(error));
        }

        if (authUser?.value) {
            console.log(authUser?.value)
        }

        return () => {
            connection?.stop();
        };
    }, [authUser?.value, connection]);

    return children;
}