"use client";

import { getProfile } from "@/actions/user";
import { ApiResponse, Profile } from "@/types/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { toast } from "sonner";

import Link from "next/link";
import Notification from "@/features/notification/notification";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";

import { LoginDialog } from "../custom/_custom-dialog/login-dialog";
import { logOut } from "@/actions/auth";
import { Skeleton } from "../ui/skeleton";
import { Boxes, Heart, LogOut, MapPinHouse, UserRoundPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { USER_KEY } from "@/app/key/user-key";
import { VerifyDialog } from "../custom/_custom-dialog/verify-account-dialog";
import { RegisterDialog } from "../custom/_custom-dialog/register-dialog";
import { useRouter } from "next/navigation";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { placeholderImage } from "@/utils/label";

export const UserMenu = memo(() => {
  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess,
    status,
  } = useQuery<ApiResponse<Profile>>({
    // queryKey: ["authUser"],
    queryKey: [USER_KEY.PROFILE],
    queryFn: async () => {
      const response = await getProfile();

      if (!response || !response.isSuccess || !response.data) {
        toast.error("Lỗi hệ thống");
        return undefined; // Handle error case
      }
      return response.data; // Ensure this matches `Profile`
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const loginDialog = useLoginDialog();

  return isUserLoading ? (
    <Skeleton className="h-10 w-10 rounded-full" />
  ) : user?.isSuccess && user?.value ? (
    <>
      {/* Notification Popover */}
      <Notification />
      <Link
        href="/favorites"
        className="h-11 w-10 flex items-center justify-center hover:bg-neutral-500/20 rounded-[14px]"
      >
        <Heart className="size-4" />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.value?.avatar ?? placeholderImage}
              alt={user?.value?.name}
            />
            <AvatarFallback>{user?.value?.name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex gap-1 items-start">
              <Avatar className="h-10 w-10">
                {/* <AvatarImage src={user?.value?.avatar} alt={user?.value?.name} />
                <AvatarFallback>{user?.value?.name}</AvatarFallback> */}
                <AvatarImage
                  src={user?.value?.avatar ?? placeholderImage}
                  alt={user?.value?.name ?? "Tên"}
                />
                <AvatarFallback>
                  {user?.value?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-semibold italic leading-none">
                  {user?.value?.name}
                </span>
                {user?.value?.email ? (
                  <span className="text-xs leading-none text-sky-700">
                    {user?.value.email}
                  </span>
                ) : (
                  <span className="text-xs leading-none text-sky-700">
                    {user?.value?.phone}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link
                href="/profile"
                className="flex flex-row w-full items-center gap-2"
              >
                <UserRoundPen size={16} />
                <span>Hồ sơ</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link
                href="/profile?tab=address"
                className="flex flex-row w-full items-center gap-2"
              >
                <MapPinHouse size={16} />
                <span>Địa chỉ</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link
                href="/profile?tab=order-tracking"
                className="flex flex-row w-full items-center gap-2"
              >
                <Boxes size={16} />
                <span>Đơn hàng</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await logOut();
              queryClient.removeQueries({ queryKey: ["authUser"] });
              queryClient.removeQueries({ queryKey: [USER_KEY.PROFILE] });

              queryClient.removeQueries({
                queryKey: [USER_KEY.ADDRESS],
              });
              router.push("/");
              router.refresh();
              loginDialog.onOpen();
            }}
            className="hover:cursor-pointer"
          >
            <LogOut />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {user?.value?.isVerification === false && (
        <VerifyDialog user={user?.value} />
      )}
    </>
  ) : (
    <div className="flex space-x-2">
      <LoginDialog />
      <div className="hidden lg:block">
        <RegisterDialog />
      </div>
    </div>
  );
});

UserMenu.displayName = "UserMenu";
