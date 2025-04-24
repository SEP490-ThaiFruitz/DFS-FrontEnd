// types/return-status.enum.ts

export enum ReturnExchangeRequestStatus {
  Pending = 0, // Yêu cầu mới, chờ duyệt
  Approved = 1, // Đã duyệt, chờ xử lý tiếp
  AwaitingCustomerReturn = 2, // Đang chờ khách gửi lại sản phẩm
  ProductReceived = 3, // Đã nhận được hàng trả từ khách
  Processing = 4, // Đang kiểm tra sản phẩm đổi/trả
  Completed = 5, // Hoàn tất (đã hoàn tiền hoặc gửi sản phẩm mới)
  Rejected = 6, // Từ chối yêu cầu
  Cancelled = 7, // Khách tự hủy hoặc hệ thống hủy yêu cầu
}

// types/return-status.enum.ts
export enum ReturnExchangeRequestStatusText {
  Pending = "Pending", // Yêu cầu mới, chờ duyệt
  Approved = "Approved", // Đã duyệt, chờ xử lý tiếp
  AwaitingCustomerReturn = "AwaitingCustomerReturn", // Đang chờ khách gửi lại sản phẩm
  ProductReceived = "ProductReceived", // Đã nhận được hàng trả từ khách
  Processing = "Processing", // Đang kiểm tra sản phẩm đổi/trả
  Completed = "Completed", // Hoàn tất (đã hoàn tiền hoặc gửi sản phẩm mới)
  Rejected = "Rejected", // Từ chối yêu cầu
  Cancelled = "Cancelled", // Khách tự hủy hoặc hệ thống hủy yêu cầu
}

export const returnStatusLabels: Record<ReturnExchangeRequestStatus, string> = {
  [ReturnExchangeRequestStatus.Pending]: "Yêu cầu mới",
  [ReturnExchangeRequestStatus.Approved]: "Đã duyệt",
  [ReturnExchangeRequestStatus.AwaitingCustomerReturn]: "Chờ khách hoàn hàng",
  [ReturnExchangeRequestStatus.ProductReceived]: "Đã nhận hàng trả",
  [ReturnExchangeRequestStatus.Processing]: "Đang xử lý",
  [ReturnExchangeRequestStatus.Completed]: "Hoàn tất",
  [ReturnExchangeRequestStatus.Rejected]: "Bị từ chối",
  [ReturnExchangeRequestStatus.Cancelled]: "Đã hủy",
};

export const returnExchangeLabel = (label: string) => {
  const labelLower = label?.toLowerCase();

  switch (labelLower) {
    case "pending":
      return "Yêu cầu mới";
    case "approved":
      return "Đã duyệt";
    case ReturnExchangeRequestStatusText.AwaitingCustomerReturn.toLocaleLowerCase():
      return "Chờ khách hoàn hàng";
    case ReturnExchangeRequestStatusText.ProductReceived.toLocaleLowerCase():
      return "Đã nhận hàng trả";
    case "processing":
      return "Đang xử lý";
    case "completed":
      return "Hoàn tất";
    case "rejected":
      return "Bị từ chối";
    case "cancelled":
      return "Đã hủy";
    default:
      return label;
  }
};

export const getStatusReturnExchangeStep = (status: string) => {
  const statusLower = status?.toLowerCase();

  switch (statusLower) {
    case "pending":
      return 0;
    case "approved":
      return 1;
    // case "awaitingCustomerReturn":
    case ReturnExchangeRequestStatusText.AwaitingCustomerReturn.toLocaleLowerCase():
      return 2;
    // case "productReceived":
    case ReturnExchangeRequestStatusText.ProductReceived.toLocaleLowerCase():
      return 3;
    case "processing":
      return 4;
    case "completed":
      return 5;
    case "rejected":
      return 6;
    case "cancelled":
      return 7;
    default:
      return 8;
  }
};

export const ReturnExchangeFlow = [
  "pending",
  "approved",
  "awaitingCustomerReturn",
  "productReceived",
  "processing",
  "completed",
  "rejected",
  "cancelled",
];

export const getNextStatusReturnExchangeStep = (status: string) => {
  const flow = ReturnExchangeFlow.map((s) => s.toLowerCase());
  const index = flow.indexOf(status?.toLowerCase());
  if (index !== -1 && index < ReturnExchangeFlow.length - 1) {
    return ReturnExchangeFlow[index + 1]; // trả về giá trị gốc theo flows
  }
  return null;
};

export const statusColorMap: Record<ReturnExchangeRequestStatus, string> = {
  [ReturnExchangeRequestStatus.Pending]: "bg-amber-100 text-amber-700",
  [ReturnExchangeRequestStatus.Approved]: "bg-green-100 text-green-700",
  [ReturnExchangeRequestStatus.AwaitingCustomerReturn]:
    "bg-blue-100 text-blue-700",
  [ReturnExchangeRequestStatus.ProductReceived]: "bg-blue-200 text-blue-800",
  [ReturnExchangeRequestStatus.Processing]: "bg-yellow-100 text-yellow-700",
  [ReturnExchangeRequestStatus.Completed]: "bg-emerald-100 text-emerald-700",
  [ReturnExchangeRequestStatus.Rejected]: "bg-red-100 text-red-700",
  [ReturnExchangeRequestStatus.Cancelled]: "bg-neutral-200 text-neutral-600",
};

// Returned,          // Đơn hàng đã được trả lại
//     Exchanged,
//     Completed
