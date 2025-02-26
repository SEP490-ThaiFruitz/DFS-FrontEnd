"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, type ComponentProps } from "react";
import { Logo } from "./logo";
import { LoginDialog } from "../custom/_custom-dialog/login-dialog";
import { RegisterDialog } from "../custom/_custom-dialog/register-dialog";
import { ShoppingBagSheet } from "../custom/_custom-sheet/shopping-bag-sheet";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { BlogCategory } from "@/app/(admin)/admin/blog/category/page";
import { ApiResponse, Profile } from "@/types/types";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Boxes, LogOut, MapPinHouse, UserRoundPen } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/actions/user";
import { toast } from "sonner";
import { logOut } from "@/actions/auth";
import { useRouter } from "next/navigation";

export const Navigate = () => {
  const { data: blogCategories } = useFetch<ApiResponse<BlogCategory[]>>("/BlogCategories", ["BlogCategories", "Guest"])
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter();
  const { data: user } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await getProfile();
        if (res?.isSuccess) {
          const data: ApiResponse<Profile> = res?.data
          return data.value;
        }
        return null;
      } catch (error) {
        console.log(error);
        toast.error("Lỗi hệ thống")
      }
    },
    retry: false,
    initialData: null,
  });

  useEffect(() => {
    if (user && user?.role !== "Customer") {
      router.push("/admin")
    }
  }, [user])

  const notification = [
    {
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
      title: "Administrator",
      content: "The React Framework – created and maintained by @vercel.",
      status: "Unread",
    },
    {
      name: "Jane Smith",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
    {
      name: "Jane Smith1",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
    {
      name: "Jane Smith5",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
    {
      name: "Jane Smith6",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
    {
      name: "Jane Smith7",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
    {
      name: "Jane Smith8",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
    {
      name: "Jane Smith8",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
    {
      name: "Jane Smith8",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
    {
      name: "Jane Smith8",
      avatar: "https://example.com/jane.png",
      title: "Manager",
      content: "Building scalable web solutions.",
      status: "Read",
    },
  ];

  const styleClassName =
    "relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer";

  return (
    // <NavbarContainer className="w-full rounded-none list-none flex items-center justify-between">
    //   {/* <div className="flex items-center justify-between "> */}
    //   <div className="flex items-center gap-x-1  ">
    //     <div className="pl-4">
    //       <Logo height={70} width={70} />
    //     </div>
    //     <NavbarLink href="#">Icons</NavbarLink>
    //     <NavbarLink href="#">App</NavbarLink>
    //     <NavbarLink href="#">Pricing</NavbarLink>
    //     <NavbarLink href="#" isHighlighted={true}>
    //       Buy Icons
    //     </NavbarLink>
    //   </div>
    //   <div className="flex items-center gap-x-1 mr-8">
    //     {/* <NavbarLink href="#" onClick={() => {}}>
    //       <LogIn className="size-4 mr-1" /> Login
    //     </NavbarLink> */}
    //     {/* <NavbarLink href="#">Sign Up</NavbarLink> */}
    //     <LoginDialog />
    //     <RegisterDialog />
    //     <ShoppingBagSheet />
    //   </div>

    //   {/* </div> */}
    // </NavbarContainer>

    <div
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 w-full shadow-lg backdrop-blur-md bg-neutral-100/50 dark:bg-neutral-800/50 rounded-b-2xl",
        "w-full rounded-none list-none shadow-sm"
      )}
    >
      <Menu
        setActive={setActive}
        className="h-full flex items-center justify-between w-full rounded-none "
      >
        <div className="pl-4 py-4 ">
          <Logo height={60} width={60} />
        </div>

        <div>
          <Link href="/">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Trang chủ"
              className={styleClassName}
            />
          </Link>

          <MenuItem
            setActive={setActive}
            active={active}
            item="Sản phẩm"
            className={styleClassName}
          >
            <div className="  text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Algochurn"
                href="https://algochurn.com"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Prepare for tech interviews like never before."
              />
              <ProductItem
                title="Tailwind Master Kit"
                href="https://tailwindmasterkit.com"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Production ready Tailwind css components for your next project"
              />
              <ProductItem
                title="Moonbeam"
                href="https://gomoonbeam.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                description="Never write from scratch again. Go from idea to blog in minutes."
              />
              <ProductItem
                title="Rogue"
                href="https://userogue.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
              />
            </div>
          </MenuItem>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Quà tặng"
            className={styleClassName}
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
            className={styleClassName}
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
              className={styleClassName}
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

        <div className="flex items-center">
          {user && (
            <Popover>
              <PopoverTrigger>
                <div className="relative inline-flex text-sm h-11 w-10 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer">
                  <div className="relative">
                    <Bell className="size-4 mr-1 relative" />
                    <span
                      className="
                                 absolute
                                 -top-1
                                 -right-2
                                 w-4
                                 h-4
                                 bg-primary-500
                                 text-slate-900
                                  rounded-full
                                 flex items-center justify-center
                                 "
                    >
                      0
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="min-w-96 max-h-[600px] overflow-y-hidden hover:overflow-y-auto scroll-smooth"
                style={{ scrollbarWidth: 'thin' }}
              >
                <p className="font-bold mb-2">Thông báo</p>
                <Tabs defaultValue="all">
                  <TabsList className="ml-auto my-4">
                    <TabsTrigger
                      value="all"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Tất cả
                    </TabsTrigger>
                    <TabsTrigger
                      value="unread"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Chưa đọc
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="m-0">
                    {notification.map((_) => (
                      <div key={_.name} className="flex items-center gap-4 py-2 w-fit hover:cursor-pointer">
                        <Avatar>
                          <AvatarImage src={"/images/dried-fruit.webp"} alt={`${_.name}'s avatar`} />
                          <AvatarFallback>{_.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold line-clamp-5 whitespace-pre-line">
                            {_.title} + {" "}
                            {_.content}

                          </h4>

                        </div>
                        <Badge
                          variant={_.status === 'Online' ? 'default' : 'secondary'}
                          className="mt-2"
                        >
                          {_.status}
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="unread" className="m-0">
                    {notification.map((_) => (
                      <div key={_.name} className="flex items-center gap-4 py-2 w-fit hover:cursor-pointer">
                        <Avatar>
                          <AvatarImage src={"/images/dried-fruit.webp"} alt={`${_.name}'s avatar`} />
                          <AvatarFallback>{_.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold line-clamp-5 whitespace-pre-line">
                            {_.title} + {" "}
                            {_.content}

                          </h4>

                        </div>
                        <Badge
                          variant={_.status === 'Online' ? 'default' : 'secondary'}
                          className="mt-2"
                        >
                          {_.status}
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <div className="mt-2 text-center">
                  <Button className="inline-block" size="sm">Xem thêm</Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <ShoppingBagSheet />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="hover:cursor-pointer">
                    <UserRoundPen />
                    Hồ sơ
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile?tab=address")} className="hover:cursor-pointer">
                    <MapPinHouse />
                    Địa chỉ
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <Boxes />
                    Đơn hàng
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  await logOut()
                  window.location.reload();
                }} className="hover:cursor-pointer">
                  <LogOut />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!user && (
            <>
              <LoginDialog />
              <RegisterDialog />
            </>
          )}
        </div>

      </Menu >
    </div >
  );
};

export default Navigate;

export const NavbarContainer = ({
  children,
  className,
  ...props
}: ComponentProps<"nav">) => {
  return (
    <nav
      className={cn(
        "flex w-fit backdrop-blur-md bg-neutral-100/50 dark:bg-neutral-800/50 rounded-2xl shadow-xl shadow-black/5 p-px relative border border-neutral-400/10",
        className
      )}
      {...props}
    >
      {/* <ul className="gap-2 flex w-fit items-center justify-between"> */}
      {children}
      {/* </ul> */}
    </nav>
  );
};

export const NavbarLink = ({
  children,
  href,
  isHighlighted,
  ...props
}: {
  isHighlighted?: boolean;
} & ComponentProps<"a">) => {
  return (
    <li>
      <a
        href={href}
        className={cn(
          "relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center",
          isHighlighted
            ? "text-white bg-gradient-to-b from-violet-500 to-violet-600 rounded-[14px] hover:from-violet-500/80 hover:to-violet-600/80 shadow-md transition-all hover:scale-105"
            : "text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px]"
        )}
        {...props}
      >
        {children}
      </a>
    </li>
  );
};
