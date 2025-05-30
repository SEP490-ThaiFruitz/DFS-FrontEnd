import { ROLES, checkRole, isAdmin } from "@/actions/checkrole";
import { AppSidebar } from "@/components/_sidebar-configuration/app-sidebar";
import { DynamicBreadcrumb } from "@/components/_sidebar-configuration/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { notFound } from "next/navigation";

interface AdminRouteLayoutProps {
  children: React.ReactNode;
}

const AdminRouteLayout = async ({ children }: AdminRouteLayoutProps) => {
  const admin = await isAdmin();

  if (!admin) {
    return notFound();
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>

        <div className="flex flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminRouteLayout;
