import { ROLES, checkRole } from "@/actions/checkrole";
import { AppSidebar } from "@/components/_sidebar-configuration/app-sidebar";
import { DynamicBreadcrumb } from "@/components/_sidebar-configuration/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

interface AdminRouteLayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
  test: React.ReactNode;
}

const AdminRouteLayout = async ({
  children,
  auth,
  test,
}: AdminRouteLayoutProps) => {
  const isAdmin = await checkRole(ROLES.Administrator);

  return (
    <>
      {isAdmin ? (
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

            <div className="flex flex-col">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <div className="absolute size-full h-screen overflow-hidden ">
          {auth}
        </div>
      )}
    </>

    // <div className="absolute size-full h-screen overflow-hidden ">{auth}</div>
  );
};

export default AdminRouteLayout;
