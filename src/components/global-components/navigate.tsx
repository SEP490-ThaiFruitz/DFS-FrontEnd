"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Logo } from "./logo";
import { LoginDialog } from "../custom/_custom-dialog/login-dialog";
import { RegisterDialog } from "../custom/_custom-dialog/register-dialog";
import { ShoppingBagSheet } from "../custom/_custom-sheet/shopping-bag-sheet";
import { HoveredLink, Menu, MenuItem } from "../ui/navbar-menu";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { BlogCategory } from "@/app/(admin)/admin/blog/category/page";
import { ApiResponse, Profile } from "@/types/types";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Bell,
  Boxes,
  Heart,
  LogOut,
  MapPinHouse,
  Menu as MenuIcon,
  UserRoundPen,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/actions/user";
import { toast } from "sonner";
import { VerifyDialog } from "../custom/_custom-dialog/verify-account-dialog";
import { useRouter } from "next/navigation";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { logOut } from "@/actions/auth";

import Cookies from "js-cookie";

export const Navigate = () => {
  const { data: blogCategories } = useFetch<ApiResponse<BlogCategory[]>>(
    "/BlogCategories",
    ["BlogCategories", "Guest"]
  );
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginDialog = useLoginDialog();

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

  const token = Cookies.get("accessToken");

  const navItemClassName =
    "relative inline-flex text-sm h-11 w-full md:w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0 before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer";

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 w-full shadow-lg backdrop-blur-md bg-neutral-100/50 dark:bg-neutral-800/50 rounded-b-2xl",
        "w-full rounded-none list-none shadow-sm"
      )}
    >
      <Menu
        setActive={setActive}
        className="h-full flex items-center justify-between w-full rounded-none md:px-4"
      >
        {/* Logo */}
        <div className="hidden md:flex items-center">
          <Logo height={60} width={60} />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/" className={navItemClassName}>
            Trang chủ
          </Link>
          <Link href="/find" className={navItemClassName}>
            Sản phẩm
          </Link>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Quà tặng"
            className={navItemClassName}
          >
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Chính sách"
            className={navItemClassName}
          >
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>
          <Link href="/blogs">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Bài viết"
              className={navItemClassName}
            >
              <div className="flex flex-col space-y-4 text-sm">
                {blogCategories?.value?.map((item: BlogCategory, index) => (
                  <HoveredLink
                    key={index + 1}
                    href={`/blogs?category=${item.name}`}
                  >
                    {item.name}
                  </HoveredLink>
                ))}
              </div>
            </MenuItem>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <ShoppingBagSheet />

          {user ? (
            <>
              {/* Notification Popover */}
              <Popover>
                <PopoverTrigger>
                  <div className="relative inline-flex text-sm h-11 w-10 items-center justify-center text-neutral-800 dark:text-neutral-300 hover:bg-neutral-500/20 rounded-[14px] cursor-pointer transition">
                    <Bell className="size-4" />
                    <span
                      className="absolute top-1 -right-1 w-4 h-4 bg-primary-500
                    text-slate-900 rounded-full flex items-center justify-center"
                    >
                      0
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 md:w-96 max-h-[600px] overflow-y-auto">
                  {/* Notification content remains the same */}
                </PopoverContent>
              </Popover>
              <Link
                href="/favorites"
                className="h-11 w-10 flex items-center justify-center hover:bg-neutral-500/20 rounded-[14px]"
              >
                <Heart className="size-4" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-12 w-12 rounded-full border"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      {user?.email ? (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      ) : (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.phone}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                      className="hover:cursor-pointer"
                    >
                      <UserRoundPen />
                      Hồ sơ
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/profile?tab=address")}
                      className="hover:cursor-pointer"
                    >
                      <MapPinHouse />
                      Địa chỉ
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer">
                      <Boxes />
                      Đơn hàng
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await logOut();
                      queryClient.removeQueries({ queryKey: ["authUser"] });
                      router.push("/");
                      loginDialog.onOpen();
                    }}
                    className="hover:cursor-pointer"
                  >
                    <LogOut />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {!user?.isVerification && <VerifyDialog />}
            </>
          ) : (
            <div className="flex space-x-2">
              <LoginDialog />
              <div className="hidden lg:block">
                <RegisterDialog />
              </div>
            </div>
          )}
        </div>
      </Menu>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-neutral-100/95 dark:bg-neutral-800/95 border-t shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className={navItemClassName}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/find"
              className={navItemClassName}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Quà tặng"
              className={navItemClassName}
            >
              <div className="flex flex-col space-y-4 text-sm pl-4">
                <HoveredLink href="/hobby">Hobby</HoveredLink>
                <HoveredLink href="/individual">Individual</HoveredLink>
                <HoveredLink href="/team">Team</HoveredLink>
                <HoveredLink href="/enterprise">Enterprise</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Chính sách"
              className={navItemClassName}
            >
              <div className="flex flex-col space-y-4 text-sm pl-4">
                <HoveredLink href="/hobby">Hobby</HoveredLink>
                <HoveredLink href="/individual">Individual</HoveredLink>
                <HoveredLink href="/team">Team</HoveredLink>
                <HoveredLink href="/enterprise">Enterprise</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Bài viết"
              className={navItemClassName}
            >
              <div className="flex flex-col space-y-4 text-sm pl-4">
                {blogCategories?.value?.map((item: BlogCategory, index) => (
                  <HoveredLink
                    key={index + 1}
                    href={`/blogs?category=${item.name}`}
                  >
                    {item.name}
                  </HoveredLink>
                ))}
              </div>
            </MenuItem>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigate;
