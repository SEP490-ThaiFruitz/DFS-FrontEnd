"use client";

import { interactApiClient } from "@/actions/client/interact-api-client";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { Logo } from "@/components/global-components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/format-currency";
import { ApiResponse } from "@/types/types";
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import {
  ArrowRight,
  Barcode,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  ReceiptTextIcon,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import ImprovedLoadingPage from "../../loading";
import NotFound from "@/app/not-found";

interface DepositWalletResponse {
  balance: number;
  payment: {
    transactionNo: string;
    content: string;
    amount: number;
    paymentMethod: string;
    status: string;
    createdOnUtc: string;
    updateOnUtc: string;
  };
}

const WalletPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const searchParams = useSearchParams();
  const [data, setData] = useState<DepositWalletResponse | Record<string, any>>(
    {}
  );

  const [progress, setProgress] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const fetchDepositWallet = useCallback(async () => {
    const isVnPay = searchParams.has("vnp_TxnRef");
    // let apiUrl = "";

    setIsLoaded(true);

    try {
      if (isVnPay) {
        // VNPay API call
        const result = await interactApiClient.post<
          ApiResponse<DepositWalletResponse>,
          { test: string }
        >(`/Payments/vnpay-return?${searchParams.toString()}`);

        if (result?.isSuccess) {
          setData(result?.value as DepositWalletResponse);
        } else {
          toast.error("Lỗi khi lấy dữ liệu đơn hàng");
        }
      } else if (searchParams.has("orderCode")) {
        // PayOS API call
        const orderCode = searchParams.get("orderCode");
        const result = await interactApiClient.get<
          ApiResponse<DepositWalletResponse>
        >(`/Wallets/information-deposit/${orderCode}`);
        if (result?.isSuccess) {
          setData(result?.value as DepositWalletResponse);
        } else {
          toast.error("Lỗi khi lấy dữ liệu đơn hàng");
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi kết nối API");
    } finally {
      setIsLoaded(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDepositWallet();
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, [searchParams, fetchDepositWallet]);

  if (isLoaded) {
    return <ImprovedLoadingPage />;
  }

  if (!searchParams.has("vnp_TxnRef") && !searchParams.has("orderCode")) {
    return <NotFound />;
  }

  // console.log(data);
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4"
      ref={contentRef}
    >
      <div className="w-full max-w-xl space-y-8 ">
        <div className="flex flex-col items-center text-center">
          <Logo height={150} width={150} classNameLabel="text-6xl" />
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Thanh Toán Thành Công
          </h1>
          <p className="mt-2 text-slate-600">
            Giao dịch nạp tiền của bạn đã được xử lý thành công
          </p>
        </div>

        <Card className="overflow-hidden border-none shadow-lg cardStyle">
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-3xl"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-1">
              <ReceiptTextIcon className="size-6" />
              Chi Tiết Giao Dịch
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              Mã giao dịch:{" "}
              <div className="flex items-center gap-1">
                <span className="font-semibold text-lg text-slate-700 underline">
                  {data?.payment?.transactionNo}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-sm">
              <div className="mb-2 text-sm font-semibold text-slate-500">
                Số Tiền
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-slate-700" />
                <span className="text-3xl font-bold text-sky-500">
                  {formatVND(data?.payment?.amount)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-slate-600">
                    Phương Thức Thanh Toán
                  </span>
                </div>
                <AdvancedColorfulBadges color="green" className="font-semibold">
                  {data?.payment?.paymentMethod}
                </AdvancedColorfulBadges>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-slate-600">
                    Trạng Thái
                  </span>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                  {data?.payment?.status}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-slate-600">
                    Ngày Giao Dịch
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {vietnameseDate(data?.payment?.createdOnUtc, true)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(data?.payment?.createdOnUtc)}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-600">
                    Thời Gian Xử Lý
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {vietnameseDate(data?.payment?.updatedOnUtc, true)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(data?.payment?.updatedOnUtc)}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative py-4">
              <Separator className="absolute left-0 right-0" />
              <div className="absolute -left-6 -mt-2 h-4 w-4 rounded-full bg-white"></div>
              <div className="absolute -right-6 -mt-2 h-4 w-4 rounded-full bg-white"></div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <span className="text-sm font-semibold text-gray-600">
                Số Dư Hiện Tại
              </span>
              <span className="text-xl font-bold text-green-600">
                {formatVND(data?.balance + data?.payment?.amount)}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4 bg-gray-50 p-6">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => reactToPrintFn()}
            >
              <Download className="h-4 w-4" />
              In Biên Lai
            </Button>
            <Button className="bg-gradient-to-r from-sky-600 to-sky-400 gap-2">
              Đến Ví Của Tôi <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="rounded-lg bg-white p-4 text-center text-sm shadow-sm">
          <p className="text-slate-500">
            Cần hỗ trợ?{" "}
            <a
              href="#"
              className="font-semibold text-green-600 hover:text-green-500"
            >
              Liên hệ với chúng tôi
            </a>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Thời gian phản hồi: 24 giờ
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
