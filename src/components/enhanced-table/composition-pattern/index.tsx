import dynamic from "next/dynamic";

const Table = dynamic(
  () => import("@/components/ui/table").then((mod) => mod.Table),
  { ssr: false }
);
const TableBody = dynamic(() => import("./body").then((mod) => mod.TableBody), {
  ssr: false,
});
const TableHeader = dynamic(
  () => import("./header").then((mod) => mod.TableHeader),
  { ssr: false }
);
const TablePagination = dynamic(
  () => import("./pagination").then((mod) => mod.TablePagination),
  { ssr: false }
);
const TableRoot = dynamic(() => import("./root").then((mod) => mod.TableRoot), {
  ssr: false,
  loading: () => <DataTableSkeleton />,
});

import { TableFilters } from "./filters";
import { TableToolbar } from "./toolbar";
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton";

export const EnhancedTable = {
  Root: TableRoot,
  Toolbar: TableToolbar,
  Filters: TableFilters,
  Header: TableHeader,
  Body: TableBody,
  Pagination: TablePagination,
  Table: Table,
};

export default EnhancedTable;
