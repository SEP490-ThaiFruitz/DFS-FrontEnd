import { AppSidebar } from "@/components/_sidebar-configuration/app-sidebar";
import { DynamicBreadcrumb } from "@/components/_sidebar-configuration/dynamic-breadcrumb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}
export default function AdminRootLayout({ children }: AdminLayoutProps) {
  return <div>{children}</div>;
}
