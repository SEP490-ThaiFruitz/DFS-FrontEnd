import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { OrdersOverview } from "./components/history-order-overview";
import { OrderStatusDistribution } from "./components/order-status-distribution";
import { TopProducts } from "./components/product-bought";
import { ProductPopularity } from "./components/product-popularity";
import { RecentOrders } from "./components/recent-orders";
import { SpendingTrends } from "./components/spending-trend";
import { USER_KEY } from "@/app/key/user-key";
import AnimatedLoadingSkeleton from "@/components/global-components/custom-skeleton/animated-loading-skeleton";
import { ApiResponse } from "@/types/types";
import { HistoryApiResponse, HistoryTransaction } from "./types/history.type";
import { omit } from "lodash";
import { NotData } from "@/components/global-components/no-data";
import {
  SearchX,
  PackageX,
  FileQuestion,
  Inbox,
  FolderOpen,
} from "lucide-react";

export const HistoryTransactionProfile = () => {
  const historyTransactionProfile = useFetch<HistoryApiResponse>(
    "/Statistics/user/statistic-money-spend",
    [USER_KEY.HISTORY_TRANSACTION]
  );

  if (historyTransactionProfile.isLoading) {
    return (
      <AnimatedLoadingSkeleton className="py-6 motion-preset-slide-right motion-duration-500 w-full h-full" />
    );
  }

  // if (!historyTransactionProfile?.data) {
  //   return (
  //     <NotData
  //       title="Không có dữ liệu"
  //       description="Bạn chưa có đơn hàng nào."
  //       className="py-6 motion-preset-slide-right motion-duration-500 w-full h-full"
  //       action={{
  //         label: "Mua ngay",
  //         onClick() {
  //           window.location.href = "/";
  //         },
  //       }}
  //     />
  //   );
  // }

  if (
    !historyTransactionProfile?.data ||
    !historyTransactionProfile.data.isSuccess ||
    historyTransactionProfile.data.value.orders.length === 0
  ) {
    return (
      <NotData
        title="Không có dữ liệu"
        description="Bạn chưa có đơn hàng nào."
        className="py-6 motion-preset-slide-right motion-duration-500 min-w-full min-h-full"
        icons={[SearchX, PackageX, FileQuestion, Inbox, FolderOpen]}
        action={{
          label: "Mua ngay",
          onClick() {
            window.location.href = "/";
          },
        }}
      />
    );
  }

  console.log("data test: ", historyTransactionProfile.data);

  // const safeData = omit(historyTransactionProfile.data, "error", "isSuccess");

  return (
    <main className=" py-6 motion-preset-slide-right motion-duration-500 w-full">
      <div className="mx-auto w-full">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <OrdersOverview
            orderData={
              (historyTransactionProfile?.data as HistoryApiResponse) ?? []
            }
          />
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <SpendingTrends
              orderData={
                (historyTransactionProfile?.data as HistoryApiResponse) ?? []
              }
            />
          </div>
          <div>
            <OrderStatusDistribution
              orderData={
                (historyTransactionProfile?.data as HistoryApiResponse) ?? []
              }
            />
          </div>
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <ProductPopularity
            orderData={
              (historyTransactionProfile?.data as HistoryApiResponse) ?? []
            }
          />
          <TopProducts />
        </div>
        <div className="mt-6">
          <RecentOrders
            orderData={
              (historyTransactionProfile?.data as HistoryApiResponse) ?? []
            }
          />
        </div>
      </div>
    </main>
  );
};
