"use client";

import { DataTable } from "@/components/global-components/data-table/data-table";
import { orderListColumns } from "./order-list-column";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { ApiResponse, PageResult } from "@/types/types";
import { OrderData } from "@/types/report-orders.types";
import {
  EnhanceDataTable,
  EnhanceDataTableWithAllFeatures,
} from "@/components/global-components/data-table/enhance-data-table";
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { TotalCard } from "@/app/(manager)/manager/components/total-card";
import { Banknote, ListCheckIcon, ListOrderedIcon } from "lucide-react";
import { formatVND } from "@/lib/format-currency";
import { OrderAreaChart } from "./order-area-chart";
import { useState } from "react";
import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
import {
  returnExchangeColumns,
  ReturnExchangeOrders,
} from "./return-exchange/return-exchange-columns";

const ORDER_STATUS_TAB = [
  {
    id: "all",
    label: "Tất cả",
    icon: ListOrderedIcon,
  },
  // {
  //   id: "pending",
  //   label: "Chờ xác nhận",
  //   icon: ListOrderedIcon,
  // },
  // {
  //   id: "confirmed",
  //   label: "Đã xác nhận",
  //   icon: ListOrderedIcon,
  // },
  // {
  //   id: "shipping",
  //   label: "Đang giao hàng",
  //   icon: ListOrderedIcon,
  // },
  // {
  //   id: "completed",
  //   label: "Hoàn thành",
  //   icon: ListOrderedIcon,
  // },
  // {
  //   id: "cancelled",
  //   label: "Đã hủy",
  //   icon: ListOrderedIcon,
  // },
  {
    id: "return-exchange",
    label: "Đổi trả",
    icon: ListCheckIcon,
  },
];

export const ReportOrdersListClient = () => {
  const [tab, setTab] = useState("all");

  const orderList = useFetch<ApiResponse<PageResult<OrderData>>>("/Orders", [
    // ORDERS_KEY.ORDERS_LIST,
    "order_list",
  ]);
  const returnExchange = useFetch<ApiResponse<ReturnExchangeOrders[]>>(
    "/Orders/return-exchange",
    [ORDERS_KEY.RETURN_EXCHANGE]
  );

  if (orderList.isLoading && returnExchange.isLoading) {
    return <DataTableSkeleton />;
  }

  const data = orderList.data?.value;

  const returnExchangeData = returnExchange.data?.value;

  // Tính toán tổng số đơn hàng
  const totalOrders = data?.items.length ?? 0;

  // Tính tổng doanh thu (giá trị đơn hàng)
  const totalSales = data?.items.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  // Tính tổng phí ship
  const totalShipFee = data?.items.reduce(
    (sum, order) => sum + order.shipFee,
    0
  );

  // Đếm số đơn hàng đã xác nhận
  const confirmedOrders = data?.items.filter(
    (order) => order.status === "Recieved"
  ).length;

  // Nếu cần, đếm số đơn hàng Pending hoặc các trạng thái khác
  const pendingOrders = data?.items.filter(
    (order) => order.status === "Pending"
  ).length;

  const chartData = data?.items.map((order) => {
    return {
      userName: `${order.user.name}`,
      totalPrice: formatVND(order.totalPrice || 0),
      shipFee: formatVND(order.shipFee || 0),
      priceAfterShip: formatVND(order.totalPrice - order.shipFee || 0),
    };
  });

  // console.log("data orders", data?.items);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <TotalCard
          icon={ListOrderedIcon}
          title="Tổng số đơn hàng"
          value={totalOrders}
          subtitle="--Đơn hàng"
        />
        <TotalCard
          icon={Banknote}
          title="Tổng doanh thu"
          value={formatVND(totalSales ?? 0)}
          subtitle="--VND"
        />
        <TotalCard
          icon={Banknote}
          title="Tổng phí ship"
          value={formatVND(totalShipFee ?? 0)}
          subtitle="--VND"
        />
        <TotalCard
          icon={ListCheckIcon}
          title="Đơn hàng xác nhận"
          value={confirmedOrders ?? 0}
          subtitle="--Đơn hàng"
        />
      </div>

      <div>
        <OrderAreaChart chartData={chartData || []} />
      </div>

      <VercelTab tabs={ORDER_STATUS_TAB} activeTab={tab} onTabChange={setTab} />

      {tab === "all" ? (
        <EnhanceDataTableWithAllFeatures
          columns={orderListColumns}
          initialData={data?.items || []}
          queryKey={[ORDERS_KEY.ORDERS_LIST]}
          title="Danh sách đơn hàng đã đặt"
          description="Danh sách đơn hàng đã đặt của khách hàng"
          queryClient={{
            refetch: orderList.refetch,
            isFetching: orderList.isFetching,
            isLoading: orderList.isLoading,
          }}
        />
      ) : (
        <EnhanceDataTableWithAllFeatures
          columns={returnExchangeColumns}
          initialData={returnExchangeData || []}
          queryKey={[ORDERS_KEY.RETURN_EXCHANGE]}
          queryClient={{
            refetch: returnExchange.refetch,
            isFetching: returnExchange.isFetching,
            isLoading: returnExchange.isLoading,
          }}
          title="Danh sách đơn hàng yêu cầu đổi trả"
          description="Danh sách đơn hàng yêu cầu đổi trả của khách hàng"
        />
      )}

      {/* 
      <EnhanceDataTableWithAllFeatures
        columns={returnExchangeColumns}
        initialData={returnExchangeData || []}
        queryKey={[ORDERS_KEY.RETURN_EXCHANGE]}
        queryClient={{
          refetch: returnExchange.refetch,
          isFetching: returnExchange.isFetching,
          isLoading: returnExchange.isLoading,
        }}
        title="Danh sách đơn hàng"
        description="Danh sách đơn hàng đã đặt của khách hàng"
      /> */}

      {/* <EnhanceDataTable
        columns={orderListColumns}
        initialData={orderList.data?.value?.items || []}
        queryKey={[ORDERS_KEY.ORDERS_LIST]}
        queryClient={{
          refetch: orderList.refetch,
          isFetching: orderList.isFetching,
          isLoading: orderList.isLoading,
        }}
      /> */}
    </div>
  );
};
