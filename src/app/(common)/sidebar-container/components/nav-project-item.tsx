"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { JSX } from "react";
import { TabContentTypes } from "../sidebar-container";

export function NavProjectsItem({
  projects,
  label,
  tab,
  setTab,
}: {
  projects: TabContentTypes[];
  label?: string;

  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { isMobile } = useSidebar();

  const pathname = usePathname();

  return (
    // <SidebarGroup className="group-data-[collapsible=icon]:hidden">
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = tab === item.value;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`py-4 h-10 hover:scale-110 cursor-pointer mx-auto transition duration-300 ${
                  isActive && "bg-slate-400/25 font-bold "
                }`}
                tooltip={item.title}
              >
                <div
                  onClick={() => setTab(item.value)}
                  className="flex items-center gap-2"
                >
                  <item.icon
                    className={`size-full ${
                      isActive && "text-slate-700 font-bold "
                    } `}
                  />
                  <span>{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
