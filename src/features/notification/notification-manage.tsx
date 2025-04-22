"use client"
import { ApiResponse, PageResult } from '@/types/types';
import React, { useEffect, useState } from 'react'
import { NotificationItem } from './card-notification';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationList from './noftification-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationData {
    notifications: PageResult<NotificationItem>;
    totalUnread: number;
}

function NotificationManage() {
    const [activeTab, setActiveTab] = useState<string>("All");
    const [pageSize, setPageSize] = useState<number>(10);
    const {
        data: notifications,
        refetch,
        isLoading,
    } = useFetch<ApiResponse<NotificationData>>(
        `/Notifications/?pageIndex=1&pageSize=${pageSize}&status=${activeTab}`,
        ["notifications"]
    );

    useEffect(() => {
        refetch();
    }, [pageSize, activeTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    const handleLoadMore = () => {
        setPageSize((prevSize) => prevSize + 5);
    };

    return (
        <Card className="cardStyle">
            <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-bold">
                    Thông báo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold">Thông báo</h3>
                        {notifications?.value && notifications?.value?.totalUnread > 0 && (
                            <div className="text-sm text-muted-foreground">
                                Bạn có {notifications.value.totalUnread} thông báo chưa đọc{" "}
                            </div>
                        )}
                    </div>
                    <Tabs
                        defaultValue={activeTab}
                        onValueChange={handleTabChange}
                        className="w-full"
                    >
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="All">Tất cả</TabsTrigger>
                            <TabsTrigger value="Unread">Chưa đọc</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab} className="mt-0">
                            <ScrollArea className="max-h-[450px] overflow-y-auto">
                                <NotificationList
                                    notifications={
                                        notifications?.value?.notifications?.items ?? []
                                    }
                                    isLoading={isLoading}
                                    onLoadMore={handleLoadMore}
                                    hasMore={
                                        notifications?.value?.notifications?.hasNextPage || false
                                    }
                                />
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}

export default NotificationManage