"use client";

import { Button } from "@/components/ui/button";
import { TotalCard } from "../components/total-card";
import {
  CalendarIcon,
  LucideIcon,
  MapPinIcon,
  User,
  UserCheckIcon,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { UserStatisticChart } from "../components/user-statistic-chart";
import { UsersOrdersTotalChart } from "../components/users-orders-total-chart";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/global-components/data-table/data-table";
import Image from "next/image";
import { memo } from "react";
import { ReportUserValue } from "./page";
import { CustomerType, userReportColumns } from "./user -report-column";
import { EnhanceDataTableWithAllFeatures } from "@/components/global-components/data-table/enhance-data-table";
import { formatVND } from "@/lib/format-currency";

interface UserReportClientProps {
  userReportData: CustomerType[] | [];
}

const HeaderTitle = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <h1 className="text-xl font-semibold">Báo Cáo người dùng</h1>
      <div className="ml-auto flex items-center gap-4">
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Hôm nay</SelectItem>
            <SelectItem value="week">Tuần này</SelectItem>
            <SelectItem value="month">Tháng này</SelectItem>
            <SelectItem value="quarter">Quý này</SelectItem>
            <SelectItem value="year">Năm này</SelectItem>
          </SelectContent>
        </Select> */}
        <Button>Xuất báo cáo</Button>
      </div>
    </header>
  );
};

const UserReportClient = ({ userReportData }: UserReportClientProps) => {
  const totalCustomers = userReportData?.length;
  const activeCustomers = userReportData?.filter((c) => c.status).length;
  const totalSpend = userReportData?.reduce(
    (sum, customer) => sum + customer.totalSpend,
    0
  );
  const avgSpend = totalSpend / totalCustomers;

  // console.log(userReportData);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <HeaderTitle />

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <TotalCard
            title="Tổng số người dùng"
            value={totalCustomers}
            icon={User}
            subtitle="Sô lượng khách hàng hiện tại"
            classNameIcon="bg-red text"
          />
          <TotalCard
            title="Tổng doanh thu "
            value={formatVND(totalSpend)}
            icon={User}
            subtitle="Từ đơn hàng khách hàng"
          />
          <TotalCard
            title="Người dùng đang hoạt động "
            value={activeCustomers}
            icon={User}
            subtitle="Số lượng khách hàng đang hoạt động"
          />
          <TotalCard
            title="Trung bình đơn"
            value={formatVND(avgSpend)}
            icon={User}
            subtitle="Trung bình đơn hàng mỗi khách hàng"
          />
        </div>

        <div className=" w-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={37} minSize={30}>
              <UserStatisticChart userReportData={userReportData} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={63} minSize={50}>
              <UsersOrdersTotalChart userReportData={userReportData} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="w-full">
          {/* <DataTable
            data={userReportData}
            columns={userReportColumns}
            searchFiled="name"
          /> */}

          <EnhanceDataTableWithAllFeatures
            columns={userReportColumns}
            initialData={userReportData}
            enableExpansion={false}
            enableSelection={false}

            // queryClient={undefined}
          />
        </div>
      </main>
    </div>
  );
};

export default memo(UserReportClient);
