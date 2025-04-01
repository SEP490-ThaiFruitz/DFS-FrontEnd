import { API } from "@/app/key/url";
import UserReportClient from "./user-report-client";
import { NotData } from "@/components/global-components/no-data";
import { ApiResponse } from "@/types/types";

export type ReportUserValue = {
  id: string;
  avatar: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  role: string;
  email: string;
  addresses: any[]; // Update with a more specific address type if needed
  phone: string;
  birthday: string; // Consider using `Date` if parsing is needed
  point: number;
  status: boolean;
  totalSpend: number;
  createdAt: string; // Consider using `Date` if parsing is needed
  updatedAt: string; // Consider using `Date` if parsing is needed
};

const UserReportPage = async () => {
  const response = await fetch(`${API}/Statistics/report/customers`);

  if (!response.ok) {
    return <NotData />;
  }

  const userReportData: ApiResponse<ReportUserValue[]> = await response.json();

  return <UserReportClient userReportData={userReportData.value || []} />;
};

export default UserReportPage;
