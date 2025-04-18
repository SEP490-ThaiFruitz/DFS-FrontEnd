"use client";
import * as React from "react";
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
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
    Download,
    Ellipsis,
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
import { DataTableSkeleton } from "../custom-skeleton/data-table-skeleton";
import { filterRows } from "@/components/enhanced-table/composition-pattern/filters/utils";

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];

    searchFiled: keyof T & string;

    isLoading?: boolean;
    placeholder?: string
    children?: React.ReactNode
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

export function DataTableCustom<T>({
    data,
    columns,
    searchFiled,
    isLoading,
    placeholder,
    children
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

    console.log({ dateRange });

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

    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const reactToPrintFn = useReactToPrint({ contentRef, copyShadowRoots: true });

    return (
        <div className="w-full overflow-x-auto py-2">
            <div className="grid md:grid-cols-3">
                <div className="flex items-center py-4 space-x-4 p-4 col-span-2">
                    <Input
                        placeholder={`Tìm kiếm theo ${placeholder}...`}
                        value={
                            (table.getColumn(searchFiled)?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table.getColumn(searchFiled)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    {/* Columns Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Cột <ChevronDown />
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
                                            {column.columnDef?.header?.toString()}
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
                        Xuất file
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reactToPrintFn()}
                        className="gap-2"
                    >
                        <Printer className="size-4" aria-hidden="true" />
                        In
                    </Button>
                </div>
                {children}
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
                                                                aria-label={`Unpin ${header.column.columnDef.header as string
                                                                    } column`}
                                                                title={`Unpin ${header.column.columnDef.header as string
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
                                                                        aria-label={`Pin options for ${header.column.columnDef.header as string
                                                                            } column`}
                                                                        title={`Pin options for ${header.column.columnDef.header as string
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
            <div className="pt-2 border-t">
                <div className="flex items-center justify-between gap-8 mx-4">
                    {/* Results per page */}
                    <div className="flex items-center gap-3">
                        <Label htmlFor={id} className="max-sm:sr-only">
                            Số hàng
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
                            của{" "}
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

