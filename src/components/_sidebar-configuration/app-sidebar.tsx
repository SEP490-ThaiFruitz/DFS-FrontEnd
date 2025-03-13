"use client";

import * as React from "react";
import {
  LayoutList,
  TableProperties,
  TicketPercent,
  GalleryHorizontal,
  BookOpen,
  BookOpenText,
  BookKey,
  UserRound,
  Settings,
  MessageSquareMore,
} from "lucide-react";

import { NavMain } from "@/components/_sidebar-configuration/nav-main";
import { NavProjects } from "@/components/_sidebar-configuration/nav-projects";
import { NavUser } from "@/components/_sidebar-configuration/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Logo } from "../global-components/logo";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/actions/user";
import { ApiResponse, Profile } from "@/types/types";
import { toast } from "sonner";

const data = {
  navMain: [
    {
      title: "Sản phẩm",
      url: "#",
      icon: LayoutList,
      isActive: true,
      items: [
        {
          title: "Danh sách",
          url: "/admin/product",
        },
        {
          title: "Thêm mới",
          url: "/admin/product/create",
        },
      ],
    },
    {
      title: "Bài viết",
      url: "/admin/blog",
      icon: BookOpen,
      items: [
        {
          title: "Loại bài viết",
          url: "/admin/blog/category",
          icon: BookKey
        },
        {
          title: "Bài viết",
          url: "/admin/blog",
          icon: BookOpenText
        },
      ]
    },
    {
      title: "Cài đặt",
      url: "/admin/settings",
      icon: Settings,
      items: [
        {
          title: "Thanh trượt",
          url: "/admin/settings/sliders",
          icon: GalleryHorizontal
        },
      ]
    },
  ],
  projects: [
    {
      name: "Loại sản phẩm",
      url: "/admin/category",
      icon: TableProperties,
    },
    {
      name: "Mã giảm giá",
      url: "/admin/voucher",
      icon: TicketPercent,
    },
    {
      name: "Người dùng",
      url: "/admin/user",
      icon: UserRound,
    },
    {
      name: "Đánh giá",
      url: "/admin/feedback",
      icon: MessageSquareMore
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  useQuery({
    queryKey: ["authUser, mange"],
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
