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
  NewspaperIcon,
  LucideIcon,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, Profile } from "@/types/types";
import { toast } from "sonner";
import { Logo } from "@/components/global-components/logo";
import { NavProjectsItem } from "./nav-project-item";
import { TabContentTypes } from "../sidebar-container";

type TabProjects = {
  name: string;
  tab: string;
  icon: LucideIcon;
};
type CustomerAppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;

  tabProjects: TabContentTypes[];
};

export function CustomerAppSidebar({
  tab,
  setTab,
  tabProjects,
  ...props
}: CustomerAppSidebarProps) {
  const sidebar = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="inset"
      data-collapsible="icon"
      className="
      
      border-white/50 border-t bg-white/60  group-data-[variant=inset]:backdrop-blur-2xl group-data-[variant=inset]:bg-inherit 
      "
      // classNameChildren="border-[2px] rounded-3xl border-gray-200 shadow-lg bg-zinc-50"
    >
      {/* <SidebarHeader>
        <Logo height={100} width={100} isTextHidden={!sidebar.open} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavProjectsItem projects={tabProjects} tab={tab} setTab={setTab} />
        {/* <NavMain items={data.navMain} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
