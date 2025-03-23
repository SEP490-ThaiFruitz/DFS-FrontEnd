"use client";

import { DataTable } from "@/components/global-components/data-table/data-table";
import { orderListColumns } from "./order-list-column";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { ApiResponse, PageResult } from "@/types/types";
import { OrderData } from "@/types/report-orders.types";

export const ReportOrdersListClient = () => {
  const orderList = useFetch<ApiResponse<PageResult<OrderData>>>("/Orders", [
    ORDERS_KEY.ORDERS_LIST,
  ]);

  console.log(orderList.data);

  return (
    <DataTable
      columns={orderListColumns}
      data={orderList.data?.value?.items || []}
      isLoading={orderList.isLoading}
      searchFiled="id"
    />
  );
};
