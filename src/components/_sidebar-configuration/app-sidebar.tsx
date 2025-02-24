"use client";

import * as React from "react";
import {
  AudioWaveform,
  Settings,
  Command,
  GalleryVerticalEnd,
  LayoutList,
  PieChart,
  TableProperties,
  TicketPercent,
  icons,
} from "lucide-react";

import { NavMain } from "@/components/_sidebar-configuration/nav-main";
import { NavProjects } from "@/components/_sidebar-configuration/nav-projects";
import { NavUser } from "@/components/_sidebar-configuration/nav-user";
import { TeamSwitcher } from "@/components/_sidebar-configuration/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { title } from "process";
import { url } from "inspector";
import { Logo } from "../global-components/logo";

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
      name: "Cài đặt",
      url: "/admin/setting",
      icon: Settings,
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
