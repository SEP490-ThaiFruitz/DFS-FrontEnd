import { API } from "@/app/key/url";
import UserReportClient from "./user-report-client";
import { NotData } from "@/components/global-components/no-data";
import { ApiResponse } from "@/types/types";
import { CustomerType } from "./user -report-column";
import { getToken } from "@/actions/client/interact-api";

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
  // const token = await getToken();

  // const response = await fetch(`${API}/Statistics/report/customers`, {
  //   headers: {
  //     Authorization: `Bearer ${token?.accessToken}`,
  //   },
  // });

  // if (!response.ok) {
  //   return <NotData className="w-full h-full" />;
  // }

  // const userReportData: ApiResponse<CustomerType[]> = await response.json();

  // return <UserReportClient userReportDataSer={userReportData.value || []} />;
  return <UserReportClient />;
};

export default UserReportPage;
