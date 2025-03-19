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
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/actions/user";
import { ApiResponse, Profile } from "@/types/types";
import { toast } from "sonner";
import { Logo } from "@/components/global-components/logo";

const data = {
  navMain: [
    {
      title: "Quản lý đơn hàng",
      url: "#",
      icon: LayoutList,
      items: [
        {
          title: "Các đơn hàng",
          url: "#",
        },
        {
          title: "",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý sản phẩm",
      url: "/admin/blog",
      icon: BookOpen,
      items: [
        {
          title: "Sản phẩm trong kho",
          url: "#",
          icon: BookKey,
        },
        {
          title: "Tình trạng sản phẩm",
          url: "#",
          icon: BookOpenText,
        },

        {
          title: "Phương pháp sấy",
          url: "#",
          icon: BookOpenText,
        },
      ],
    },
    {
      title: "Cài đặt",
      url: "/admin/settings",
      icon: Settings,
      items: [
        {
          title: "Thanh trượt",
          url: "/admin/settings/sliders",
          icon: GalleryHorizontal,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Báo cáo Doanh Thu",
      url: "/manager",
      icon: TableProperties,
    },
    {
      name: "Báo cáo người dùng",
      url: "/manager/users-report",
      icon: UserRound,
    },
    {
      name: "Quản Lý Sự Kiện",
      url: "#",
      icon: TicketPercent,
    },
    {
      name: "Các phản hồi",
      url: "#",
      icon: MessageSquareMore,
    },
  ],
};

export function ManagerAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
