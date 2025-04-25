"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, SquareXIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import { API } from "@/app/key/url";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { USER_KEY } from "@/app/key/user-key";
import { ORDERS_KEY } from "@/app/key/manager-key";

interface CancelWithdrawalDialogProps {
  requestId: string;
}

const CANCEL_REASONS = [
  {
    id: "unsealed_used",
    text: "Sản phẩm đã được mở bao bì hoặc sử dụng",
  },
  {
    id: "not_defective_enough",
    text: "Tình trạng sản phẩm không đủ điều kiện đổi trả",
  },
  {
    id: "evidence_insufficient",
    text: "Bằng chứng không rõ ràng hoặc thiếu minh chứng",
  },
  {
    id: "wrong_return_reason",
    text: "Lý do trả hàng không phù hợp với tình trạng sản phẩm",
  },
  {
    id: "customer_changed_mind_used",
    text: "Khách thay đổi ý định nhưng sản phẩm không còn nguyên vẹn",
  },
  {
    id: "duplicate_request",
    text: "Yêu cầu đổi trả trùng lặp",
  },
  {
    id: "other",
    text: "Lý do khác",
  },
];

export function RejectRequestReturnExchangeDialog({
  requestId,
}: CancelWithdrawalDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const token = Cookies.get("accessToken");

  const queryClient = useQueryClient();

  const handleCancel = async () => {
    if (!selectedReasonId) {
      setStatus("error");
      setErrorMessage("Vui lòng chọn lý do hủy yêu cầu đổi trả!");
      return;
    }

    if (selectedReasonId === "other" && !customReason.trim()) {
      setStatus("error");
      setErrorMessage("Vui lòng nhập lý do hủy yêu cầu đổi trả!");
      return;
    }

    setIsSubmitting(true);
    setStatus("loading");

    const finalReason =
      selectedReasonId === "other"
        ? customReason
        : CANCEL_REASONS.find((reason) => reason.id === selectedReasonId)
            ?.text || "";

    try {
      const response = await axios.patch(
        `${API}/Orders/request-exchange/${requestId}/reject`,
        finalReason,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      queryClient.invalidateQueries({
        queryKey: [ORDERS_KEY.RETURN_EXCHANGE],
      });

      queryClient.invalidateQueries({
        queryKey: [ORDERS_KEY.ORDERS_LIST],
      });

      queryClient.invalidateQueries({
        queryKey: [ORDERS_KEY.ORDER_LIST_DETAIL],
      });

      setStatus("success");
      toast.success("Đã hủy yêu cầu đổi trả thành công!");
      // setTimeout(() => {
      //   setOpen(false);
      //   resetState();
      //   if (onSuccess) onSuccess();
      // }, 1500);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Đã xảy ra lỗi khi hủy yêu cầu đổi trả. Vui lòng thử lại sau."
      );
      toast.error(
        "Đã xảy ra lỗi khi hủy yêu cầu đổi trả. Vui lòng thử lại sau."
      );
      // if (onError && error instanceof Error) onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setSelectedReasonId("");
    setCustomReason("");
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center gap-1"
          size="sm"
        >
          <SquareXIcon className="size-4" />
          Hủy yêu cầu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Hủy yêu cầu đổi trả
          </DialogTitle>
          <DialogDescription>
            Vui lòng chọn lý do bạn muốn hủy yêu cầu đổi trả này.
          </DialogDescription>
        </DialogHeader>

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium">Đã hủy thành công</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Yêu cầu đổi trả của bạn đã được hủy thành công.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <RadioGroup
              value={selectedReasonId}
              onValueChange={setSelectedReasonId}
              className="space-y-3"
              disabled={isSubmitting}
            >
              {CANCEL_REASONS.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id} className="cursor-pointer">
                    {reason.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedReasonId === "other" && (
              <Textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do hủy yêu cầu  đổi trả..."
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
            )}
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Đóng
          </Button>
          {status !== "success" && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận hủy"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
