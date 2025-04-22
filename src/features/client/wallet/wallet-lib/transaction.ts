export enum TransactionTypeEnum {
  Buy = 0,
  Deposite = 1,
  Withdrawals = 2,
  Refund = 3,
}

// export function getTransactionTypeLabel(type: TransactionTypeEnum): string {
//   switch (type) {
//     case TransactionTypeEnum.Buy:
//       return "Mua";
//     case TransactionTypeEnum.Deposite:
//       return "Nạp tiền";
//     case TransactionTypeEnum.Withdrawals:
//       return "Rút tiền";
//     case TransactionTypeEnum.Refund:
//       return "Hoàn tiền";
//     default:
//       return "Unknown";
//   }
// }

export const formatAccountNumber = (value: string) => {
  return value
    .replace(/\s/g, "")
    .replace(/(\d{4})/g, "$1 ")
    .trim();
};

export const transactionTypeText = (type: string) => {
  switch (type.toLowerCase()) {
    case "buy":
      return "Mua";
    case "deposite":
      return "Nạp tiền";
    case "withdrawals":
      return "Rút tiền";
    case "refund":
      return "Hoàn tiền";
    default:
      return "Không xác định";
  }
};

export type TransactionType = "Buy" | "Deposite" | "Withdrawals" | "Refund";

export interface WalletTransactionTypes {
  id: string;
  transactionType: TransactionType;
  content: string;
  amount: number;
  balance: number;
  createdOnUtc: string;
}
