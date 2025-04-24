"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CustomerAppSidebar } from "./components/sidebar-customer";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/_sidebar-configuration/dynamic-breadcrumb";
import { JSX, useState } from "react";
import {
  ChartAreaIcon,
  FlameIcon,
  HomeIcon,
  LucideIcon,
  MapPin,
  MessageCircleIcon,
  PackageIcon,
  Ticket,
  User,
} from "lucide-react";
import InformationTab from "@/features/client/profile/information/information";
import { OrderTrackingPage } from "@/features/client/profile/order-tracking/order-tracking-page";
import AddressTab from "@/features/client/profile/address/address-tab";
import PointTab from "@/features/client/profile/point/point-tab";
import VoucherTab from "@/features/client/profile/voucher/voucher-tab";
import FeedbackTab from "@/features/client/profile/feedback/feedback-tab";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, Profile } from "@/types/types";
import { USER_KEY } from "@/app/key/user-key";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderImage } from "@/utils/label";
import Link from "next/link";
import { HistoryTransactionProfile } from "@/features/client/profile/history/history-transaction-profile";
import { WalletSheet } from "@/features/client/wallet/wallet-sheet";
import { API } from "@/actions/client/api-config";
import Cookies from "js-cookie";
// name: string;
//     tag: string;
//     icon: LucideIcon;

export type TabContentTypes = {
  icon: LucideIcon;
  value: string;
  component: JSX.Element;
  title: string;
  description: string;
};

//  const TAB_CONTENT: {
//   icon?: LucideIcon;
//   value: string;
//   component: JSX.Element;
//   title: string;
//   description: string;
// }[] = [
//   {
//     value: "profile",
//     component: <InformationTab />,
//     title: "Thông tin cá nhân của bạn",
//     description:
//       "Hãy điền thông tin cá nhân của bạn để chúng tôi có thể phục vụ bạn tốt hơn.",
//   },
//   {
//     value: "order-tracking",
//     component: <OrderTrackingPage />,
//     title: "Đơn hàng của bạn",
//     description: "Theo dõi đơn đặt hàng và quản lý mua sắm hiệu quả hơn!",
//   },
//   {
//     value: "address",
//     component: <AddressTab />,
//     title: "Địa chỉ giao hàng của bạn",
//     description:
//       " Cung cấp thông tin địa chị giao hàng thuận tiện cho việc mua hàng sau này!",
//   },
//   {
//     value: "point",
//     component: <PointTab />,
//     title: "Lịch sử tích lũy điểm",
//     description: "Theo dõi số điểm đã tích lũy và đổi thưởng một cách dễ dàng!",
//   },
//   {
//     value: "voucher",
//     component: <VoucherTab />,
//     title: " Mã giảm giá của bạn",
//     description: "Xem và sử dụng mã giảm giá để tiết kiệm khi mua hàng!.",
//   },
//   {
//     value: "statistic",
//     component: <div>Statistic</div>,
//     title: "Báo cáo chi tiêu",
//     description:
//       "Theo dõi tổng số tiền bạn đã chi tiêu để quản lý tài chính hiệu quả hơn.",
//   },
//   {
//     value: "feedback",
//     component: <FeedbackTab />,
//     title: "Phản hồi & Đánh giá",
//     description:
//       "Xem và quản lý phản hồi của bạn để cải thiện trải nghiệm sử dụng.",
//   },
// ];

