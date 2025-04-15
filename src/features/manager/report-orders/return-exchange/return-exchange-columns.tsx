"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { vietnameseDate } from "@/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils/label";
import { LinkPreview } from "@/components/global-components/link-preview";
import { OrderReturnExchangeDetail } from "./components/order-return-exchange-detail";
import {
  getStatusReturnExchangeStep,
  returnExchangeLabel,
  ReturnExchangeRequestStatus,
  statusColorMap,
} from "./return-exchange-status/status";
import {
  returnExchangeStatusIcon,
  UpdateReturnExchangeStatus,
} from "./return-exchange-status/update-status";
import { ReturnExchangeStatusBar } from "./return-exchange-status/return-exchange-status-bar";
import { cn } from "@/lib/utils";

export type ReturnExchangeOrders = {
  id: string;
  orderId: string;
  handler: string | null;
  user: {
    name: string;
    role: string;
    email: string;
    phone: string | null;
    avatar: string;
  } | null;
  requestType: string;
  requestStatus: string;
  reason: string;
  reasonReject: string | null;
  reasonCancel: string | null;
  linkDocument: string;
  requestDate: string;
  processedDate: string | null;
};

export const returnExchangeColumns: ColumnDef<ReturnExchangeOrders>[] = [
  {
    id: "Mã đơn hàng",
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      const orderId = row.original.orderId;

      return <div className="font-medium">{orderId}</div>;
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Mã đơn hàng" } },
    },
  },
  {
    id: "Khách hàng",
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.original.user;

      if (!user) return <div>—</div>;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sky-500 text-base">
              {user.name}
            </span>
            <span className="text-xs text-slate-700">{user.email}</span>
          </div>
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Khách hàng" } },
    },
  },

  {
    id: "Loại yêu cầu",
    accessorKey: "requestStatus",
    header: "Status",
    cell: ({ row }) => {
      const rowData = row.original;

      if (rowData.requestStatus === "rejected") {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-sm font-semibold">
              {rowData.reasonReject}
            </Badge>
          </div>
        );
      } else if (rowData.requestStatus === "cancelled") {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-sm font-semibold">
              {rowData.reasonCancel}
            </Badge>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                statusColorMap[
                  getStatusReturnExchangeStep(
                    rowData?.requestStatus?.toLowerCase()
                  ) as ReturnExchangeRequestStatus
                ]
              )}
            >
              <div className="flex items-center gap-1 font-semibold text-base">
                {returnExchangeStatusIcon(
                  rowData?.requestStatus?.toLowerCase()
                )}

                <span className="text-base">
                  {returnExchangeLabel(
                    rowData?.requestStatus?.toLowerCase() as string
                  )}
                </span>
              </div>
              {rowData?.requestStatus?.toLowerCase() !== "completed" && (
                <UpdateReturnExchangeStatus
                  status={rowData?.requestStatus as string}
                  requestId={rowData.id}
                />
              )}
            </div>
          </div>

          <ReturnExchangeStatusBar status={rowData?.requestStatus as string} />
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Loại yêu cầu" } },
    },
  },

  {
    id: "Lý do",
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => {
      const reason = row.original.reason as string;

      return (
        <div className="max-w-[200px] truncate" title={reason}>
          {reason}
        </div>
      );
    },
    meta: {
      align: "center",
      export: { pdf: { header: "Lý do" } },
    },
  },

  {
    id: "Tài liệu chứng minh",
    accessorKey: "linkDocument",
    header: "Reason",
    cell: ({ row }) => {
      const linkDocument = row.original.linkDocument as string;

      return linkDocument ? (
        <LinkPreview
          url={linkDocument}
          target="_blank"
          className="text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 text-sm font-medium group"
        >
          <ExternalLink className="size-5" />
          Xem tài liệu
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </LinkPreview>
      ) : null;
    },
    meta: {
      align: "center",
      export: { pdf: { header: "Tài liệu chứng minh" } },
    },
  },
  {
    id: "Ngày yêu cầu",
    accessorKey: "requestDate",
    header: "Request Date",
    cell: ({ row }) => {
      const requestDate = row.original.requestDate as string;

      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {vietnameseDate(requestDate, true)}
        </div>
      );
    },
    meta: {
      align: "center",
      export: { pdf: { header: "Ngày yêu cầu" } },
    },
  },
  {
    id: "Ngày xử lý",
    accessorKey: "processedDate",
    header: "Processed Date",
    cell: ({ row }) => {
      const processedDate = row.original.processedDate as string | null;

      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {processedDate ? (
            vietnameseDate(processedDate, true)
          ) : (
            <span className="text-muted-foreground">Chưa được xử lý</span>
          )}
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Ngày xử lý" } },
    },
  },
  {
    id: "Người xử lý",
    accessorKey: "handler",
    header: "Handler",
    cell: ({ row }) => {
      const handler = row.original.handler as string | null;

      return (
        <div className="flex items-center gap-2">
          {handler ? (
            <span>----</span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="h-4 w-4" />
              Chưa được xử lý
            </span>
          )}
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Người xử lý" } },
    },
  },
  {
    id: "Hành động",
    cell: ({ row }) => {
      const request = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Button
              className="w-full"
              variant="link"
              onClick={() => navigator.clipboard.writeText(request.id)}
            >
              Copy ID Đơn hàng
            </Button>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={request.linkDocument}
                target="_blank"
                className="flex items-center w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem document
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>View details</DropdownMenuItem> */}

            <OrderReturnExchangeDetail requestId={request.id} />
            {request.requestStatus === "Pending" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Assign to me</DropdownMenuItem>
                <DropdownMenuItem>Approve request</DropdownMenuItem>
                <DropdownMenuItem>Reject request</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },

    meta: { align: "center", export: false },
    filterFn: "filterRows",
  },
];
