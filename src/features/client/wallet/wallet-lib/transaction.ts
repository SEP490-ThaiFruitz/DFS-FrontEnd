export enum TransactionTypeEnum {
  Buy = 0,
  Deposite = 1,
  Withdrawals = 2,
  Refund = 3,
}

export function getTransactionTypeLabel(type: TransactionTypeEnum): string {
  switch (type) {
    case TransactionTypeEnum.Buy:
      return "Mua";
    case TransactionTypeEnum.Deposite:
      return "Nạp tiền";
    case TransactionTypeEnum.Withdrawals:
      return "Rút tiền";
    case TransactionTypeEnum.Refund:
      return "Hoàn tiền";
    default:
      return "Unknown";
  }
}

export type TransactionType = "Buy" | "Deposite" | "Withdrawals" | "Refund";

export interface WalletTransactionTypes {
  id: string;
  transactionType: TransactionType;
  content: string;
  amount: number;
  balance: number;
  createdOnUtc: string;
}
