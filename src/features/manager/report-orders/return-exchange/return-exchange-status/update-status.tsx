import { Badge } from "@/components/ui/badge";
import {
  getNextStatusReturnExchangeStep,
  returnExchangeLabel,
  ReturnExchangeRequestStatusText,
} from "./status";
import { ToolTipCustomized } from "@/components/custom/tool-tip-customized";
import { Check, CircleChevronRight, Package } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

import Cookies from "js-cookie";

import {
  Clock,
  CheckCircle,
  Settings,
  XCircle,
  Undo2,
  MailCheck,
} from "lucide-react";
import { JSX } from "react";
import { UpdateStatusButton } from "../../order-status-badge";
import axios from "axios";
import { API } from "@/app/key/url";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ORDERS_KEY } from "@/app/key/manager-key";
export const returnExchangeStatusIcon = (
  status: string
): JSX.Element | null => {
  const iconSize = "size-6";

  switch (status) {
    case "pending":
      return <Clock className={`${iconSize} text-amber-600`} />;
    case "approved":
      return <MailCheck className={`${iconSize} text-green-600`} />;
    case ReturnExchangeRequestStatusText.AwaitingCustomerReturn.toLowerCase():
      return <Undo2 className={`${iconSize} text-blue-600`} />;
    case ReturnExchangeRequestStatusText.ProductReceived.toLowerCase():
      return <Package className={`${iconSize} text-blue-600`} />;
    case "processing":
      return <Settings className={`${iconSize} text-yellow-600`} />;
    case "completed":
      return <Check className={`${iconSize} text-green-600`} />;
    case "rejected":
    case "cancelled":
      return <XCircle className={`${iconSize} text-red-600`} />;
    default:
      return null;
  }
};
interface UpdateReturnExchangeStatusProps {
  status: string;
  requestId: string;
}
export const UpdateReturnExchangeStatus = ({
  status,
  requestId,
}: UpdateReturnExchangeStatusProps) => {
  const currentStatus = returnExchangeLabel(status); // Get the current status from props or state
  const statusTextNext = getNextStatusReturnExchangeStep(status); // Get the next status text

  const statusTextNextLabel = returnExchangeLabel(statusTextNext ?? ""); // Get the next status label

  const token = Cookies.get("accessToken");

  const [ConfirmDialog, confirm] = useConfirm(
    "Cập nhật trạng thái đơn hàng",
    `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng từ "${currentStatus} sang "${statusTextNextLabel}" không?`
  );

  const queryClient = useQueryClient();

  const onUpdateStatus = async () => {
    try {
      const ok = await confirm();

      if (!ok) return;

      const response = await axios.patch(
        `${API}/Orders/${requestId}/return-exchange/status`,
        {
          id: requestId,
          status: statusTextNext,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log({ response });

      if (response.status === 200) {
        // Handle success, e.g., show a success message or refresh data
        // console.log("Status updated successfully:", response.data);

        queryClient.invalidateQueries({
          queryKey: [ORDERS_KEY.RETURN_EXCHANGE],
        });
        queryClient.invalidateQueries({
          queryKey: [ORDERS_KEY.ORDERS_LIST],
        });
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
      } else {
        // Handle error, e.g., show an error message
        console.error("Error updating status:", response.data);
      }
    } catch (error) {}
  };

  return (
    <>
      <ConfirmDialog />

      {/* <Badge>{returnExchangeLabel(status)}</Badge> */}

      <UpdateStatusButton
        status={statusTextNextLabel as string}
        onClick={onUpdateStatus}
        className="font-semibold text-sm text-slate-700"
      />
    </>
  );
};