export const TAB_CONTENT: TabContentTypes[] = [
  {
    icon: User,
    value: "profile",
    component: <InformationTab />,
    title: "Thông tin cá nhân của bạn",
    description:
      "Hãy điền thông tin cá nhân của bạn để chúng tôi có thể phục vụ bạn tốt hơn.",
  },
  {
    icon: PackageIcon,
    value: "order-tracking",
    component: <OrderTrackingPage />,

    title: "Đơn hàng của bạn",
    description: "Theo dõi đơn đặt hàng và quản lý mua sắm hiệu quả hơn!",
  },
  {
    icon: MapPin,
    value: "address",
    component: <AddressTab />,
    title: "Địa chỉ giao hàng của bạn",
    description:
      "Cung cấp thông tin địa chỉ giao hàng thuận tiện cho việc mua hàng sau này!",
  },
  {
    icon: HomeIcon,
    value: "point",
    component: <PointTab />,
    title: "Lịch sử tích lũy điểm",
    description: "Theo dõi số điểm đã tích lũy và đổi thưởng một cách dễ dàng!",
  },
  {
    icon: Ticket,
    value: "voucher",
    component: <VoucherTab />,
    title: "Mã giảm giá của bạn",
    description: "Xem và sử dụng mã giảm giá để tiết kiệm khi mua hàng!",
  },
  {
    icon: ChartAreaIcon,
    value: "statistic",
    component: <HistoryTransactionProfile />,
    title: "Báo cáo chi tiêu",
    description:
      "Theo dõi tổng số tiền bạn đã chi tiêu để quản lý tài chính hiệu quả hơn.",
  },
  {
    icon: MessageCircleIcon,
    value: "feedback",
    component: (
      <div className="motion-preset-slide-right motion-duration-100 ">
        <FeedbackTab />
      </div>
    ),
    title: "Phản hồi & Đánh giá",
    description:
      "Xem và quản lý phản hồi của bạn để cải thiện trải nghiệm sử dụng.",
  },
];

export const SidebarContainer = () => {
  const [tab, setTab] = useState<string>(TAB_CONTENT[0].value);
  const cookieToken = Cookies.get("accessToken");
  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess,
    status,
  } = useQuery<ApiResponse<Profile>>({
    // queryKey: ["authUser"],
    queryKey: [USER_KEY.PROFILE],
    queryFn: async () => {
      try {
        const response = await API.get("/Users/profile");

        if (response) {
          return response;
        }
        return undefined;
      } catch (error) {
        console.log(error)
      }
    },
    enabled: cookieToken !== undefined
  });

  return (
    <div className="">
      <SidebarProvider
        defaultOpen={false}
        className=" has-[[data-variant=inset]]:bg-gradient-to-b from-amber-50 to-amber-50/60 rounded-3xl"
      >
        {/* <AppSidebar /> */}
        <CustomerAppSidebar
          tab={tab}
          setTab={setTab}
          tabProjects={TAB_CONTENT}
        />

        <div className="flex flex-col w-full h-full overflow-hidden rounded-3xl gap-x-4 pt-3 p-2">
          <div className="w-full h-16 mb-2 bg-white rounded-3xl shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 ">
              <div className="flex items-center gap-1">
                <Avatar className="h-12 w-12 ">
                  <AvatarImage
                    src={user?.value?.avatar ?? placeholderImage}
                    alt={user?.value?.name ?? "Tên"}
                  />
                  <AvatarFallback>
                    {user?.value?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="font-semibold text-xl text-slate-900 ">
                  Xin chào,{" "}
                  <span className="text-xl text-sky-500">
                    {user?.value?.name}
                  </span>{" "}
                  !
                </div>
              </div>

              <div className="flex items-center gap-2 w-fit">
                <Link
                  href="/"
                  className="relative inline-flex text-sm h-11 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer w-fit font-semibold px-1"
                >
                  Trang chủ
                </Link>

                <WalletSheet isUserLoading={isUserLoading} user={user} />
              </div>

              <p className="text-sm text-slate-500">
                {TAB_CONTENT.find((item) => item.value === tab)?.description}
              </p>
            </div>
          </div>
          <SidebarInset className="p-4 overflow-hidden peer-data-[variant=inset]:rounded-3xl peer-data-[variant=inset]:border peer-data-[variant=inset]:border-[oklch(0.929 0.013 255.508)] peer-data-[variant=inset]:shadow-lg  rounded-3xl">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
              <div className="flex flex-col items-start gap-2 px-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {TAB_CONTENT.find((item) => item.value === tab)?.title}
                </h2>
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <DynamicBreadcrumb />
                </div>
              </div>
            </header>

            <div className=" pt-10 motion-preset-slide-right ">
              {/* <div> */}
              {TAB_CONTENT.find((item) => item.value === tab)?.component}
              {/* </div> */}
              {/* component its here */}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};
