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
  Fan,
  Gift,
  CalendarRange,
  Warehouse,
  NotebookPen,
  Banknote,
  ShieldCheck,
  PackagePlus,
  Wallet,
  History,
  CircleArrowOutDownRight,
  Import,
  ChartPie,
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
import { Logo } from "../global-components/logo";

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
          icon: BookKey,
        },
        {
          title: "Bài viết",
          url: "/admin/blog",
          icon: BookOpenText,
        },
      ],
    },
    {
      title: "Kho",
      url: "/admin/inventory",
      icon: Warehouse,
      items: [
        {
          title: "Sản phẩm",
          url: "/admin/inventory",
          icon: Warehouse,
        },
        {
          title: "Lịch sử kho",
          url: "/admin/picking-item",
          icon: History,
        },
      ],
    },
    {
      title: "Quản lí ví",
      url: "/admin/wallet",
      icon: Wallet,
      items: [
        {
          title: "Danh sách ví",
          url: "/admin/wallet",
          icon: Wallet,
        },
        {
          title: "Lịch sử ví",
          url: "/admin/wallet/history",
          icon: History,
        },
        {
          title: "Yêu cầu rút tiền",
          url: "/admin/wallet/withdraw",
          icon: CircleArrowOutDownRight
        }
      ],
    },
    {
      title: "Cài đặt",
      url: "/admin/settings",
      icon: Settings,
      items: [
        // {
        //   title: "Thanh trượt",
        //   url: "/admin/settings/sliders",
        //   icon: GalleryHorizontal,
        // },
        {
          title: "Thanh toán",
          url: "/admin/settings/payments",
          icon: Banknote,
        },
        {
          title: "Gói quà",
          url: "/admin/settings/combo",
          icon: PackagePlus,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Báo cáo biến thể",
      url: "/admin/dashboard",
      icon: ChartPie,
    },
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
      icon: MessageSquareMore,
    },
    {
      name: "Khuyến mãi",
      url: "/admin/promotion",
      icon: Fan,
    },
    {
      name: "Gói quà",
      url: "/admin/combo",
      icon: Gift,
    },
    {
      name: "Sự kiện",
      url: "/admin/event",
      icon: CalendarRange,
    },
    {
      name: "Kế hoạch",
      url: "/admin/plan",
      icon: NotebookPen,
    },
    {
      name: "Nhập hàng",
      url: "/admin/product-batch",
      icon: Import,
    },
    {
      name: "Chứng chỉ",
      url: "/admin/certification",
      icon: ShieldCheck,
    },
    {
      name: "Lịch sử thanh toán",
      url: "/admin/payment",
      icon: Banknote,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebar = useSidebar();

  console.log(sidebar);
  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <Logo height={100} width={100} isTextHidden={!sidebar.open} />
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
