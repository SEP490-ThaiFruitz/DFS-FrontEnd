"use client";

import * as React from "react";
import {
  AudioWaveform,
  Settings,
  Command,
  GalleryVerticalEnd,
  LayoutList,
  TableProperties,
  TicketPercent,
  GalleryHorizontal,
  BookOpen,
  BookOpenText,
  BookKey,
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
import { useAuth } from "@/providers/auth-provider";

// This is sample data.
const data = {
  user: {
    name: "Manger",
    email: "Manger@gmail.com",
    avatar: "https://res.cloudinary.com/deojypwtl/image/upload/v1736993028/avatar/jlktmd5ukeb2t12ozf9i.png",
    role: "Quản trị viên"
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
