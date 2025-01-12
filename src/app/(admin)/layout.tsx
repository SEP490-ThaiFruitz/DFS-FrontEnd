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

export const metadata = {
  title: "Admin Panel",
};

interface AdminLayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
}
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>

          <div className="flex flex-col">
            <h1 className="text-rose-500">{children}</h1>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
