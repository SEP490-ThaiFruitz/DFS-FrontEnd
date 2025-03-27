"use client";

import { DataTable } from "@/components/global-components/data-table/data-table";
import { orderListColumns } from "./order-list-column";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { ApiResponse, PageResult } from "@/types/types";
import { OrderData } from "@/types/report-orders.types";
import { EnhanceDataTable } from "@/components/global-components/data-table/enhance-data-table";
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { TotalCard } from "@/app/(manager)/manager/components/total-card";
import { Banknote, ListCheckIcon, ListOrderedIcon } from "lucide-react";
import { formatVND } from "@/lib/format-currency";
import { OrderAreaChart } from "./order-area-chart";

export const ReportOrdersListClient = () => {
  const orderList = useFetch<ApiResponse<PageResult<OrderData>>>("/Orders", [
    // ORDERS_KEY.ORDERS_LIST,
    "order_list",
  ]);

  if (orderList.isLoading) {
    return <DataTableSkeleton />;
  }

  console.log(orderList.data?.value?.items);

  const data = orderList.data?.value;

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

  console.log(chartData);

  return (
    // <DataTable
    //   columns={orderListColumns}
    //   data={orderList.data?.value?.items || []}
    //   isLoading={orderList.isLoading}
    //   searchFiled="id"
    // />

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

      <EnhanceDataTable
        columns={orderListColumns}
        initialData={orderList.data?.value?.items || []}
        queryKey={[ORDERS_KEY.ORDERS_LIST]}
        queryClient={{
          refetch: orderList.refetch,
          isFetching: orderList.isFetching,
          isLoading: orderList.isLoading,
        }}
      />
    </div>
  );
};
