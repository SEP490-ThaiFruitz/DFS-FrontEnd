"use client";

import { EnhancedTable } from "@/components/enhanced-table/composition-pattern";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { DataTableSkeleton } from "../custom-skeleton/data-table-skeleton";
import { useQueryClient } from "@tanstack/react-query";

interface EnhanceDataTableProps<TData, TValue> {
  initialData: TData[];

  columns: ColumnDef<TData, TValue>[];

  queryKey?: string[];

  queryClient: {
    refetch: () => void;
    isFetching: boolean;
    isLoading: boolean;
  };

  enableExpansion?: boolean;
  enableSelection?: boolean;
  enableEditing?: boolean;
}

export function EnhanceDataTable<TData, TValue>({
  initialData,
  columns,

  queryKey,

  queryClient,

  enableSelection = true,

  enableExpansion = true,
  enableEditing = false,
}: EnhanceDataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(initialData);
  const [dataCount, setDataCount] = useState<number>(1000);
  const [headerVariant, setHeaderVariant] = useState<"default" | "dropdown">(
    "default"
  );
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // async function fetchData() {
  //   setIsLoading(true);
  //   const newData = await fetch(
  //     `http://localhost:3000/api/fake-data?count=${dataCount}`,
  //     {
  //       cache: "no-cache",
  //     }
  //   ).then((res) => res.json());
  //   setData(newData);
  //   setIsLoading(false);
  // }

  return (
    <div className=" py-10 px-4 space-y-8">
      <div className="flex items-center justify-end space-x-2">
        <Input
          type="number"
          value={dataCount}
          onChange={(e) => setDataCount(Number(e.target.value))}
          className="w-32"
        />

        <Button
          onClick={() => {
            queryClient.refetch();

            // fetchData()
          }}
          disabled={queryClient.isFetching}
        >
          {queryClient.isFetching ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      {!queryClient.isLoading || !queryClient.isFetching ? (
        <Tabs defaultValue="full-featured">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="full-featured">Tất cả tính năng</TabsTrigger>
            <TabsTrigger value="sortable">Sắp xếp cột</TabsTrigger>
            <TabsTrigger value="reorderable">Thay dổi vị trí dòng</TabsTrigger>
          </TabsList>
          <TabsContent value="full-featured">
            <Card className="cardStyle">
              <CardHeader>
                <CardTitle>Tất cả tính năng</CardTitle>
                <CardDescription>
                  Bảng tính năng này cho phép bạn thực hiện các thao tác như sắp
                  xếp cột, sắp xếp dòng, lọc dữ liệu, chỉnh sửa dữ liệu, xuất dữ
                  liệu, và nhiều tính năng khác.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedTable.Root
                  data={initialData}
                  columns={columns}
                  enableExpansion={enableExpansion}
                  enableSelection={enableSelection}
                  enableEditing={enableEditing}
                  enableColumnReorder
                >
                  <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-4">
                    <div className="flex flex-wrap gap-2">
                      <EnhancedTable.Toolbar.ViewOptions />
                      <EnhancedTable.Toolbar.ExpandCollapse />
                      <Select
                        value={headerVariant}
                        onValueChange={(value: "default" | "dropdown") =>
                          setHeaderVariant(value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select header style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">
                            Default Header
                          </SelectItem>
                          <SelectItem value="dropdown">
                            Dropdown Header
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <EnhancedTable.Toolbar.ExportTable />
                      <EnhancedTable.Filters.Dialog />
                      <EnhancedTable.Filters.Sheet />
                      <EnhancedTable.Filters.Clear />
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <EnhancedTable.Table>
                      <EnhancedTable.Header variant={headerVariant} />
                      <EnhancedTable.Body customRowStyles={customRowStyles} />
                    </EnhancedTable.Table>
                  </div>
                  <EnhancedTable.Pagination />
                </EnhancedTable.Root>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sortable">
            <Card className="cardStyle">
              <CardHeader>
                <CardTitle>Sắp xếp cột</CardTitle>
                <CardDescription>
                  Bảng tính năng này cho phép bạn sắp xếp lại vị trí của các
                  cột.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedTable.Root
                  data={initialData}
                  columns={columns}
                  enableColumnReorder
                >
                  <div className="flex justify-between items-center mb-4">
                    <EnhancedTable.Toolbar.ExportTable />
                  </div>
                  <div className="rounded-md border">
                    <EnhancedTable.Table>
                      <EnhancedTable.Header />
                      <EnhancedTable.Body customRowStyles={customRowStyles} />
                    </EnhancedTable.Table>
                  </div>
                  <EnhancedTable.Pagination />
                </EnhancedTable.Root>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reorderable">
            <Card className="cardStyle">
              <CardHeader>
                <CardTitle>Sắp xếp dòng</CardTitle>
                <CardDescription>
                  Bảng tính năng này cho phép bạn sắp xếp lại vị trí của các
                  dòng.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedTable.Root
                  data={initialData}
                  columns={columns}
                  enableRowReorder
                  rowReorderKey="lastName"
                >
                  <div className="flex justify-between items-center mb-4">
                    <EnhancedTable.Toolbar.ExportTable />
                  </div>
                  <div className="rounded-md border">
                    <EnhancedTable.Table>
                      <EnhancedTable.Header />
                      <EnhancedTable.Body customRowStyles={customRowStyles} />
                    </EnhancedTable.Table>
                  </div>
                  <EnhancedTable.Pagination />
                </EnhancedTable.Root>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <DataTableSkeleton />
      )}
    </div>
  );
}

export const customRowStyles = <TData,>(row: Row<TData>) => {
  const baseStyles = "transition-colors hover:bg-opacity-20";
  const statusStyles = {
    active: "hover:bg-green-100 dark:hover:bg-green-900/50",
    inactive: "hover:bg-red-100 dark:hover:bg-red-900/50",
    pending: "hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
  };

  // return `${baseStyles} ${statusStyles[row.original.status]}`;

  return "";
};
