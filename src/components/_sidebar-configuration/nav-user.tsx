"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { logOut } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { ApiResponse, Profile } from "@/types/types";
import { USER_KEY } from "@/app/key/user-key";
import { Skeleton } from "../ui/skeleton";
import { API } from "@/actions/client/api-config";
import Cookies from "js-cookie";

enum ROLES {
  Administrator = "Administrator",
  Staff = "Staff",
  Manager = "Manager",
  Customer = "Customer",
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const queryClient = useQueryClient();
  const cookieToken = Cookies.get("accessToken");
  // const { data: user } = useQuery({
  //   queryKey: ["authUser"],
  //   queryFn: async () => {
  //     try {
  //       const res = await getProfile();
  //       if (res?.isSuccess) {
  //         const data: ApiResponse<Profile> = res?.data;
  //         return data.value;
  //       }
  //       return null;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   retry: false,
  //   initialData: null,
  // });

  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess,
    status,
  } = useQuery<ApiResponse<Profile>>({
    // queryKey: ["authUser"],
    queryKey: [USER_KEY.PROFILE],
    queryFn: async () => {
      try {
        const response = await API.get("/Users/profile");
        console.log("dsadsa", response)
        if (response) {
          return response;
        }
        throw new Error("Lỗi")
      } catch (error) {
        console.log(error)
      }
    },
    enabled: cookieToken !== undefined
  });

  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case "Administrator":
        return "Quản trị viên";
      case "Manager":
        return "Quản lí";
      default:
        return "Khách hàng";
    }
  };

  return !isUserLoading ? (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage
                  src={user?.value?.avatar}
                  alt={user?.value?.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.value?.name}
                </span>
                <span className="truncate text-xs">
                  {getRoleLabel(user?.value?.role)}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.value?.avatar}
                    alt={user?.value?.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.value?.name}
                  </span>
                  <span className="truncate text-xs">
                    {getRoleLabel(user?.value?.role)}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {
                if (user?.value?.role === ROLES.Administrator) {
                  router.push("/admin/profile")
                } else if (user?.value?.role === ROLES.Customer) {
                  router.push("/profile")
                } else {
                  router.push("/manager/profile")
                }
              }} className="cursor-pointer">
                <BadgeCheck />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                if (user?.value?.role === ROLES.Administrator) {
                  router.push("/admin/notification")
                } else if (user?.value?.role === ROLES.Customer) {
                  router.push("/notification")
                } else {
                  router.push("/manager/notification")
                }
              }} className="cursor-pointer">
                <Bell />
                Thông báo
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await logOut();
                queryClient.removeQueries({
                  queryKey: [USER_KEY.PROFILE],
                });

                if (
                  (user?.value?.role === ROLES.Administrator ||
                    user?.value?.role === ROLES.Manager)
                ) {
                  router.push("/manage");
                } else {
                  router.push("/");
                }
              }}
              className="cursor-pointer"
            >
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  ) : (
    <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
  );
}
