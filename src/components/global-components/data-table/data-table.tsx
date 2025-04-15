"use client";
import * as React from "react";
import {
  Cell,
  Column,
  ColumnDef,
  ColumnFiltersState,
  Header,
  HeaderContext,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useReactToPrint } from "react-to-print";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpDown,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Ellipsis,
  GripVertical,
  PinOff,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportTableToCSV } from "@/lib/export-excel";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { useQuery } from "@tanstack/react-query";
import { DataTableSkeleton } from "../custom-skeleton/data-table-skeleton";
import { filterRows } from "@/components/enhanced-table/composition-pattern/filters/utils";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];

  searchFiled: keyof T & string;

  isLoading?: boolean;
}

const getPinningStyles = <T,>(column: Column<T>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export function DataTable<T>({
  data,
  columns,
  searchFiled,
  isLoading,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);

  const id = React.useId();

  // console.log({ dateRange });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },

    filterFns: {
      filterRows: filterRows,
    },
  });

  const handleDateRangeApply = () => {
    const dateColumn = table.getColumn("date");
    if (dateColumn && dateRange.from && dateRange.to) {
      dateColumn.setFilterValue({
        start: dateRange.from,
        end: dateRange.to,
      });
    }
  };

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active && over && active.id !== over.id) {
        setColumnOrder((columnOrder) => {
          const oldIndex = columnOrder.indexOf(active.id as string);
          const newIndex = columnOrder.indexOf(over.id as string);

          return arrayMove(columnOrder, oldIndex, newIndex);
        });
      }
    },
    [setColumnOrder]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const reactToPrintFn = useReactToPrint({ contentRef, copyShadowRoots: true });

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center py-4 space-x-4 p-4">
        {/* Email Filter */}
        <Input
          placeholder={`Filter ${searchFiled}...`}
          value={
            (table.getColumn(searchFiled)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchFiled)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={setDateRange as any}
              numberOfMonths={2}
            />
            <div className="flex justify-end p-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDateRangeApply}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Columns Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            exportTableToCSV(table, {
              filename: "tasks",
              excludeColumns: ["select", "actions"],
            })
          }
          className="gap-2"
        >
          <Download className="size-4" aria-hidden="true" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => reactToPrintFn()}
          className="gap-2"
        >
          <Printer className="size-4" aria-hidden="true" />
          Print
        </Button>
      </div>

      <div className="min-w-full max-w-6xl">
        {/* <div className="bg-background w-full"> */}
        {!isLoading ? (
          <Table
            className="table-fixed border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none min-w-full flex-1"
            style={{
              width: table.getTotalSize(),
            }}
            ref={contentRef as any}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    const { column } = header;
                    const isPinned = column.getIsPinned();
                    const isLastLeftPinned =
                      isPinned === "left" && column.getIsLastColumn("left");
                    const isFirstRightPinned =
                      isPinned === "right" && column.getIsFirstColumn("right");

                    return (
                      <TableHead
                        key={header.id}
                        className="relative h-10 truncate border-t [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-muted/90 [&[data-pinned]]:backdrop-blur-sm"
                        colSpan={header.colSpan}
                        style={{ ...getPinningStyles(column) }}
                        data-pinned={isPinned || undefined}
                        data-last-col={
                          isLastLeftPinned
                            ? "left"
                            : isFirstRightPinned
                            ? "right"
                            : undefined
                        }
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </span>
                          {/* Pin/Unpin column controls with enhanced accessibility */}
                          {!header.isPlaceholder &&
                            header.column.getCanPin() &&
                            (header.column.getIsPinned() ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="-mr-1 size-7 shadow-none"
                                onClick={() => header.column.pin(false)}
                                aria-label={`Unpin ${
                                  header.column.columnDef.header as string
                                } column`}
                                title={`Unpin ${
                                  header.column.columnDef.header as string
                                } column`}
                              >
                                <PinOff
                                  className="opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              </Button>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="-mr-1 size-7 shadow-none"
                                    aria-label={`Pin options for ${
                                      header.column.columnDef.header as string
                                    } column`}
                                    title={`Pin options for ${
                                      header.column.columnDef.header as string
                                    } column`}
                                  >
                                    <Ellipsis
                                      className="opacity-60"
                                      size={16}
                                      strokeWidth={2}
                                      aria-hidden="true"
                                    />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => header.column.pin("left")}
                                  >
                                    <ArrowLeftToLine
                                      size={16}
                                      strokeWidth={2}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Stick to left
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => header.column.pin("right")}
                                  >
                                    <ArrowRightToLine
                                      size={16}
                                      strokeWidth={2}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Stick to right
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ))}
                          {header.column.getCanResize() && (
                            <div
                              {...{
                                onDoubleClick: () => header.column.resetSize(),
                                onMouseDown: header.getResizeHandler(),
                                onTouchStart: header.getResizeHandler(),
                                className:
                                  "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                              }}
                            />
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned =
                        isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned =
                        isPinned === "right" &&
                        column.getIsFirstColumn("right");

                      return (
                        <TableCell
                          key={cell.id}
                          className="truncate [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-background/90 [&[data-pinned]]:backdrop-blur-sm"
                          style={{ ...getPinningStyles(column) }}
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned
                              ? "left"
                              : isFirstRightPinned
                              ? "right"
                              : undefined
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Chưa có dữ liệu...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <DataTableSkeleton />
        )}
      </div>

      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="flex grow justify-end whitespace-nowrap text-sm text-muted-foreground">
          <span
            className="whitespace-nowrap text-sm text-muted-foreground"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </span>
        </div>
        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirst size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLast size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

interface SortButtonProps<T> {
  column: ColumnDef<T>;
  label: string;
}

const SortButton = <T,>({
  column,
  label,
}: Partial<HeaderContext<T, unknown>> & { label: string }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column?.toggleSorting(column?.getIsSorted() === "asc")}
      className="whitespace-nowrap"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

// const DraggableTableHeader = React.memo(
//   <T,>({
//     header,
//     isLastLeftPinned,
//     isFirstRightPinned,
//     column,
//     isPinned,
//   }: {
//     header: Header<unknown, unknown>;
//     isLastLeftPinned: boolean;
//     isFirstRightPinned: boolean;
//     column: Column<T, unknown>;
//     isPinned: boolean | string;
//   }) => {
//     const {
//       attributes,
//       isDragging,
//       listeners,
//       setNodeRef,
//       transform,
//       transition,
//     } = useSortable({
//       id: header.column.id,
//     });

//     const style: React.CSSProperties = {
//       opacity: isDragging ? 0.8 : 1,
//       position: "relative",
//       transform: CSS.Translate.toString(transform),
//       transition,
//       whiteSpace: "nowrap",
//       width: header.column.getSize(),
//       zIndex: isDragging ? 1 : 0,
//     };

//     const mergedStyle = { ...style, ...getPinningStyles(column) };

//     return (
//       <TableHead
//         key={header.id}
//         ref={setNodeRef}
//         className="relative h-10 truncate border-t [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-muted/90 [&[data-pinned]]:backdrop-blur-sm"
//         style={mergedStyle}
//         data-pinned={isPinned || undefined}
//         data-last-col={
//           isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
//         }
//         colSpan={header.colSpan}
//         aria-sort={
//           header.column.getIsSorted() === "asc"
//             ? "ascending"
//             : header.column.getIsSorted() === "desc"
//             ? "descending"
//             : "none"
//         }
//       >
//         <div className="flex items-center justify-start gap-0.5">
//           <Button
//             size="icon"
//             variant="ghost"
//             className="-ml-2 size-7 shadow-none"
//             {...attributes}
//             {...listeners}
//             aria-label="Drag to reorder"
//           >
//             <GripVertical
//               className="opacity-60"
//               size={16}
//               strokeWidth={16}
//               aria-hidden="true"
//             />
//           </Button>

//           <span className="grow truncate">
//             {header.isPlaceholder
//               ? null
//               : flexRender(header.column.columnDef.header, header.getContext())}
//           </span>

//           <Button
//             size="icon"
//             variant="ghost"
//             className="group -mr-1 size-7 shadow-none"
//             onClick={header.column.getToggleSortingHandler()}
//             onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
//               if (
//                 header.column.getCanSort() &&
//                 (e.key === "Enter" || e.key === " ")
//               ) {
//                 e.preventDefault();
//                 header.column.getToggleSortingHandler()?.(e);
//               }
//             }}
//           >
//             {{
//               asc: (
//                 <ChevronUp
//                   className="shrink-0 opacity-60"
//                   size={16}
//                   strokeWidth={2}
//                   aria-hidden="true"
//                 />
//               ),

//               desc: (
//                 <ChevronDown
//                   className="shrink-0 opacity-60"
//                   size={16}
//                   strokeWidth={2}
//                   aria-hidden="true"
//                 />
//               ),
//             }[header.column.getIsSorted() as string] ?? (
//               <ChevronUp
//                 className="shrink-0 opacity-0 group-hover:opacity-60"
//                 size={16}
//                 strokeWidth={2}
//                 aria-hidden="true"
//               />
//             )}
//           </Button>

//           {!header.isPlaceholder &&
//             header.column.getCanPin() &&
//             (header.column.getIsPinned() ? (
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="-mr-1 size-7 shadow-none"
//                 onClick={() => header.column.pin(false)}
//                 aria-label={`Unpin ${
//                   header.column.columnDef.header as string
//                 } column`}
//                 title={`Unpin ${
//                   header.column.columnDef.header as string
//                 } column`}
//               >
//                 <PinOff
//                   className="opacity-60"
//                   size={16}
//                   strokeWidth={2}
//                   aria-hidden="true"
//                 />
//               </Button>
//             ) : (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     className="-mr-1 size-7 shadow-none"
//                     aria-label={`Pin options for ${
//                       header.column.columnDef.header as string
//                     } column`}
//                     title={`Pin options for ${
//                       header.column.columnDef.header as string
//                     } column`}
//                   >
//                     <Ellipsis
//                       className="opacity-60"
//                       size={16}
//                       strokeWidth={2}
//                       aria-hidden="true"
//                     />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={() => header.column.pin("left")}>
//                     <ArrowLeftToLine
//                       size={16}
//                       strokeWidth={2}
//                       className="opacity-60"
//                       aria-hidden="true"
//                     />
//                     Stick to left
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => header.column.pin("right")}>
//                     <ArrowRightToLine
//                       size={16}
//                       strokeWidth={2}
//                       className="opacity-60"
//                       aria-hidden="true"
//                     />
//                     Stick to right
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ))}
//           {header.column.getCanResize() && (
//             <div
//               {...{
//                 onDoubleClick: () => header.column.resetSize(),
//                 onMouseDown: header.getResizeHandler(),
//                 onTouchStart: header.getResizeHandler(),
//                 className:
//                   "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
//               }}
//             />
//           )}
//         </div>
//       </TableHead>
//     );
//   }
// );

// const DragAlongCell = React.memo(
//   <T,>({
//     cell,
//     column,
//     isLastLeftPinned,
//     isFirstRightPinned,
//     isPinned,
//   }: {
//     cell: Cell<T, unknown>;
//     column: Column<T, unknown>;
//     isLastLeftPinned: boolean;
//     isFirstRightPinned: boolean;
//     isPinned: boolean | string;
//   }) => {
//     const { isDragging, setNodeRef, transform, transition } = useSortable({
//       id: cell.column.id,
//     });

//     const style: React.CSSProperties = {
//       opacity: isDragging ? 0.8 : 1,
//       position: "relative",
//       transform: CSS.Translate.toString(transform),
//       transition,
//       width: cell.column.getSize(),
//       zIndex: isDragging ? 1 : 0,
//     };

//     const mergedStyle = { ...style, ...getPinningStyles(column) };

//     return (
//       <TableCell
//         ref={setNodeRef}
//         key={cell.id}
//         className="truncate [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l [&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-background/90 [&[data-pinned]]:backdrop-blur-sm"
//         style={mergedStyle}
//         data-pinned={isPinned || undefined}
//         data-last-col={
//           isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
//         }
//       >
//         {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
//         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//       </TableCell>
//     );
//   }
// );
