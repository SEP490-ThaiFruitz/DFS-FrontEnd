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

export const ReportOrdersListClient = () => {
  const orderList = useFetch<ApiResponse<PageResult<OrderData>>>("/Orders", [
    ORDERS_KEY.ORDERS_LIST,
  ]);

  if (orderList.isLoading) {
    return <DataTableSkeleton />;
  }

  return (
    // <DataTable
    //   columns={orderListColumns}
    //   data={orderList.data?.value?.items || []}
    //   isLoading={orderList.isLoading}
    //   searchFiled="id"
    // />

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
  );
};
