import { Badge } from "@/components/ui/badge";
import { memo } from "react";
import { getTransactionBadgeColor } from "../history-transaction-wallet";
import { vietnameseDate } from "@/utils/date";
import { formatVND } from "@/lib/format-currency";
import { transactionTypeText } from "../../wallet-lib/transaction";

interface SelectedTransaction {
  id: string;
  transactionType: string;
  content: string;
  amount: number;
  balance: number;
  createdOnUtc: string;
}
interface TransactionDetailProps {
  selectedTransaction: SelectedTransaction | null;
}
export const TransactionDetail = memo(
  ({ selectedTransaction }: TransactionDetailProps) => {
    // console.log("content: ", selectedTransaction?.content);

    return (
      selectedTransaction && (
        <div className="mt-6 cardStyle p-6 bg-muted/20">
          <h3 className="text-lg font-semibold mb-4">Chi tiết giao dịch</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-700 font-semibold text-sm">
                  Mã giao dịch
                </span>
                <span className="font-medium">
                  {selectedTransaction.id.substring(0, 12)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-700 font-semibold text-sm">
                  Loại giao dịch
                </span>
                <Badge
                  variant="outline"
                  className={`${getTransactionBadgeColor(
                    selectedTransaction.transactionType
                  )}`}
                >
                  {transactionTypeText(selectedTransaction.transactionType)}
                  {/* {selectedTransaction.transactionType === "Buy"
                    ? "Mua"
                    : selectedTransaction.transactionType === "Deposite"
                    ? "Nạp tiền"
                    : selectedTransaction.transactionType === "Withdrawals"
                    ? "Rút tiền"
                    : "Hoàn tiền"} */}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-700 font-semibold text-sm">
                  Thời gian
                </span>
                <span className="font-medium underline text-sky-500">
                  {vietnameseDate(selectedTransaction.createdOnUtc, true)}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-700 font-semibold text-sm">
                  Nội dung
                </span>
                <span className="text-right font-semibold text-violet-500">
                  {selectedTransaction.content}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-700 font-semibold text-sm">
                  Số tiền
                </span>
                <span
                  className={`font-bold ${
                    selectedTransaction.amount > 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {/* {selectedTransaction.amount > 0 ? "" : ""} */}
                  {formatVND(selectedTransaction.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-slate-700 font-semibold text-sm">
                  Số dư sau giao dịch
                </span>
                <span className="font-semibold text-sky-500 text-base">
                  {formatVND(selectedTransaction.balance)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
);

TransactionDetail.displayName = "TransactionDetail";
