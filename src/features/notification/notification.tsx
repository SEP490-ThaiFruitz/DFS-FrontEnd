"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiResponse, PageResult } from "@/types/types";
import NotificationList from "./noftification-list";
import { NotificationItem } from "./card-notification";

interface NotificationData {
  notifications: PageResult<NotificationItem>;
  totalUnread: number;
}

const Notification = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [pageSize, setPageSize] = useState<number>(5);
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
    <Popover>
      <PopoverTrigger>
        <div className="relative inline-flex text-sm h-11 w-10 items-center justify-center text-neutral-800 dark:text-neutral-300 hover:bg-neutral-500/20 rounded-[14px] cursor-pointer transition">
          <Bell className="size-4" />
          {notifications?.value && notifications?.value?.totalUnread > 0 && (
            <span
              className="absolute top-1 -right-1 w-4 h-4 bg-red-500 text-primary-foreground text-xs font-bold
                rounded-full flex items-center justify-center"
            >
              {notifications?.value?.totalUnread > 9
                ? "9+"
                : notifications?.value?.totalUnread}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 md:w-96 p-0">
        <div className="flex flex-col max-h-[600px]">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Thông báo</h3>
            {notifications?.value && notifications?.value?.totalUnread > 0 && (
              <p className="text-sm text-muted-foreground">
                Bạn có {notifications.value.totalUnread} thông báo chưa đọc{" "}
                {notifications.value.totalUnread !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Tabs
            defaultValue={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3">
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
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
