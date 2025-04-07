import { AppSidebar } from "@/components/_sidebar-configuration/app-sidebar";
import { DynamicBreadcrumb } from "@/components/_sidebar-configuration/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { ManagerAppSidebar } from "./sidebar-manager/manager-app-sidebar";

const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <ManagerAppSidebar />
      <SidebarInset className="overflow-hidden peer-data-[variant=inset]:rounded-3xl peer-data-[variant=inset]:border peer-data-[variant=inset]:border-[oklch(0.929 0.013 255.508)] peer-data-[variant=inset]:shadow-lg">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>

        <div className="flex flex-col ">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ManagerLayout;
