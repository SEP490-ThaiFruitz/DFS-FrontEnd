import { ReportOrdersListClient } from "@/features/manager/report-orders/report-orders-clients";

const HeaderTitle = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <h1 className="text-xl font-semibold">Báo Cáo Doanh Thu</h1>
    </header>
  );
};

const OrderListPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <HeaderTitle />
      <ReportOrdersListClient />;
    </div>
  );
};

export default OrderListPage;
