"use client";

import { Button } from "@/components/ui/button";
import { TotalCard } from "../components/total-card";
import {
  CalendarIcon,
  LucideIcon,
  MapPinIcon,
  User,
  UserCheckIcon,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { UserStatisticChart } from "../components/user-statistic-chart";
import { UsersOrdersTotalChart } from "../components/users-orders-total-chart";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/global-components/data-table/data-table";
import Image from "next/image";
import { memo } from "react";
import { ReportUserValue } from "./page";

interface UserReportClientProps {
  userReportData: ReportUserValue[] | [];
}

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  role: string;
  status: string;
  lastLogin: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  profilePicture: string;
  department: string;
  manager: string;
};

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    dateOfBirth: "1990-05-15",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-10-14T14:23:45Z",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    createdAt: "2020-08-20",
    updatedAt: "2023-10-10",
    profilePicture: "https://example.com/profiles/johndoe.jpg",
    department: "IT",
    manager: "Jane Smith",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+0987654321",
    dateOfBirth: "1985-07-25",
    role: "Editor",
    status: "Inactive",
    lastLogin: "2023-09-20T09:15:30Z",
    address: {
      street: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    createdAt: "2019-05-10",
    updatedAt: "2023-09-20",
    profilePicture: "https://example.com/profiles/janesmith.jpg",
    department: "Marketing",
    manager: "John Doe",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+0987654321",
    dateOfBirth: "1985-07-25",
    role: "Editor",
    status: "Inactive",
    lastLogin: "2023-09-20T09:15:30Z",
    address: {
      street: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    createdAt: "2019-05-10",
    updatedAt: "2023-09-20",
    profilePicture: "https://example.com/profiles/janesmith.jpg",
    department: "Marketing",
    manager: "John Doe",
  },
  {
    id: 4,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+0987654321",
    dateOfBirth: "1985-07-25",
    role: "Editor",
    status: "Inactive",
    lastLogin: "2023-09-20T09:15:30Z",
    address: {
      street: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    createdAt: "2019-05-10",
    updatedAt: "2023-09-20",
    profilePicture: "https://example.com/profiles/janesmith.jpg",
    department: "Marketing",
    manager: "John Doe",
  },
  {
    id: 5,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+0987654321",
    dateOfBirth: "1985-07-25",
    role: "Editor",
    status: "Inactive",
    lastLogin: "2023-09-20T09:15:30Z",
    address: {
      street: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    createdAt: "2019-05-10",
    updatedAt: "2023-09-20",
    profilePicture: "https://example.com/profiles/janesmith.jpg",
    department: "Marketing",
    manager: "John Doe",
  },
  // Add more users as needed
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.original.profilePicture}
          alt={`${row.original.name}'s profile`}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <a
        href={`mailto:${row.original.email}`}
        className="text-blue-500 hover:underline"
      >
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <span>{row.original.phone}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Call or text this number</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => (
      <span>{new Date(row.original.dateOfBirth).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "text-xs font-semibold",
          row.original.role === "Admin" && "bg-red-500 text-white",
          row.original.role === "Editor" && "bg-blue-500 text-white",
          row.original.role === "User" && "bg-green-500 text-white"
        )}
      >
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "text-xs font-semibold",
          row.original.status === "Active" && "bg-green-500 text-white",
          row.original.status === "Inactive" && "bg-gray-500 text-white"
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <span>{new Date(row.original.lastLogin).toLocaleString()}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last login timestamp</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <MapPinIcon className="inline-block mr-1" size={16} />
          <span>{`${row.original.address.street}, ${row.original.address.city}`}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {`${row.original.address.street}, ${row.original.address.city}, ${row.original.address.state}, ${row.original.address.zipCode}, ${row.original.address.country}`}
          </p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span>
        <CalendarIcon className="inline-block mr-1" size={16} />
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <span>
        <CalendarIcon className="inline-block mr-1" size={16} />
        {new Date(row.original.updatedAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "profilePicture",
    header: "Profile Picture",
    cell: ({ row }) => (
      <img
        src={row.original.profilePicture}
        alt="Profile"
        className="w-10 h-10 rounded-full border border-gray-300"
      />
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs font-semibold">
        {row.original.department}
      </Badge>
    ),
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <UserCheckIcon className="inline-block" size={16} />
        <span>{row.original.manager}</span>
      </div>
    ),
  },
];

const HeaderTitle = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <h1 className="text-xl font-semibold">Báo Cáo người dùng</h1>
      <div className="ml-auto flex items-center gap-4">
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Hôm nay</SelectItem>
            <SelectItem value="week">Tuần này</SelectItem>
            <SelectItem value="month">Tháng này</SelectItem>
            <SelectItem value="quarter">Quý này</SelectItem>
            <SelectItem value="year">Năm này</SelectItem>
          </SelectContent>
        </Select> */}
        <Button>Xuất báo cáo</Button>
      </div>
    </header>
  );
};

const UserReportClient = ({ userReportData }: UserReportClientProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <HeaderTitle />

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <TotalCard
            title="Tổng số người dùng"
            value={100}
            icon={User}
            subtitle="Tăng 1%"
            classNameIcon="bg-red text"
          />
          <TotalCard
            title="Người dùng mới đây "
            value={12}
            icon={User}
            subtitle="Tăng 5%"
          />
          <TotalCard
            title="Người dùng "
            value={100}
            icon={User}
            subtitle="Tăng 1%"
          />
          <TotalCard
            title="Tổng số người dùng"
            value={100}
            icon={User}
            subtitle="Tăng 1%"
          />
        </div>

        <div className=" w-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={37} minSize={30}>
              <UserStatisticChart />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={63} minSize={50}>
              <UsersOrdersTotalChart />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="w-full">
          <DataTable data={users} columns={columns} searchFiled="name" />
        </div>
      </main>
    </div>
  );
};

export default memo(UserReportClient);
